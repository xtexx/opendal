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

#![doc(
    html_logo_url = "https://raw.githubusercontent.com/apache/opendal/main/website/static/img/logo.svg"
)]
#![cfg_attr(docsrs, feature(doc_auto_cfg))]

//! Apache OpenDAL™ is an Open Data Access Layer that enables seamless interaction with diverse storage services.
//!
//! OpenDAL's development is guided by its vision of **One Layer, All Storage** and its core principles: **Open Community**, **Solid Foundation**, **Fast Access**, **Object Storage First**, and **Extensible Architecture**. Read the explained vision at [OpenDAL Vision](https://opendal.apache.org/vision).
//!
//! # Quick Start
//!
//! OpenDAL's API entry points are [`Operator`] and [`blocking::Operator`]. All
//! public APIs are accessible through the operator. To utilize OpenDAL, you
//! need to:
//!
//! - [Init a service](#init-a-service)
//! - [Compose layers](#compose-layers)
//! - [Use operator](#use-operator)
//!
//! ## Init a service
//!
//! The first step is to pick a service and init it with a builder. All supported
//! services could be found at [`services`].
//!
//! Let's take [`services::S3`] as an example:
//!
//! ```no_run
//! use opendal::services;
//! use opendal::Operator;
//! use opendal::Result;
//!
//! fn main() -> Result<()> {
//!     // Pick a builder and configure it.
//!     let mut builder = services::S3::default().bucket("test");
//!
//!     // Init an operator
//!     let op = Operator::new(builder)?.finish();
//!     Ok(())
//! }
//! ```
//!
//! ## Compose layers
//!
//! The next setup is to compose layers. Layers are modules that provide extra
//! features for every operation. All builtin layers could be found at [`layers`].
//!
//! Let's use [`layers::LoggingLayer`] as an example; this layer adds logging to
//! every operation that OpenDAL performs.
//!
//! ```no_run
//! use opendal::layers::LoggingLayer;
//! use opendal::services;
//! use opendal::Operator;
//! use opendal::Result;
//!
//! #[tokio::main]
//! async fn main() -> Result<()> {
//!     // Pick a builder and configure it.
//!     let mut builder = services::S3::default().bucket("test");
//!
//!     // Init an operator
//!     let op = Operator::new(builder)?
//!         // Init with logging layer enabled.
//!         .layer(LoggingLayer::default())
//!         .finish();
//!
//!     Ok(())
//! }
//! ```
//!
//! ## Use operator
//!
//! The final step is to use the operator. OpenDAL supports both async [`Operator`]
//! and blocking [`blocking::Operator`]. Please pick the one that fits your use case.
//!
//! Every Operator API follows a consistent pattern. For example, consider the `read` operation:
//!
//! - [`Operator::read`]: Executes a read operation.
//! - [`Operator::read_with`]: Executes a read operation with additional options using the builder pattern.
//! - [`Operator::read_options`]: Executes a read operation with extra options provided via a [`options::ReadOptions`] struct.
//! - [`Operator::reader`]: Creates a reader for streaming data, allowing for flexible access.
//! - [`Operator::reader_with`]: Creates a reader with advanced options using the builder pattern.
//! - [`Operator::reader_options`]: Creates a reader with extra options provided via a [`options::ReadOptions`] struct.
//!
//! The [`Reader`] created by [`Operator`] supports custom read control methods and can be converted
//! into [`futures::AsyncRead`] or [`futures::Stream`] for broader ecosystem compatibility.
//!
//! ```no_run
//! use opendal::layers::LoggingLayer;
//! use opendal::options;
//! use opendal::services;
//! use opendal::Operator;
//! use opendal::Result;
//!
//! #[tokio::main]
//! async fn main() -> Result<()> {
//!     // Pick a builder and configure it.
//!     let mut builder = services::S3::default().bucket("test");
//!
//!     // Init an operator
//!     let op = Operator::new(builder)?
//!         // Init with logging layer enabled.
//!         .layer(LoggingLayer::default())
//!         .finish();
//!
//!     // Fetch this file's metadata
//!     let meta = op.stat("hello.txt").await?;
//!     let length = meta.content_length();
//!
//!     // Read data from `hello.txt` with options.
//!     let bs = op
//!         .read_with("hello.txt")
//!         .range(0..8 * 1024 * 1024)
//!         .chunk(1024 * 1024)
//!         .concurrent(4)
//!         .await?;
//!
//!     // The same to:
//!     let bs = op
//!         .read_options("hello.txt", options::ReadOptions {
//!             range: (0..8 * 1024 * 1024).into(),
//!             chunk: Some(1024 * 1024),
//!             concurrent: 4,
//!             ..Default::default()
//!         })
//!         .await?;
//!
//!     Ok(())
//! }
//! ```
//!
//! # Useful Links
//!
//! - [Concept][crate::docs::concepts]
//! - [Internals][crate::docs::internals]
//! - [Performance Guide][crate::docs::performance]

// Make sure all our public APIs have docs.
#![deny(missing_docs)]

// Private module with public types, they will be accessed via `opendal::Xxxx`
mod types;
pub use types::*;

// Public modules, they will be accessed like `opendal::layers::Xxxx`
#[cfg(feature = "blocking")]
pub mod blocking;
#[cfg(docsrs)]
pub mod docs;
pub mod layers;
pub mod raw;
pub mod services;

#[cfg(test)]
mod tests {
    use std::mem::size_of;

    use super::*;
    /// This is not a real test case.
    ///
    /// We assert our public structs here to make sure we don't introduce
    /// unexpected struct/enum size change.
    #[cfg(target_pointer_width = "64")]
    #[test]
    fn assert_size() {
        assert_eq!(16, size_of::<Operator>());
        assert_eq!(320, size_of::<Entry>());
        assert_eq!(296, size_of::<Metadata>());
        assert_eq!(1, size_of::<EntryMode>());
        assert_eq!(24, size_of::<Scheme>());
    }

    trait AssertSendSync: Send + Sync {}
    impl AssertSendSync for Entry {}
    impl AssertSendSync for Capability {}
    impl AssertSendSync for Error {}
    impl AssertSendSync for Reader {}
    impl AssertSendSync for Writer {}
    impl AssertSendSync for Lister {}
    impl AssertSendSync for Operator {}

    /// This is used to make sure our public API implement Send + Sync
    #[test]
    fn test_trait() {
        let _: Box<dyn AssertSendSync> = Box::new(Capability::default());
    }
}
