/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/* tslint:disable */
/* eslint-disable */

/* auto-generated by NAPI-RS */

export class ExternalObject<T> {
  readonly '': {
    readonly '': unique symbol
    [K: symbol]: T
  }
}
export interface StatOptions {
  /**
  * Sets version for this operation.
  * Retrieves data of a specified version of the given path.
  */
  version?: string
  /**
  * Sets if-match condition for this operation.
  * If file exists and its etag doesn't match, an error will be returned.
  */
  ifMatch?: string
  /**
  * Sets if-none-match condition for this operation.
  * If file exists and its etag matches, an error will be returned.
  */
  ifNoneMatch?: string
  /**
  * Sets if-modified-since condition for this operation.
  * If file exists and hasn't been modified since the specified time, an error will be returned.
  * ISO 8601 formatted date string
  * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
  */
  ifModifiedSince?: string
  /**
  * Sets if-unmodified-since condition for this operation.
  * If file exists and has been modified since the specified time, an error will be returned.
  * ISO 8601 formatted date string
  * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
  */
  ifUnmodifiedSince?: string
  /**
  * Specifies the content-type header for presigned operations.
  * Only meaningful when used along with presign.
  */
  overrideContentType?: string
  /**
  * Specifies the cache-control header for presigned operations.
  * Only meaningful when used along with presign.
  */
  overrideCacheControl?: string
  /**
  * Specifies the content-disposition header for presigned operations.
  * Only meaningful when used along with presign.
  */
  overrideContentDisposition?: string
}
export interface ReadOptions {
  /**
  * Set `version` for this operation.
  *
  * This option can be used to retrieve the data of a specified version of the given path.
  */
  version?: string
  /**
  * Set `concurrent` for the operation.
  *
  * OpenDAL by default to read file without concurrent. This is not efficient for cases when users
  * read large chunks of data. By setting `concurrent`, opendal will reading files concurrently
  * on support storage services.
  *
  * By setting `concurrent`, opendal will fetch chunks concurrently with
  * the give chunk size.
  */
  concurrent?: number
  /**
  * Sets the chunk size for this operation.
  *
  * OpenDAL will use services' preferred chunk size by default. Users can set chunk based on their own needs.
  */
  chunk?: number
  /**
  * Controls the optimization strategy for range reads in [`Reader::fetch`].
  *
  * When performing range reads, if the gap between two requested ranges is smaller than
  * the configured `gap` size, OpenDAL will merge these ranges into a single read request
  * and discard the unrequested data in between. This helps reduce the number of API calls
  * to remote storage services.
  *
  * This optimization is particularly useful when performing multiple small range reads
  * that are close to each other, as it reduces the overhead of multiple network requests
  * at the cost of transferring some additional data.
  */
  gap?: bigint
  /**
  * Sets the offset (starting position) for range read operations.
  * The read will start from this position in the file.
  */
  offset?: bigint
  /**
  * Sets the size (length) for range read operations.
  * The read will continue for this many bytes after the offset.
  */
  size?: bigint
  /**
  * Sets if-match condition for this operation.
  * If file exists and its etag doesn't match, an error will be returned.
  */
  ifMatch?: string
  /**
  * Sets if-none-match condition for this operation.
  * If file exists and its etag matches, an error will be returned.
  */
  ifNoneMatch?: string
  /**
  * Sets if-modified-since condition for this operation.
  * If file exists and hasn't been modified since the specified time, an error will be returned.
  * ISO 8601 formatted date string
  * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
  */
  ifModifiedSince?: string
  /**
  * Sets if-unmodified-since condition for this operation.
  * If file exists and has been modified since the specified time, an error will be returned.
  * ISO 8601 formatted date string
  * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
  */
  ifUnmodifiedSince?: string
  /**
  * Specify the `content-type` header that should be sent back by the operation.
  *
  * This option is only meaningful when used along with presign.
  */
  contentType?: string
  /**
  * Specify the `cache-control` header that should be sent back by the operation.
  *
  * This option is only meaningful when used along with presign.
  */
  cacheControl?: string
  /**
  * Specify the `content-disposition` header that should be sent back by the operation.
  *
  * This option is only meaningful when used along with presign.
  */
  contentDisposition?: string
}
export interface ReaderOptions {
  /**
  * Set `version` for this operation.
  *
  * This option can be used to retrieve the data of a specified version of the given path.
  */
  version?: string
  /**
  * Set `concurrent` for the operation.
  *
  * OpenDAL by default to read file without concurrent. This is not efficient for cases when users
  * read large chunks of data. By setting `concurrent`, opendal will reading files concurrently
  * on support storage services.
  *
  * By setting `concurrent`, opendal will fetch chunks concurrently with
  * the give chunk size.
  */
  concurrent?: number
  /**
  * Sets the chunk size for this operation.
  *
  * OpenDAL will use services' preferred chunk size by default. Users can set chunk based on their own needs.
  */
  chunk?: number
  /** Controls the number of prefetched bytes ranges that can be buffered in memory
  * during concurrent reading.
  *
  * When performing concurrent reads with `Reader`, this option limits how many
  * completed-but-not-yet-read chunks can be buffered. Once the number of buffered
  * chunks reaches this limit, no new read tasks will be spawned until some of the
  * buffered chunks are consumed.
  *
  * - Default value: 0 (no prefetching, strict back-pressure control)
  * - Set to a higher value to allow more aggressive prefetching at the cost of memory
  *
  * This option helps prevent memory exhaustion when reading large files with high
  * concurrency settings.
  */
  prefetch?: number
  /**
  * Controls the optimization strategy for range reads in [`Reader::fetch`].
  *
  * When performing range reads, if the gap between two requested ranges is smaller than
  * the configured `gap` size, OpenDAL will merge these ranges into a single read request
  * and discard the unrequested data in between. This helps reduce the number of API calls
  * to remote storage services.
  *
  * This optimization is particularly useful when performing multiple small range reads
  * that are close to each other, as it reduces the overhead of multiple network requests
  * at the cost of transferring some additional data.
  */
  gap?: bigint
  /**
  * Sets if-match condition for this operation.
  * If file exists and its etag doesn't match, an error will be returned.
  */
  ifMatch?: string
  /**
  * Sets if-none-match condition for this operation.
  * If file exists and its etag matches, an error will be returned.
  */
  ifNoneMatch?: string
  /**
  * Sets if-modified-since condition for this operation.
  * If file exists and hasn't been modified since the specified time, an error will be returned.
  * ISO 8601 formatted date string
  * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
  */
  ifModifiedSince?: string
  /**
  * Sets if-unmodified-since condition for this operation.
  * If file exists and has been modified since the specified time, an error will be returned.
  * ISO 8601 formatted date string
  * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
  */
  ifUnmodifiedSince?: string
}
export interface ListOptions {
  /**
  * The limit passed to underlying service to specify the max results
  * that could return per-request.
  *
  * Users could use this to control the memory usage of list operation.
  */
  limit?: number
  /**
  * The start_after passed to underlying service to specify the specified key
  * to start listing from.
  */
  startAfter?: string
  /**
  * The recursive is used to control whether the list operation is recursive.
  *
  * - If `false`, list operation will only list the entries under the given path.
  * - If `true`, list operation will list all entries that starts with given path.
  *
  * Default to `false`.
  */
  recursive?: boolean
  /**
  * The versions is used to control whether the object versions should be returned.
  *
  * - If `false`, list operation will not return with object versions
  * - If `true`, list operation will return with object versions if object versioning is supported
  *   by the underlying service
  *
  * Default to `false`
  */
  versions?: boolean
  /**
  * The deleted is used to control whether the deleted objects should be returned.
  *
  * - If `false`, list operation will not return with deleted objects
  * - If `true`, list operation will return with deleted objects if object versioning is supported
  *   by the underlying service
  *
  * Default to `false`
  */
  deleted?: boolean
}
export interface WriteOptions {
  /**
   * Append bytes into a path.
   *
   * ### Notes
   *
   * - It always appends content to the end of the file.
   * - It will create file if the path does not exist.
   */
  append?: boolean
  /**
   * Set the chunk of op.
   *
   * If chunk is set, the data will be chunked by the underlying writer.
   *
   * ## NOTE
   *
   * A service could have their own minimum chunk size while perform write
   * operations like multipart uploads. So the chunk size may be larger than
   * the given buffer size.
   */
  chunk?: bigint
  /** Set the [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) of op. */
  contentType?: string
  /** Set the [Content-Disposition](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition) of op. */
  contentDisposition?: string
  /** Set the [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) of op. */
  cacheControl?: string
  /** Set the [Content-Encoding] https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Encoding of op. */
  contentEncoding?: string
  /**
   * Sets user metadata of op.
   *
   * If chunk is set, the user metadata will be attached to the object during write.
   *
   * ## NOTE
   *
   * - Services may have limitations for user metadata, for example:
   *   - Key length is typically limited (e.g., 1024 bytes)
   *   - Value length is typically limited (e.g., 4096 bytes)
   *   - Total metadata size might be limited
   *   - Some characters might be forbidden in keys
   */
  userMetadata?: Record<string, string>
  /**
   * Sets if-match condition of op.
   *
   * This operation provides conditional write functionality based on ETag matching,
   * helping prevent unintended overwrites in concurrent scenarios.
   */
  ifMatch?: string
  /**
   * Sets if-none-match condition of op.
   *
   * This operation provides conditional write functionality based on ETag non-matching,
   * useful for preventing overwriting existing resources or ensuring unique writes.
   */
  ifNoneMatch?: string
  /**
   * Sets if_not_exists condition of op.
   *
   * This operation provides a way to ensure write operations only create new resources
   * without overwriting existing ones, useful for implementing "create if not exists" logic.
   */
  ifNotExists?: boolean
  /**
   * Sets concurrent of op.
   *
   * - By default, OpenDAL writes files sequentially
   * - When concurrent is set:
   *   - Multiple write operations can execute in parallel
   *   - Write operations return immediately without waiting if tasks space are available
   *   - Close operation ensures all writes complete in order
   *   - Memory usage increases with concurrency level
   */
  concurrent?: number
}
export interface DeleteOptions {
  version?: string
}
export const enum EntryMode {
  /** FILE means the path has data to read. */
  FILE = 0,
  /** DIR means the path can be listed. */
  DIR = 1,
  /** Unknown means we don't know what we can do on this path. */
  Unknown = 2
}
/** PresignedRequest is a presigned request return by `presign`. */
export interface PresignedRequest {
  /** HTTP method of this request. */
  method: string
  /** URL of this request. */
  url: string
  /** HTTP headers of this request. */
  headers: Record<string, string>
}
/**
 * Capability is used to describe what operations are supported
 *  by the current Operator.
 *
 * Via capability, we can know:
 *
 * - Whether current Operator supports `read` or not.
 * - Whether current Operator supports `read` with if match or not.
 * - What's current Operator max supports batch operations count.
 *
 * Add fields of Capabilities to be public and can be accessed directly.
 */
export class Capability {
  /** If operator supports stat. */
  get stat(): boolean
  /** If operator supports stat with if matched. */
  get statWithIfMatch(): boolean
  /** If operator supports stat with if not match. */
  get statWithIfNoneMatch(): boolean
  /** If operator supports stat with if modified since. */
  get statWithIfModifiedSince(): boolean
  /** If operator supports stat with if unmodified since. */
  get statWithIfUnmodifiedSince(): boolean
  /** If operator supports stat with versions. */
  get statWithVersion(): boolean
  /** If operator supports stat with override content type. */
  get statWithOverrideContentType(): boolean
  /** If operator supports stat with override cache control. */
  get statWithOverrideCacheControl(): boolean
  /** If operator supports stat with override content disposition. */
  get statWithOverrideContentDisposition(): boolean
  /** If operator supports read. */
  get read(): boolean
  /** If operator supports read with version. */
  get readWithVersion(): boolean
  /** If operator supports read with range. */
  get readWithIfModifiedSince(): boolean
  /** If operator supports read with if unmodified since. */
  get readWithIfUnmodifiedSince(): boolean
  /** If operator supports read with if matched. */
  get readWithIfMatch(): boolean
  /** If operator supports read with if not match. */
  get readWithIfNoneMatch(): boolean
  /** if operator supports read with override cache control. */
  get readWithOverrideCacheControl(): boolean
  /** if operator supports `read` with override content disposition. */
  get readWithOverrideContentDisposition(): boolean
  /** if operator supports read with override content type. */
  get readWithOverrideContentType(): boolean
  /** If operator supports write. */
  get write(): boolean
  /** If operator supports write can be called in multi times. */
  get writeCanMulti(): boolean
  /** If operator supports write with empty content. */
  get writeCanEmpty(): boolean
  /** If operator supports write by append. */
  get writeCanAppend(): boolean
  /** If operator supports write with content type. */
  get writeWithContentType(): boolean
  /** If operator supports write with content disposition. */
  get writeWithContentDisposition(): boolean
  /** If operator supports write with cache control. */
  get writeWithCacheControl(): boolean
  /** If operator supports write with content encoding. */
  get writeWithContentEncoding(): boolean
  /** If operator supports write with user metadata. */
  get writeWithUserMetadata(): boolean
  /** If operator supports write with if match. */
  get writeWithIfMatch(): boolean
  /** If operator supports write with if none match. */
  get writeWithIfNoneMatch(): boolean
  /** If operator supports write with if not exists. */
  get writeWithIfNotExists(): boolean
  /**
   * write_multi_max_size is the max size that services support in write_multi.
   *
   * For example, AWS S3 supports 5GiB as max in write_multi.
   */
  get writeMultiMaxSize(): bigint | null
  /**
   * write_multi_min_size is the min size that services support in write_multi.
   *
   * For example, AWS S3 requires at least 5MiB in write_multi expect the last one.
   */
  get writeMultiMinSize(): bigint | null
  /**
   * write_total_max_size is the max size that services support in write_total.
   *
   * For example, Cloudflare D1 supports 1MB as max in write_total.
   */
  get writeTotalMaxSize(): bigint | null
  /** If operator supports create dir. */
  get createDir(): boolean
  /** If operator supports delete. */
  get delete(): boolean
  /** If operator supports delete by version. */
  get deleteWithVersion(): boolean
  /** If operator supports copy. */
  get copy(): boolean
  /** If operator supports rename. */
  get rename(): boolean
  /** If operator supports list. */
  get list(): boolean
  /** If backend supports list with limit. */
  get listWithLimit(): boolean
  /** If backend supports list with start after. */
  get listWithStartAfter(): boolean
  /** If backend supports list with recursive. */
  get listWithRecursive(): boolean
  /** If backend supports list with versions. */
  get listWithVersions(): boolean
  /** If backend supports list with deleted. */
  get listWithDeleted(): boolean
  /** If operator supports presign. */
  get presign(): boolean
  /** If operator supports presign read. */
  get presignRead(): boolean
  /** If operator supports presign stat. */
  get presignStat(): boolean
  /** If operator supports presign write. */
  get presignWrite(): boolean
  /** If operator supports shared. */
  get shared(): boolean
}
export class Operator {
  /**
   * @see For the full list of scheme, see https://docs.rs/opendal/latest/opendal/services/index.html
   * And the options,
   * please refer to the documentation of the corresponding service for the corresponding parameters.
   * Note that the current options key is snake_case.
   */
  constructor(scheme: string, options?: Record<string, string> | undefined | null)
  /** Get current operator(service)'s full capability. */
  capability(): Capability
  /**
   * Get current path's metadata **without cache** directly.
   *
   * ### Notes
   * Use stat if you:
   *
   * - Want to detect the outside changes of a path.
   * - Don’t want to read from cached metadata.
   *
   * You may want to use `metadata` if you are working with entries returned by `Lister`. It’s highly possible that metadata you want has already been cached.
   *
   * ### Example
   * ```javascript
   * const meta = await op.stat("test");
   * if (meta.isDir) {
   *   // do something
   * }
   * ```
   */
  stat(path: string, options?: StatOptions | undefined | null): Promise<Metadata>
  /**
   * Get current path's metadata **without cache** directly and synchronously.
   *
   * ### Example
   * ```javascript
   * const meta = op.statSync("test");
   * if (meta.isDir) {
   *   // do something
   * }
   * ```
   */
  statSync(path: string, options?: StatOptions | undefined | null): Metadata
  /**
   * Check if this operator can work correctly.
   *
   * We will send a `list` request to the given path and return any errors we met.
   *
   * ### Example
   * ```javascript
   * await op.check();
   * ```
   */
  check(): Promise<void>
  /**
   * Check the op synchronously.
   *
   * ### Example
   * ```javascript
   * op.checkSync();
   * ```
   */
  checkSync(): void
  /**
   * Check if this path exists or not.
   *
   * ### Example
   * ```javascript
   * await op.isExist("test");
   * ```
   */
  exists(path: string): Promise<boolean>
  /**
   * Check if this path exists or not synchronously.
   *
   * ### Example
   * ```javascript
   * op.isExistSync("test");
   * ```
   */
  existsSync(path: string): boolean
  /**
   * Create dir with a given path.
   *
   * ### Example
   * ```javascript
   * await op.createDir("path/to/dir/");
   * ```
   */
  createDir(path: string): Promise<void>
  /**
   * Create dir with a given path synchronously.
   *
   * ### Example
   * ```javascript
   * op.createDirSync("path/to/dir/");
   * ```
   */
  createDirSync(path: string): void
  /**
   * Read the whole path into a buffer.
   *
   * ### Example
   * ```javascript
   * const buf = await op.read("path/to/file");
   * ```
   */
  read(path: string, options?: ReadOptions | undefined | null): Promise<Buffer>
  /**
   * Create a reader to read the given path.
   *
   * It could be used to read large file in a streaming way.
   */
  reader(path: string, options?: ReaderOptions | undefined | null): Promise<Reader>
  /**
   * Read the whole path into a buffer synchronously.
   *
   * ### Example
   * ```javascript
   * const buf = op.readSync("path/to/file");
   * ```
   */
  readSync(path: string, options?: ReadOptions | undefined | null): Buffer
  /**
   * Create a reader to read the given path synchronously.
   *
   * It could be used to read large file in a streaming way.
   */
  readerSync(path: string, options?: ReaderOptions | undefined | null): BlockingReader
  /**
   * Write bytes into a path.
   *
   * ### Example
   * ```javascript
   * await op.write("path/to/file", Buffer.from("hello world"));
   * // or
   * await op.write("path/to/file", "hello world");
   * // or
   * await op.write("path/to/file", Buffer.from("hello world"), { contentType: "text/plain" });
   * ```
   */
  write(path: string, content: Buffer | string, options?: WriteOptions | undefined | null): Promise<Metadata>
  /**
   * Write multiple bytes into a path.
   *
   * It could be used to write large file in a streaming way.
   */
  writer(path: string, options?: WriteOptions | undefined | null): Promise<Writer>
  /**
   * Write multiple bytes into a path synchronously.
   *
   * It could be used to write large file in a streaming way.
   */
  writerSync(path: string, options?: WriteOptions | undefined | null): BlockingWriter
  /**
   * Write bytes into a path synchronously.
   *
   * ### Example
   * ```javascript
   * op.writeSync("path/to/file", Buffer.from("hello world"));
   * // or
   * op.writeSync("path/to/file", "hello world");
   * // or
   * op.writeSync("path/to/file", Buffer.from("hello world"), { contentType: "text/plain" });
   * ```
   */
  writeSync(path: string, content: Buffer | string, options?: WriteOptions | undefined | null): Metadata
  /**
   * Copy file according to given `from` and `to` path.
   *
   * ### Example
   * ```javascript
   * await op.copy("path/to/file", "path/to/dest");
   * ```
   */
  copy(from: string, to: string): Promise<void>
  /**
   * Copy file according to given `from` and `to` path synchronously.
   *
   * ### Example
   * ```javascript
   * op.copySync("path/to/file", "path/to/dest");
   * ```
   */
  copySync(from: string, to: string): void
  /**
   * Rename file according to given `from` and `to` path.
   *
   * It's similar to `mv` command.
   *
   * ### Example
   * ```javascript
   * await op.rename("path/to/file", "path/to/dest");
   * ```
   */
  rename(from: string, to: string): Promise<void>
  /**
   * Rename file according to given `from` and `to` path synchronously.
   *
   * It's similar to `mv` command.
   *
   * ### Example
   * ```javascript
   * op.renameSync("path/to/file", "path/to/dest");
   * ```
   */
  renameSync(from: string, to: string): void
  /**
   * Delete the given path.
   *
   * ### Notes
   * Delete not existing error won’t return errors.
   *
   * ### Example
   * ```javascript
   * await op.delete("test");
   * ```
   */
  delete(path: string, options?: DeleteOptions | undefined | null): Promise<void>
  /**
   * Delete the given path synchronously.
   *
   * ### Example
   * ```javascript
   * op.deleteSync("test");
   * ```
   */
  deleteSync(path: string, options?: DeleteOptions | undefined | null): void
  /**
   * Remove given paths.
   *
   * ### Notes
   * If underlying services support delete in batch, we will use batch delete instead.
   *
   * ### Examples
   * ```javascript
   * await op.remove(["abc", "def"]);
   * ```
   */
  remove(paths: Array<string>): Promise<void>
  /**
   * Remove given paths.
   *
   * ### Notes
   * If underlying services support delete in batch, we will use batch delete instead.
   *
   * ### Examples
   * ```javascript
   * op.removeSync(["abc", "def"]);
   * ```
   */
  removeSync(paths: Array<string>): void
  /**
   * Remove the path and all nested dirs and files recursively.
   *
   * ### Notes
   * If underlying services support delete in batch, we will use batch delete instead.
   *
   * ### Examples
   * ```javascript
   * await op.removeAll("path/to/dir/");
   * ```
   */
  removeAll(path: string): Promise<void>
  /**
   * Remove the path and all nested dirs and files recursively.
   *
   * ### Notes
   * If underlying services support delete in batch, we will use batch delete instead.
   *
   * ### Examples
   * ```javascript
   * op.removeAllSync("path/to/dir/");
   * ```
   */
  removeAllSync(path: string): void
  /**
   * List the given path.
   *
   * This function will return an array of entries.
   *
   * An error will be returned if given path doesn't end with `/`.
   *
   * ### Example
   *
   * ```javascript
   * const list = await op.list("path/to/dir/");
   * for (let entry of list) {
   *   let meta = await op.stat(entry.path);
   *   if (meta.isFile) {
   *     // do something
   *   }
   * }
   * ```
   *
   * #### List recursively
   *
   * With `recursive` option, you can list recursively.
   *
   * ```javascript
   * const list = await op.list("path/to/dir/", { recursive: true });
   * for (let entry of list) {
   *   let meta = await op.stat(entry.path);
   *   if (meta.isFile) {
   *     // do something
   *   }
   * }
   * ```
   */
  list(path: string, options?: ListOptions | undefined | null): Promise<Array<Entry>>
  /**
   * List the given path synchronously.
   *
   * This function will return an array of entries.
   *
   * An error will be returned if given path doesn't end with `/`.
   *
   * ### Example
   *
   * ```javascript
   * const list = op.listSync("path/to/dir/");
   * for (let entry of list) {
   *   let meta = op.statSync(entry.path);
   *   if (meta.isFile) {
   *     // do something
   *   }
   * }
   * ```
   *
   * #### List recursively
   *
   * With `recursive` option, you can list recursively.
   *
   * ```javascript
   * const list = op.listSync("path/to/dir/", { recursive: true });
   * for (let entry of list) {
   *   let path = entry.path();
   *   let meta = entry.metadata();
   *   if (meta.isFile) {
   *     // do something
   *   }
   * }
   * ```
   */
  listSync(path: string, options?: ListOptions | undefined | null): Array<Entry>
  /**
   * Get a presigned request for read.
   *
   * Unit of `expires` is seconds.
   *
   * ### Example
   *
   * ```javascript
   * const req = await op.presignRead(path, parseInt(expires));
   *
   * console.log("method: ", req.method);
   * console.log("url: ", req.url);
   * console.log("headers: ", req.headers);
   * ```
   */
  presignRead(path: string, expires: number): Promise<PresignedRequest>
  /**
   * Get a presigned request for `write`.
   *
   * Unit of `expires` is seconds.
   *
   * ### Example
   *
   * ```javascript
   * const req = await op.presignWrite(path, parseInt(expires));
   *
   * console.log("method: ", req.method);
   * console.log("url: ", req.url);
   * console.log("headers: ", req.headers);
   * ```
   */
  presignWrite(path: string, expires: number): Promise<PresignedRequest>
  /**
   * Get a presigned request for stat.
   *
   * Unit of `expires` is seconds.
   *
   * ### Example
   *
   * ```javascript
   * const req = await op.presignStat(path, parseInt(expires));
   *
   * console.log("method: ", req.method);
   * console.log("url: ", req.url);
   * console.log("headers: ", req.headers);
   * ```
   */
  presignStat(path: string, expires: number): Promise<PresignedRequest>
  /** Add a layer to this operator. */
  layer(layer: ExternalObject<Layer>): Operator
}
/** Entry returned by Lister or BlockingLister to represent a path, and it's a relative metadata. */
export class Entry {
  /** Return the path of this entry. */
  path(): string
  /** Return the metadata of this entry. */
  metadata(): Metadata
}
/** Metadata carries all metadata associated with a path. */
export class Metadata {
  /** Returns true if the <op.stat> object describes a file system directory. */
  isDirectory(): boolean
  /** Returns true if the <op.stat> object describes a regular file. */
  isFile(): boolean
  /**
   * This function returns `true` if the file represented by this metadata has been marked for
   * deletion or has been permanently deleted.
   */
  isDeleted(): boolean
  /** Cache-Control of this object. */
  get cacheControl(): string | null
  /** Content-Disposition of this object */
  get contentDisposition(): string | null
  /** Content Length of this object */
  get contentLength(): bigint | null
  /** Content Encoding of this object */
  get contentEncoding(): string | null
  /** Content MD5 of this object. */
  get contentMd5(): string | null
  /** Content Type of this object. */
  get contentType(): string | null
  /** User Metadata of this object. */
  get userMetadata(): Record<string, string> | null
  /** ETag of this object. */
  get etag(): string | null
  /**
   * Last Modified of this object.
   *
   * We will output this time in RFC3339 format like `1996-12-19T16:39:57+08:00`.
   */
  get lastModified(): string | null
  /** mode represent this entry's mode. */
  get mode(): EntryMode | null
  /** Retrieves the `version` of the file, if available. */
  get version(): string | null
}
/**
 * BlockingReader is designed to read data from a given path in a blocking
 * manner.
 */
export class BlockingReader {
  read(buf: Buffer): bigint
}
/**
 * Reader is designed to read data from a given path in an asynchronous
 * manner.
 */
export class Reader {
  /**
   * # Safety
   *
   * > &mut self in async napi methods should be marked as unsafe
   *
   * Read bytes from this reader into given buffer.
   */
  read(buf: Buffer): Promise<bigint>
}
/**
 * BlockingWriter is designed to write data into a given path in a blocking
 * manner.
 */
export class BlockingWriter {
  /**
   * # Safety
   *
   * > &mut self in async napi methods should be marked as unsafe
   *
   * Write bytes into this writer.
   *
   * ### Example
   * ```javascript
   * const writer = await op.writer("path/to/file");
   * await writer.write(Buffer.from("hello world"));
   * await writer.close();
   * ```
   */
  write(content: Buffer | string): void
  /**
   * # Safety
   *
   * > &mut self in async napi methods should be marked as unsafe
   *
   * Close this writer.
   *
   * ### Example
   *
   * ```javascript
   * const writer = op.writerSync("path/to/file");
   * writer.write(Buffer.from("hello world"));
   * writer.close();
   * ```
   */
  close(): void
}
/**
 * Writer is designed to write data into a given path in an asynchronous
 * manner.
 */
export class Writer {
  /**
   * # Safety
   *
   * > &mut self in async napi methods should be marked as unsafe
   *
   * Write bytes into this writer.
   *
   * ### Example
   * ```javascript
   * const writer = await op.writer("path/to/file");
   * await writer.write(Buffer.from("hello world"));
   * await writer.close();
   * ```
   */
  write(content: Buffer | string): Promise<void>
  /**
   * # Safety
   *
   * > &mut self in async napi methods should be marked as unsafe
   *
   * Close this writer.
   *
   * ### Example
   * ```javascript
   * const writer = await op.writer("path/to/file");
   * await writer.write(Buffer.from("hello world"));
   * await writer.close();
   * ```
   */
  close(): Promise<void>
}
/**
 * Lister is designed to list entries at a given path in an asynchronous
 * manner.
 */
export class Lister {
  /**
   * # Safety
   *
   * > &mut self in async napi methods should be marked as unsafe
   *
   * napi will make sure the function is safe, and we didn't do unsafe
   * things internally.
   */
  next(): Promise<Entry | null>
}
/**
 * BlockingLister is designed to list entries at a given path in a blocking
 * manner.
 */
export class BlockingLister {
  next(): Entry | null
}
/** A public layer wrapper */
export class Layer { }
/**
 * Retry layer
 *
 * Add retry for temporary failed operations.
 *
 * # Notes
 *
 * This layer will retry failed operations when [`Error::is_temporary`]
 * returns true.
 * If the operation still failed, this layer will set error to
 * `Persistent` which means error has been retried.
 *
 * `write` and `blocking_write` don't support retry so far,
 * visit [this issue](https://github.com/apache/opendal/issues/1223) for more details.
 *
 * # Examples
 *
 * ```javascript
 * const op = new Operator("file", { root: "/tmp" })
 *
 * const retry = new RetryLayer();
 * retry.max_times = 3;
 * retry.jitter = true;
 *
 * op.layer(retry.build());
 * ```
 */
export class RetryLayer {
  constructor()
  /**
   * Set jitter of current backoff.
   *
   * If jitter is enabled, ExponentialBackoff will add a random jitter in `[0, min_delay)`
   * to current delay.
   */
  set jitter(v: boolean)
  /**
   * Set max_times of current backoff.
   *
   * Backoff will return `None` if max times are reached.
   */
  set maxTimes(v: number)
  /**
   * Set factor of current backoff.
   *
   * # Panics
   *
   * This function will panic if the input factor is smaller than `1.0`.
   */
  set factor(v: number)
  /**
   * Set max_delay of current backoff.
   *
   * Delay will not increase if the current delay is larger than max_delay.
   *
   * # Notes
   *
   * - The unit of max_delay is millisecond.
   */
  set maxDelay(v: number)
  /**
   * Set min_delay of current backoff.
   *
   * # Notes
   *
   * - The unit of min_delay is millisecond.
   */
  set minDelay(v: number)
  build(): ExternalObject<Layer>
}
