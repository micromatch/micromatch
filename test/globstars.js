'use strict';

var assert = require('assert');
var mm = require('..');

describe('globstars', function() {
  it('should match double star patterns', function() {
    assert(!mm.isMatch('.gitignore', 'a/**/z/*.md'));
    assert(!mm.isMatch('a/b/c/d/e/z/foo.md', 'a/**/j/**/z/*.md'));
    assert(!mm.isMatch('a/b/c/j/e/z/foo.txt', 'a/**/j/**/z/*.md'));
    assert(!mm.isMatch('a/b/z/.dotfile', 'a/**/z/*.md'));
    assert(!mm.isMatch('a/b/z/.dotfile.md', '**/c/.*.md'));

    assert(mm.isMatch('a/b/c/d/e/j/n/p/o/z/foo.md', 'a/**/j/**/z/*.md'));
    assert(mm.isMatch('a/b/c/d/e/z/foo.md', 'a/**/z/*.md'));
    assert(mm.isMatch('a/b/c/j/e/z/foo.md', 'a/**/j/**/z/*.md'));
    assert(mm.isMatch('a/b/z/.dotfile.md', '**/.*.md'));
    assert(mm.isMatch('a/b/z/.dotfile.md', 'a/**/z/.*.md'));
  });
});
