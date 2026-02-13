'use strict';

const assert = require('assert');
const mm = require('..');

describe('issue-related tests', () => {
  it('micromatch issue #140', () => {
    let a = ['a/b/some/c.md', 'a/b/c.md', 'a/b-b/c.md', 'a/bb/c.md', 'a/bbc/c.md'];
    assert.deepEqual(mm(a, '**/b/**/c.md'), ['a/b/some/c.md', 'a/b/c.md']);

    let b = ['packages/foo-foo/package.json', 'packages/foo/package.json'];
    assert.deepEqual(mm(b, '**/foo/**/package.json'), ['packages/foo/package.json']);
  });

  it('micromatch issue#15', () => {
    assert(mm.isMatch('a/b-c/d/e/z.js', 'a/b-*/**/z.js'));
    assert(mm.isMatch('z.js', 'z*'));
    assert(mm.isMatch('z.js', '**/z*'));
    assert(mm.isMatch('z.js', '**/z*.js'));
    assert(mm.isMatch('z.js', '**/*.js'));
    assert(mm.isMatch('foo', '**/foo'));
  });

  it('micromatch issue#23', () => {
    assert(!mm.isMatch('zzjs', 'z*.js'));
    assert(!mm.isMatch('zzjs', '*z.js'));
  });

  it('micromatch issue#24', () => {
    assert(!mm.isMatch('a/b/c/d/', 'a/b/**/f'));
    assert(mm.isMatch('a', 'a/**'));
    assert(mm.isMatch('a', '**'));
    assert(mm.isMatch('a/', '**'));
    assert(mm.isMatch('a/b/c/d', '**'));
    assert(mm.isMatch('a/b/c/d/', '**'));
    assert(mm.isMatch('a/b/c/d/', '**/**'));
    assert(mm.isMatch('a/b/c/d/', '**/b/**'));
    assert(mm.isMatch('a/b/c/d/', 'a/b/**'));
    assert(mm.isMatch('a/b/c/d/', 'a/b/**/'));
    assert(mm.isMatch('a/b/c/d/e.f', 'a/b/**/**/*.*'));
    assert(mm.isMatch('a/b/c/d/e.f', 'a/b/**/*.*'));
    assert(mm.isMatch('a/b/c/d/g/e.f', 'a/b/**/d/**/*.*'));
    assert(mm.isMatch('a/b/c/d/g/g/e.f', 'a/b/**/d/**/*.*'));
  });

  it('micromatch issue#58 - only match nested dirs when `**` is the only thing in a segment', () => {
    assert(!mm.isMatch('a/b/c', 'a/b**'));
    assert(!mm.isMatch('a/c/b', 'a/**b'));
  });

  it('micromatch issue#63 (dots)', () => {
    assert(!mm.isMatch('/aaa/.git/foo', '/aaa/**/*'));
    assert(!mm.isMatch('/aaa/bbb/.git', '/aaa/bbb/*'));
    assert(!mm.isMatch('/aaa/bbb/.git', '/aaa/bbb/**'));
    assert(!mm.isMatch('/aaa/bbb/ccc/.git', '/aaa/bbb/**'));
    assert(!mm.isMatch('aaa/bbb/.git', 'aaa/bbb/**'));
    assert(mm.isMatch('/aaa/.git/foo', '/aaa/**/*', { dot: true }));
    assert(mm.isMatch('/aaa/bbb/', '/aaa/bbb/**'));
    assert(mm.isMatch('/aaa/bbb/.git', '/aaa/bbb/*', { dot: true }));
    assert(mm.isMatch('/aaa/bbb/.git', '/aaa/bbb/**', { dot: true }));
    assert(mm.isMatch('/aaa/bbb/ccc/.git', '/aaa/bbb/**', { dot: true }));
    assert(mm.isMatch('/aaa/bbb/foo', '/aaa/bbb/**'));
    assert(mm.isMatch('aaa/bbb/.git', 'aaa/bbb/**', { dot: true }));
  });

  it('micromatch issue#79', () => {
    assert(mm.isMatch('a/foo.js', '**/foo.js'));
    assert(mm.isMatch('foo.js', '**/foo.js'));
    assert(mm.isMatch('a/foo.js', '**/foo.js', { dot: true }));
    assert(mm.isMatch('foo.js', '**/foo.js', { dot: true }));
  });

  it('micromatch issue#283 - alternation order should not affect globstar matching', () => {
    // Both orderings should match consistently
    assert(mm.isMatch('feature/test/test', '(feature/**|feature*)'));
    assert(mm.isMatch('feature/test/test', '(feature*|feature/**)'));

    // Nested paths should also work
    assert(mm.isMatch('a/b/c', '(a/**|b)'));
    assert(mm.isMatch('a/b/c', '(b|a/**)'));

    // Multiple globstar alternatives
    assert(mm.isMatch('x/y/z', '(x/**|y/**)'));
    assert(mm.isMatch('x/y/z', '(y/**|x/**)'));

    // Alternation within a path
    assert(mm.isMatch('foo/a/b/c/bar', 'foo/(a/**|b/*)/bar'));
    assert(mm.isMatch('foo/a/b/c/bar', 'foo/(b/*|a/**)/bar'));

    // Non-matching cases should still not match
    assert(!mm.isMatch('other/test/test', '(feature/**|feature*)'));
    assert(!mm.isMatch('other/test/test', '(feature*|feature/**)'));

    // Extglob patterns with ** should still work
    assert(mm.isMatch('feature/test', 'feature/**'));
    assert(mm.isMatch('feature', 'feature*'));
    assert(!mm.isMatch('feature/test/test', 'feature*'));

    // Brace syntax should still work the same way
    assert(mm.isMatch('feature/test/test', '{feature/**,feature*}'));
    assert(mm.isMatch('feature/test/test', '{feature*,feature/**}'));
  });
});
