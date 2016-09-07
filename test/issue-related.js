'use strict';

var assert = require('assert');
var argv = require('yargs-parser')(process.argv.slice(2));
var matcher = argv.mm ? require('minimatch') : require('..');
var isMatch = argv.mm ? matcher : matcher.isMatch;

describe('issue-related tests', function() {
  it('issue #23', function() {
    assert(!isMatch('zzjs', 'z*.js'));
    assert(!isMatch('zzjs', '*z.js'));
  });

  it('issue #24', function() {
    assert(!isMatch('a', 'a/**'));
    assert(!isMatch('a/b/c/d/', 'a/b/**/f'));
    assert(isMatch('a', '**'));
    assert(isMatch('a/', '**'));
    assert(isMatch('a/b/c/d', '**'));
    assert(isMatch('a/b/c/d/', '**'));
    assert(isMatch('a/b/c/d/', '**/**'));
    assert(isMatch('a/b/c/d/', '**/b/**'));
    assert(isMatch('a/b/c/d/', 'a/b/**'));
    assert(isMatch('a/b/c/d/', 'a/b/**/'));
    assert(isMatch('a/b/c/d/e.f', 'a/b/**/**/*.*'));
    assert(isMatch('a/b/c/d/e.f', 'a/b/**/*.*'));
    assert(isMatch('a/b/c/d/g/e.f', 'a/b/**/d/**/*.*'));
    assert(isMatch('a/b/c/d/g/g/e.f', 'a/b/**/d/**/*.*'));
  });

  it('issue #15', function() {
    assert(isMatch('a/b-c/d/e/z.js', 'a/b-*/**/z.js'));
  });
});
