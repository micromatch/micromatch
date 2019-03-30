'use strict';

const path = require('path');

if (!process.env.ORIGINAL_PATH_SEP) {
  process.env.ORIGINAL_PATH_SEP = path.sep
}

module.exports = [
  'a',
  'a.md',
  'a.js',
  'a/',
  'a/b',
  'a/b/.c.md',
  'a/b/c',
  'a/b/c.md',
  'a/b/c/',
  'a/b/c/d',
  'a/b/c/d/',
  'a/b/c/d/e/f/z.js',
  'a/b/c/z.js',
  'a/bb',
  'a/cb',
  'abbbz',
  'abc',
  'abd',
  'z.js',
  'za.js',

  // literal "!"
  '!a.js',
  '!a/b',
  '!a/b/',
  '!a/b/c',
  '!a/b/c/',
  '!a/!b',
  '!a/!b/c',
  '!a/!b/c/d',
  '!a/b/.c.md',

  // root
  '/a/',
  '/a/b',
  '/a/cb',
  '/a/bb',
  '/a/b/c',
  '/a/b/c/',
  '/a/b/c/d',
  '/a/b/c/d/',

  // cwd
  '.',
  './',

  // ancestor directories
  '..',
  '../c',
  '../c',
  './../c',
  './a/../c',
  '/..',
  '/../c',
  '/../.c',
  '/../.c/',
  '/a/../c',
  'a/../c',

  // dot files
  '../.b/.c',
  '../b/.c',
  './.b/.c',
  './b/.c',
  '.b',
  '.b.c',
  '.b.c/',
  '.b/',
  '.b/.c',
  '.b/c',
  'b/.c',
  'b/.c/',

  // wildcards in filepaths
  'a/+b/c',
  '+a/+b/c',
  'a (foo)',
  'a (foo)/(bar)',
  'a/b/c (1)',
  'a/b (2)/c (1)',
  'a/b/c [def]'
];
