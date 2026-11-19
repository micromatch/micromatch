'use strict';

const assert = require('assert');
const mm = require('..');

describe('.some()', () => {
  it('should return true if any matches are found', () => {
    var fixtures = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
    assert(mm.some(fixtures, ['z', 'b/*']));
  });

  it('should return false if no matches are found', () => {
    var fixtures = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
    assert(!mm.some(fixtures, ['z', 'x/*']));
  });

  it('should arrayify a string value', () => {
    assert(mm.some('a', ['*']));
  });

  it('should respect negated patterns (issue #177)', () => {
    // Documented in the README: 'foo.js' matches '*.js' but is excluded
    // by '!foo.js', so nothing matches.
    assert(!mm.some(['foo.js'], ['*.js', '!foo.js']));
    assert(mm.some(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
    assert(!mm.some(['foo.js', 'bar.js'], ['!*.js']));
    assert(mm.some(['foo.js', 'bar.js'], ['!baz.js']));
    assert(!mm.some([], ['*.js']));
    assert(!mm.some(['foo.js'], ['*.txt']));
  });
});
