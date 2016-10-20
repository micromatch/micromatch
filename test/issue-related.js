'use strict';

var assert = require('assert');
var nm = require('./support/match');

describe('issue-related tests', function() {
  // see https://github.com/jonschlinkert/micromatch/issues/15
  it('issue #15', function() {
    assert(nm.isMatch('a/b-c/d/e/z.js', 'a/b-*/**/z.js'));
    assert(nm.isMatch('z.js', 'z*'));
    assert(nm.isMatch('z.js', '**/z*'));
    assert(nm.isMatch('z.js', '**/z*.js'));
    assert(nm.isMatch('z.js', '**/*.js'));
    assert(nm.isMatch('foo', '**/foo'));
  });

  // see https://github.com/jonschlinkert/micromatch/issues/23
  it('issue #23', function() {
    assert(!nm.isMatch('zzjs', 'z*.js'));
    assert(!nm.isMatch('zzjs', '*z.js'));
  });

  // see https://github.com/jonschlinkert/micromatch/issues/24
  it('issue #24', function() {
    assert(!nm.isMatch('a', 'a/**'));
    assert(!nm.isMatch('a/b/c/d/', 'a/b/**/f'));
    assert(nm.isMatch('a', '**'));
    assert(nm.isMatch('a/', '**'));
    assert(nm.isMatch('a/b/c/d', '**'));
    assert(nm.isMatch('a/b/c/d/', '**'));
    assert(nm.isMatch('a/b/c/d/', '**/**'));
    assert(nm.isMatch('a/b/c/d/', '**/b/**'));
    assert(nm.isMatch('a/b/c/d/', 'a/b/**'));
    assert(nm.isMatch('a/b/c/d/', 'a/b/**/'));
    assert(nm.isMatch('a/b/c/d/e.f', 'a/b/**/**/*.*'));
    assert(nm.isMatch('a/b/c/d/e.f', 'a/b/**/*.*'));
    assert(nm.isMatch('a/b/c/d/g/e.f', 'a/b/**/d/**/*.*'));
    assert(nm.isMatch('a/b/c/d/g/g/e.f', 'a/b/**/d/**/*.*'));
  });

  // see https://github.com/jonschlinkert/micromatch/issues/59
  it('should only match nested directories when `**` is the only thing in a segment', function() {
    assert(!nm.isMatch('a/b/c', 'a/b**'));
    assert(!nm.isMatch('a/c/b', 'a/**b'));
  });

  // see https://github.com/jonschlinkert/micromatch/issues/63
  it('issue #63', function() {
    assert(nm.isMatch('/aaa/bbb/foo', '/aaa/bbb/**'));
    assert(nm.isMatch('/aaa/bbb/', '/aaa/bbb/**'));
    assert(nm.isMatch('/aaa/bbb/foo.git', '/aaa/bbb/**'));
    assert(!nm.isMatch('/aaa/bbb/.git', '/aaa/bbb/**'));
    assert(!nm.isMatch('aaa/bbb/.git', 'aaa/bbb/**'));
    assert(!nm.isMatch('/aaa/bbb/ccc/.git', '/aaa/bbb/**'));
    assert(!nm.isMatch('/aaa/.git/foo', '/aaa/**/*'));
    assert(nm.isMatch('/aaa/.git/foo', '/aaa/**/*', {dot: true}));
    assert(nm.isMatch('/aaa/bbb/.git', '/aaa/bbb/*', {dot: true}));
    assert(nm.isMatch('aaa/bbb/.git', 'aaa/bbb/**', {dot: true}));
    assert(nm.isMatch('/aaa/bbb/.git', '/aaa/bbb/**', {dot: true}));
    assert(nm.isMatch('/aaa/bbb/ccc/.git', '/aaa/bbb/**', {dot: true}));
  });
});
