/*!
 * create-symlink | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/create-symlink
*/
'use strict';

const {inspect} = require('util');

const inspectWithKind = require('inspect-with-kind');
const isPlainObj = require('is-plain-obj');
const {symlink} = require('graceful-fs');

const typeRe = /dir|file|junction/;
const caseInsensitiveTypeRe = /dir|file|junction/i;
const TYPE_ERROR = 'Expected `type` option to be a valid symlink type – \'dir\', \'file\' or \'junction\'';

module.exports = function createSymlink(...args) {
  return new Promise((resolve, reject) => {
    const argLen = args.length;

    if (argLen !== 2 && argLen !== 3) {
      throw new TypeError(
        `Expected 2 or 3 arguments (target: <string>, path: <string>[, option: <object>]), but got ${
          argLen === 0 ? 'no' : argLen
        } arguments instead.`
      );
    }

    const [target, path, option] = args;

    if (typeof target !== 'string') {
      throw new TypeError(`Expected a symlink target (string), but got a non-string value ${
        inspectWithKind(target)
      }.`);
    }

    if (typeof path !== 'string') {
      throw new TypeError(`Expected a path (string) where to create a symlink, but got a non-string value ${
        inspectWithKind(path)
      }.`);
    }

    if (option !== null && option !== undefined) {
      if (!isPlainObj(option)) {
        throw new TypeError(`The third argument of create-symlink must be an object, but got ${
          inspectWithKind(option)
        }.`);
      }

      if (option.type !== undefined) {
        if (typeof option.type !== 'string') {
          throw new TypeError(`${TYPE_ERROR}, but got a non-strng value ${
            inspectWithKind(option.type)
          }.`);
        }

        if (option.type.length === 0) {
          throw new Error(`${TYPE_ERROR}, but got '' (empty string).`);
        }

        if (!typeRe.test(option.type)) {
          throw new Error(`${TYPE_ERROR}, but got an unknown type ${inspect(option.type)}.${
            caseInsensitiveTypeRe.test(option.type) ? ' Symlink type must be lower case.' : ''
          }`);
        }
      }
    }

    const symlinkArgs = [target, path];

    if (option) {
      symlinkArgs.push(option.type);
    }

    symlink(...symlinkArgs, err => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
};
