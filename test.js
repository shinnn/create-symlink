'use strict';

const {join} = require('path');

const createSymlink = require('.');
const {realpath, unlink} = require('graceful-fs');
const runSeries = require('run-series');
const test = require('tape');

test('createSymlink()', t => {
  t.plan(14);

  createSymlink('index.js', '.tmp').then(arg => {
    t.strictEqual(arg, undefined, 'should pass no arguments to the onResolved function.');

    runSeries([cb => realpath('.tmp', cb), cb => unlink('.tmp', cb)], (err, [result]) => {
      t.strictEqual(err, null, 'should create a symlink to the given path.');
      t.strictEqual(result, join(__dirname, 'index.js'), 'should create a symlink of the given target.');
    });
  });

  const fail = t.fail.bind(t, 'Unexpectedly succeeded.');

  createSymlink('test.js', 'node_modules', {type: 'file'}).then(fail, err => {
    t.strictEqual(
      err.code,
      'EEXIST',
      'should fail when it cannot create a symlink.'
    );
  });

  createSymlink('too long symlink target'.repeat(9999), 'o', {}).then(fail, err => {
    t.strictEqual(
      err.code,
      'ENAMETOOLONG',
      'should fail when the symlink target is invalid.'
    );
  });

  createSymlink(new Uint8Array(), 'a').then(fail, err => {
    t.strictEqual(
      err.toString(),
      'TypeError: Expected a symlink target (string), but got a non-string value Uint8Array [  ].',
      'should fail when the first argument is not a string.'
    );
  });

  createSymlink('b', Buffer.from('c')).then(fail, err => {
    t.strictEqual(
      err.toString(),
      'TypeError: Expected a path (string) where to create a symlink, but got a non-string value <Buffer 63>.',
      'should fail when the second argument is not a string.'
    );
  });

  createSymlink('dest', 'src', new Set()).then(fail, err => {
    t.strictEqual(
      err.toString(),
      'TypeError: The third argument of create-symlink must be an object, but got Set {}.',
      'should fail when the third argument is not a plain object.'
    );
  });

  createSymlink('1', '2', {type: new Map()}).then(fail, err => {
    t.strictEqual(
      err.toString(),
      'TypeError: Expected `type` option to be a valid symlink type – ' +
      '\'dir\', \'file\' or \'junction\', but got a non-strng value Map {}.',
      'should fail when `type` option is not a string.'
    );
  });

  createSymlink('_', '_', {type: ''}).then(fail, err => {
    t.strictEqual(
      err.toString(),
      'Error: Expected `type` option to be a valid symlink type – ' +
      '\'dir\', \'file\' or \'junction\', but got \'\' (empty string).',
      'should fail when `type` option is an empty string.'
    );
  });

  createSymlink('_', '_', {type: '?'}).then(fail, err => {
    t.strictEqual(
      err.toString(),
      'Error: Expected `type` option to be a valid symlink type – ' +
      '\'dir\', \'file\' or \'junction\', but got an unknown type \'?\'.',
      'should fail when `type` option is an unknown symlink type.'
    );
  });

  createSymlink('_', '_', {type: 'DIR'}).then(fail, err => {
    t.strictEqual(
      err.toString(),
      'Error: Expected `type` option to be a valid symlink type – \'dir\', \'file\' or \'junction\', ' +
      'but got an unknown type \'DIR\'. Symlink type must be lower case.',
      'should suggest using lowercase symlink type.'
    );
  });

  createSymlink().then(fail, err => {
    t.strictEqual(
      err.toString(),
      'TypeError: Expected 2 or 3 arguments (target: <string>, path: <string>[, option: <object>]), ' +
      'but got no arguments instead.',
      'should fail when it takes no argumnts.'
    );
  });

  createSymlink('_', '_', {}, '_').then(fail, err => {
    t.strictEqual(
      err.toString(),
      'TypeError: Expected 2 or 3 arguments (target: <string>, path: <string>[, option: <object>]), ' +
      'but got 4 arguments instead.',
      'should fail when it takes too many argumnts.'
    );
  });
});
