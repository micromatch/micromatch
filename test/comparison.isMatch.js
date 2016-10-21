'use strict';

var assert = require('assert');
var bash = require('bash-match');
var isWindows = require('is-windows');
var mm = require('minimatch');
var nm = require('..');

var fixtures = [
  // common file patterns
  'abc',
  'abd',
  'abbbz',
  'a',
  'a.md',
  'a/b/c.md',

  'z.js',
  'za.js',
  'a/b/c/z.js',
  'a/b/c/d/e/f/z.js',

  // directories
  'a/',
  'a/b',
  'a/cb',
  'a/bb',
  'a/b/c/d',
  'a/b/c/d/',

  // cwd
  '.',
  './',

  // ancestor directories
  '..',
  '../c',
  '../c',
  './../c',
  '/..',
  '/../c',

  // bad paths
  './a/../c',
  '/a/../c',
  'a/../c',

  // dot files
  './.b/.c',
  './b/.c',
  '../.b/.c',
  '../b/.c',
  '.b',
  '.b/',
  '.b',
  '.b.c',
  '.b.c/',
  '.b/',
  '.b/c',
  'b/.c',

  // dot directories
  'b/.c/',
  '.b/.c',
];

var patterns = [
  '!**/*.md',
  '!*.*',
  '!*.js',
  '*',
  '**',
  '**/',
  '**/*',
  '**/*.md',
  '**/z*.js',
  '*.js',
  '*/*',
  '/**',
  '/**/',
  '/**/*',
  'a/**/',
  'a/**/b',
  'a/**b',
  'a/b/c/**/*.js',
  'a/b/c/*.js',
];

describe('.isMatch', function() {
  if (isWindows()) {
    console.log('comparisons are done using bash, these tests cannot run on windows');
    return;
  }

  patterns.forEach(function(pattern) {
    fixtures.forEach(function(fixture) {
      it('should match ' + fixture + ' with ' + pattern, function() {
        var mmRes = mm(fixture, pattern);
        var nmRes = nm.isMatch(fixture, pattern);
        var bRes = bash.isMatch(fixture, pattern);

        assert(nmRes === bRes || nmRes === mmRes, fixture + ' ' + pattern);
      });

      it('should match ' + fixture + ' with ' + pattern + ' and {dot: true}', function() {
        var mmRes = mm(fixture, pattern, {dot: true});
        var nmRes = nm.isMatch(fixture, pattern, {dot: true});
        var bRes = bash.isMatch(fixture, pattern, {dot: true});
        assert(nmRes === bRes || nmRes === mmRes, fixture + ' ' + pattern);
      });
    });
  });
});
