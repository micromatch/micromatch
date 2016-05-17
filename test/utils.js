'use strict';

require('should');
var path = require('path');
var assert = require('assert');
var utils = require('../lib/utils');
var mm = require('..');

describe('utils.pathContains', function() {
  it('should return a function', function() {
    assert.equal(typeof utils.pathContains('foo/bar'), 'function');
  });

  it('should return true if the second path contains the first:', function() {
    assert.equal(utils.pathContains('foo')('foo/bar'), true);
  });
});

describe('utils.matchPath', function() {
  it('should return true if two paths are the same:', function() {
    assert.equal(utils.matchPath('foo')('foo'), true);
  });

  it('should return true if the second path contains the first:', function() {
    assert.equal(utils.matchPath('foo', {contains: true})('foo/bar'), true);
  });
});

describe('utils.unixify', function() {
  it('should convert a path to unix slashes', function() {
    var sep = path.sep;
    path.sep = '\\';
    assert.equal(utils.unixify('foo\\bar'), 'foo/bar');
    path.sep = sep;
  });

  it('should return an empty string:', function() {
    assert.equal(utils.unixify(''), '');
  });

  it('should retain trailing slashes with unix paths:', function() {
    assert.equal(utils.unixify('a/b/c/d/'), 'a/b/c/d/');
  });

  it('should retain trailing slashes with windows paths:', function() {
    var sep = path.sep;
    path.sep = '\\';
    assert.equal(utils.unixify('a\\b\\c\\d\\'), 'a/b/c/d/');
    path.sep = sep;
  });

  it('should unescape word chars when `options.unescape` is true:', function() {
    var fp = utils.unixify('foo\\bar\\baz\\quux', {unescape: true});
    assert.equal(fp, 'foobarbazquux');
  });

  it('should not blow up on empty strings:', function() {
    var fp = utils.unixify('', {unescape: true});
    assert.equal(fp, '');
  });
});

describe('utils.escapePath', function() {
  it('should escape dots and backslashes in a path', function() {
    assert.equal(utils.escapePath('foo\\bar.baz'), 'foo\\\\bar\\.baz');
  });
});

describe('utils.escapeRe', function() {
  it('should escape regex characters in a path', function() {
    assert.equal(utils.escapeRe('foo^bar*baz?#'), 'foo\\^bar\\*baz\\?\\#');
  });
});
