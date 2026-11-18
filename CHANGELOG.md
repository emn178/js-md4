# Change Log

## v0.5.0 / 2026-11-18
### Fixed
- Incorrect hash for `DataView` input.

### Changed
- Multi-byte typed arrays such as `Uint16Array`, `Uint32Array` and `Float32Array` are now hashed by their underlying bytes, the same as Node.js `crypto` and Web Crypto. Previously each element was treated as one byte.

## v0.4.0 / 2026-11-17
### Added
- ESM builds and package `exports`.
- TypeScript interfaces.
- Support for web worker.
- Support for `ArrayBuffer` views such as `DataView`.

### Fixed
- Throws `ERR_OSSL_EVP_UNSUPPORTED` in Node.js 17 and later, which no longer supports MD4 in `crypto`.
- Incorrect hash for strings with unpaired UTF-16 surrogates; they are now encoded as U+FFFD, the same as `TextEncoder`.
- Incorrect hash when the input size is 512MB or more.
- Detect browsers with a `process` polyfill (e.g. BrowserFS) and Electron renderers as non-Node.js environments.

### Changed
- Remove Node.js `crypto` acceleration; the JavaScript implementation is always used.
- Throw an error for invalid input types and for `update` after finalize.
- Replace Travis CI with GitHub Actions.
- Update dev dependencies and fix security issues.

## v0.3.2 / 2017-01-24
### Added
- missing arrayBuffer method.

## v0.3.1 / 2017-01-23
### Fixed
- ArrayBuffer dosen't work in Webpack.

### Deprecated
- `buffer` maybe confuse with Buffer in node.js. Please use `arrayBuffer` instead.

## v0.3.0 / 2015-12-28
### Added
- support for update hash.
- support for bytes array output.
- support for ArrayBuffer output.

## v0.2.0 / 2015-12-01
### Added
- support for bytes.
- support for AMD.

## v0.1.1 / 2015-03-01
### Improved
- performance.

## v0.1.0 / 2015-03-01
### Added
- initial release.
