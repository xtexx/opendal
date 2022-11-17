// Copyright 2022 Datafuse Labs.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

use std::io::Error;
use std::io::ErrorKind;
use std::io::Result;

use anyhow::anyhow;
use async_trait::async_trait;
use futures::io::Cursor;
use futures::AsyncReadExt;

use super::Adapter;
use crate::error::ObjectError;
use crate::ops::OpCreate;
use crate::ops::OpDelete;
use crate::ops::OpRead;
use crate::ops::OpStat;
use crate::ops::OpWrite;
use crate::ops::Operation;
use crate::path::normalize_root;
use crate::Accessor;
use crate::AccessorMetadata;
use crate::BytesReader;
use crate::ObjectMetadata;
use crate::ObjectMode;
use crate::ObjectReader;

/// Backend of kv service.
#[derive(Debug, Clone)]
pub struct Backend<S: Adapter> {
    kv: S,
    root: String,
}

impl<S> Backend<S>
where
    S: Adapter,
{
    /// Create a new kv backend.
    pub fn new(kv: S) -> Self {
        Self {
            kv,
            root: "/".to_string(),
        }
    }

    /// Configure root within this backend.
    pub fn with_root(mut self, root: &str) -> Self {
        self.root = normalize_root(root);
        self
    }
}

#[async_trait]
impl<S> Accessor for Backend<S>
where
    S: Adapter,
{
    fn metadata(&self) -> AccessorMetadata {
        let mut am: AccessorMetadata = self.kv.metadata().into();
        am.set_root(&self.root);

        am
    }

    async fn create(&self, path: &str, args: OpCreate) -> Result<()> {
        match args.mode() {
            ObjectMode::FILE => self.kv.set(path.as_bytes(), &[]).await,
            _ => Ok(()),
        }
    }

    async fn read(&self, path: &str, args: OpRead) -> Result<ObjectReader> {
        let mut bs = match self.kv.get(path.as_bytes()).await? {
            Some(bs) => bs,
            None => {
                return Err(Error::new(
                    ErrorKind::NotFound,
                    ObjectError::new(Operation::Read, path, anyhow!("key {path} is not found")),
                ))
            }
        };

        let br = args.range();
        let bs = match (br.offset(), br.size()) {
            (Some(offset), Some(size)) => {
                let mut bs = bs.split_off(offset as usize);
                if (size as usize) < bs.len() {
                    let _ = bs.split_off(size as usize);
                }
                bs
            }
            (Some(offset), None) => bs.split_off(offset as usize),
            (None, Some(size)) => bs.split_off(bs.len() - size as usize),
            (None, None) => bs,
        };

        let length = bs.len();
        Ok(ObjectReader::new(Box::new(Cursor::new(bs)))
            .with_meta(ObjectMetadata::new(ObjectMode::FILE).with_content_length(length as u64)))
    }

    async fn write(&self, path: &str, args: OpWrite, mut r: BytesReader) -> Result<u64> {
        let mut bs = Vec::with_capacity(args.size() as usize);
        r.read_to_end(&mut bs).await?;

        self.kv.set(path.as_bytes(), &bs).await?;

        Ok(args.size())
    }

    async fn stat(&self, path: &str, _: OpStat) -> Result<ObjectMetadata> {
        if path.ends_with('/') {
            Ok(ObjectMetadata::new(ObjectMode::DIR))
        } else {
            let bs = self.kv.get(path.as_bytes()).await?;
            match bs {
                Some(bs) => {
                    Ok(ObjectMetadata::new(ObjectMode::FILE).with_content_length(bs.len() as u64))
                }
                None => Err(Error::new(
                    ErrorKind::NotFound,
                    ObjectError::new(Operation::Stat, path, anyhow!("key {path} is not found")),
                )),
            }
        }
    }

    async fn delete(&self, path: &str, _: OpDelete) -> Result<()> {
        self.kv.delete(path.as_bytes()).await?;
        Ok(())
    }
}
