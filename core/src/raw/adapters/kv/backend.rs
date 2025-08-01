// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

use std::sync::Arc;

use super::Adapter;
use super::Scan;
use crate::raw::oio::HierarchyLister;
use crate::raw::oio::QueueBuf;
use crate::raw::*;
use crate::*;

/// Backend of kv service. If the storage service is one k-v-like service, it should implement this kv [`Backend`] by right.
///
/// `Backend` implements one general logic on how to read, write, scan the data from one kv store efficiently.
/// And the [`Adapter`] held by `Backend` will handle how to communicate with one k-v-like service really and provides
/// a series of basic operation for this service.
///
/// OpenDAL developer can implement one new k-v store backend easily with help of this Backend.
#[derive(Debug, Clone)]
pub struct Backend<S: Adapter> {
    kv: Arc<S>,
    root: String,
    info: Arc<AccessorInfo>,
}

impl<S> Backend<S>
where
    S: Adapter,
{
    /// Create a new kv backend.
    pub fn new(kv: S) -> Self {
        let kv_info = kv.info();
        Self {
            kv: Arc::new(kv),
            root: "/".to_string(),
            info: {
                let am: AccessorInfo = AccessorInfo::default();
                am.set_root("/");
                am.set_scheme(kv_info.scheme().into_static());
                am.set_name(kv_info.name());

                let mut cap = kv_info.capabilities();
                if cap.read {
                    cap.stat = true;
                }

                if cap.write {
                    cap.write_can_empty = true;
                    cap.delete = true;
                }

                if cap.list {
                    cap.list_with_recursive = true;
                }

                am.set_native_capability(cap);

                am.into()
            },
        }
    }

    /// Configure root within this backend.
    pub fn with_root(self, root: &str) -> Self {
        self.with_normalized_root(normalize_root(root))
    }

    /// Configure root within this backend.
    ///
    /// This method assumes root is normalized.
    pub(crate) fn with_normalized_root(mut self, root: String) -> Self {
        let root = normalize_root(&root);
        self.info.set_root(&root);
        self.root = root;
        self
    }
}

impl<S: Adapter> Access for Backend<S> {
    type Reader = Buffer;
    type Writer = KvWriter<S>;
    type Lister = HierarchyLister<KvLister<S::Scanner>>;
    type Deleter = oio::OneShotDeleter<KvDeleter<S>>;

    fn info(&self) -> Arc<AccessorInfo> {
        self.info.clone()
    }

    async fn stat(&self, path: &str, _: OpStat) -> Result<RpStat> {
        let p = build_abs_path(&self.root, path);

        if p == build_abs_path(&self.root, "") {
            Ok(RpStat::new(Metadata::new(EntryMode::DIR)))
        } else {
            let bs = self.kv.get(&p).await?;
            match bs {
                Some(bs) => Ok(RpStat::new(
                    Metadata::new(EntryMode::FILE).with_content_length(bs.len() as u64),
                )),
                None => Err(Error::new(ErrorKind::NotFound, "kv doesn't have this path")),
            }
        }
    }

    async fn read(&self, path: &str, args: OpRead) -> Result<(RpRead, Self::Reader)> {
        let p = build_abs_path(&self.root, path);
        let bs = match self.kv.get(&p).await? {
            Some(bs) => bs,
            None => return Err(Error::new(ErrorKind::NotFound, "kv doesn't have this path")),
        };
        Ok((RpRead::new(), bs.slice(args.range().to_range_as_usize())))
    }

    async fn write(&self, path: &str, _: OpWrite) -> Result<(RpWrite, Self::Writer)> {
        let p = build_abs_path(&self.root, path);

        Ok((RpWrite::new(), KvWriter::new(self.kv.clone(), p)))
    }

    async fn delete(&self) -> Result<(RpDelete, Self::Deleter)> {
        Ok((
            RpDelete::default(),
            oio::OneShotDeleter::new(KvDeleter::new(self.kv.clone(), self.root.clone())),
        ))
    }

    async fn list(&self, path: &str, args: OpList) -> Result<(RpList, Self::Lister)> {
        let p = build_abs_path(&self.root, path);
        let res = self.kv.scan(&p).await?;
        let lister = KvLister::new(&self.root, res);
        let lister = HierarchyLister::new(lister, path, args.recursive());

        Ok((RpList::default(), lister))
    }
}

pub struct KvLister<Iter> {
    root: String,
    inner: Iter,
}

impl<Iter> KvLister<Iter>
where
    Iter: Scan,
{
    fn new(root: &str, inner: Iter) -> Self {
        Self {
            root: root.to_string(),
            inner,
        }
    }

    async fn inner_next(&mut self) -> Result<Option<oio::Entry>> {
        Ok(self.inner.next().await?.map(|v| {
            let mode = if v.ends_with('/') {
                EntryMode::DIR
            } else {
                EntryMode::FILE
            };
            let mut path = build_rel_path(&self.root, &v);
            if path.is_empty() {
                path = "/".to_string();
            }
            oio::Entry::new(&path, Metadata::new(mode))
        }))
    }
}

impl<Iter> oio::List for KvLister<Iter>
where
    Iter: Scan,
{
    async fn next(&mut self) -> Result<Option<oio::Entry>> {
        self.inner_next().await
    }
}

pub struct KvWriter<S> {
    kv: Arc<S>,
    path: String,
    buffer: QueueBuf,
}

impl<S> KvWriter<S> {
    fn new(kv: Arc<S>, path: String) -> Self {
        KvWriter {
            kv,
            path,
            buffer: QueueBuf::new(),
        }
    }
}

/// # Safety
///
/// We will only take `&mut Self` reference for KvWriter.
unsafe impl<S: Adapter> Sync for KvWriter<S> {}

impl<S: Adapter> oio::Write for KvWriter<S> {
    async fn write(&mut self, bs: Buffer) -> Result<()> {
        self.buffer.push(bs);
        Ok(())
    }

    async fn close(&mut self) -> Result<Metadata> {
        let buf = self.buffer.clone().collect();
        let length = buf.len() as u64;
        self.kv.set(&self.path, buf).await?;

        let meta = Metadata::new(EntryMode::from_path(&self.path)).with_content_length(length);
        Ok(meta)
    }

    async fn abort(&mut self) -> Result<()> {
        self.buffer.clear();
        Ok(())
    }
}

pub struct KvDeleter<S> {
    kv: Arc<S>,
    root: String,
}

impl<S> KvDeleter<S> {
    fn new(kv: Arc<S>, root: String) -> Self {
        KvDeleter { kv, root }
    }
}

impl<S: Adapter> oio::OneShotDelete for KvDeleter<S> {
    async fn delete_once(&self, path: String, _: OpDelete) -> Result<()> {
        let p = build_abs_path(&self.root, &path);

        self.kv.delete(&p).await?;
        Ok(())
    }
}
