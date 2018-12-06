# create-symlink

[![npm version](https://img.shields.io/npm/v/create-symlink.svg)](https://www.npmjs.com/package/create-symlink)
[![Build Status](https://travis-ci.com/shinnn/create-symlink.svg?branch=master)](https://travis-ci.com/shinnn/create-symlink)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/create-symlink.svg)](https://coveralls.io/github/shinnn/create-symlink?branch=master)

A [Node.js](https://nodejs.org/) module to [create a symbolic link](http://man7.org/linux/man-pages/man2/symlink.2.html)

```javascript
const createSymlink = require('create-symlink');
const {realpath} = require('fs').promises;

(async () => {
  await createSymlink('/where/file/exists', 'where/to/create/symlink');
  await realpath('where/to/create/symlink'); //=> '/where/file/exists'
})();
```

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/about-npm/).

```
npm install create-symlink
```

## API

```javascript
const createSymlink = require('create-symlink');
```

### createSymlink(*target*, *path* [, *option*])

*target*: `string` (symlink target)  
*path*: `string` (a path where you create a symlink)  
*option*: `Object`  
Return: [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Almost the same as the built-in [`fs.promises.symlink()`](https://nodejs.org/api/fs.html#fs_fspromises_symlink_target_path_type), but the third parameter receives an object with `type` property, instead of receiving a string directly.

```javascript
(async () => {
  await createSymlink('src', 'dest', {type: 'junction'});
  // Created a junction point (Windows only)
})();
```

## License

[ISC License](./LICENSE) © 2018 Shinnosuke Watanabe
