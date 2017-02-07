# create-symlink

[![NPM version](https://img.shields.io/npm/v/create-symlink.svg)](https://www.npmjs.com/package/create-symlink)
[![Build Status](https://travis-ci.org/shinnn/create-symlink.svg?branch=master)](https://travis-ci.org/shinnn/create-symlink)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/create-symlink.svg)](https://coveralls.io/github/shinnn/create-symlink?branch=master)

A [Node.js](https://nodejs.org/) module to [create a symbolic link](http://man7.org/linux/man-pages/man2/symlink.2.html)

```javascript
const createSymlink = require('create-symlink');
const {realpathSync} = require('fs');

createSymlink('/where/file/exists', 'where/to/create/symlink').then(() => {
  realpathSync('where/to/create/symlink'); //=> '/where/file/exists'
});
```

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install create-symlink
```

## API

```javascript
const createSymlink = require('create-symlink');
```

### createSymlink(*target*, *path* [, *option*])

*target*: `String` (symlink target)  
*path*: `String` (a path where you create a symlink)  
*option*: `Object`  
Return: [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Almost the same as the built-in [`fs.symlink`](https://nodejs.org/api/fs.html#fs_fs_symlink_target_path_type_callback), but:

* [Promisified](https://promise-nuggets.github.io/articles/07-wrapping-callback-functions.html)
* The third parameter receives an object with `type` property, instead of receiving a string directly.

```javascript
createSymlink('src', 'dest', {type: 'junction'}).then(() => {
  // Created a junction point (Windows only)
});
```

## License

Copyright (c) 2017 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
