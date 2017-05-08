'use strict';

require('should');
var assert = require('assert');
var argv = require('minimist')(process.argv.slice(2));
var minimatch = require('./support/reference');
var mm = require('..');

if ('minimatch' in argv) {
  mm = minimatch;
}

describe('.possibleParent()', function() {
  describe('errors:', function() {
    it('should throw on undefined args:', function() {
      (function() {
        mm.possibleParent();
      }).should.throw('micromatch.possibleParent(): filepath should be a string.');
    });

    it('should throw on bad args:', function() {
      (function() {
        mm.possibleParent({});
      }).should.throw('micromatch.possibleParent(): filepath should be a string.');
    });
  });

  describe('no glob', function () {
    it('should match', function () {
      mm.possibleParent('', '').should.be.true();
      mm.possibleParent('/', '/aaa/bbb/ccc').should.be.true();
      mm.possibleParent('aaa', 'aaa/bbb/ccc').should.be.true();
      mm.possibleParent('aaa/bbb', 'aaa/bbb/ccc').should.be.true();
      mm.possibleParent('aaa/bbb/ccc', 'aaa/bbb/ccc').should.be.true();
    });

    it('should not match', function () {
      mm.possibleParent('/a', '/aaa/bbb/ccc').should.be.false();
      mm.possibleParent('a', '/aaa/bbb/ccc').should.be.false();
      mm.possibleParent('aaa/b', 'aaa/bbb/ccc').should.be.false();
      mm.possibleParent('aaa/bb', 'aaa/bbb/ccc').should.be.false();
      mm.possibleParent('aaa/bbb/c', 'aaa/bbb/ccc').should.be.false();
      mm.possibleParent('aaa/bbb/ccc/', 'aaa/bbb/ccc').should.be.false();
      mm.possibleParent('aaa/bbb/ccc/d', 'aaa/bbb/ccc').should.be.false();
    });
  });

  describe('simple patterns', function () {
    it('should match', function () {
      mm.possibleParent('', '').should.be.true();
      mm.possibleParent('/', '/').should.be.true();
      mm.possibleParent('.', '.').should.be.true();
      mm.possibleParent('a', 'a').should.be.true();
      mm.possibleParent('/a', '/a').should.be.true();
      mm.possibleParent('a', 'a/b').should.be.true();
      mm.possibleParent('/a', '/a/b').should.be.true();
      mm.possibleParent('a/b', 'a/b').should.be.true();
      mm.possibleParent('/a/b', '/a/b').should.be.true();
      mm.possibleParent('a/b', 'a/b/c').should.be.true();
      mm.possibleParent('/a/b', '/a/b/c').should.be.true();
      mm.possibleParent('/', '/a').should.be.true();
    });

    it('should\'t match', function () {
      mm.possibleParent('a', 'ab').should.be.false();
      mm.possibleParent('/a', '/ab').should.be.false();
      mm.possibleParent('a', 'ba').should.be.false();
      mm.possibleParent('/a', '/ba').should.be.false();
      mm.possibleParent('aa', 'a/b').should.be.false();
      mm.possibleParent('/aa', '/a/b').should.be.false();
      mm.possibleParent('aa/b', 'a/b').should.be.false();
      mm.possibleParent('/aa/b', '/a/b').should.be.false();
      mm.possibleParent('b', 'a/b').should.be.false();
      mm.possibleParent('/b', '/a/b').should.be.false();
      mm.possibleParent('b/a', 'a/b').should.be.false();
      mm.possibleParent('/b/a', '/a/b').should.be.false();
      mm.possibleParent('ab', 'a').should.be.false();
      mm.possibleParent('/ab', '/a').should.be.false();
    });
  });

  describe('glob patterns', function () {
    it('should match', function () {
      mm.possibleParent('a/b', 'a/b/*').should.be.true();
      mm.possibleParent('/a/b', '/a/b/*').should.be.true();
      mm.possibleParent('a/b', 'a/*').should.be.true();
      mm.possibleParent('/a/b', '/a/*').should.be.true();
      mm.possibleParent('a/b', 'a/*/c').should.be.true();
      mm.possibleParent('/a/b', '/a/*/c').should.be.true();
      mm.possibleParent('ab', '*').should.be.true();
      mm.possibleParent('/ab', '/*').should.be.true();
      mm.possibleParent('ab', '*/*').should.be.true();
      mm.possibleParent('/ab', '*/*').should.be.true();
      mm.possibleParent('ab', '??').should.be.true();
      mm.possibleParent('/ab', '/??').should.be.true();
      mm.possibleParent('ab', 'a?').should.be.true();
      mm.possibleParent('/ab', '/a?').should.be.true();
      mm.possibleParent('a/b', '?/?').should.be.true();
      mm.possibleParent('/a/b', '/?/?').should.be.true();

      mm.possibleParent('a/b/c.md', 'a/*/*.md').should.be.true();
      mm.possibleParent('a/b/c.md', '**/*.md').should.be.true();
      mm.possibleParent('c.md', '*.md').should.be.true();

      mm.possibleParent('a/b/c/xyz.md', 'a/b/c/*.md').should.be.true();
      mm.possibleParent('/a/b/c/xyz.md', '/a/b/c/*.md').should.be.true();
      mm.possibleParent('a/bb/c/xyz.md', 'a/*/c/*.md').should.be.true();
      mm.possibleParent('a/bb.bb/aa/bb/aa/c/xyz.md', 'a/**/c/*.md').should.be.true();
      mm.possibleParent('a/bb.bb/aa/b.b/aa/c/xyz.md', 'a/**/c/*.md').should.be.true();
      mm.possibleParent('a/bb.bb', 'a/**/c/*.md').should.be.true();
    });

    it('should\'t match', function () {
      mm.possibleParent('ab', '?').should.be.false();
      mm.possibleParent('/ab', '/?').should.be.false();
      mm.possibleParent('ab', '?/?').should.be.false();
      mm.possibleParent('/ab', '?/?').should.be.false();
      mm.possibleParent('ab', 'a/*').should.be.false();
      mm.possibleParent('/ab', '/a/*').should.be.false();
      mm.possibleParent('ab', './').should.be.false();
      mm.possibleParent('a/c.md', '*.md').should.be.false();
    });
  });

  describe('dot files', function () {
    it('should match', function () {
      mm.possibleParent('.c.md', '.*.md').should.be.true();
      mm.possibleParent('.a', '.a').should.be.true();
      mm.possibleParent('.ab', '.*').should.be.true();
      mm.possibleParent('.ab', '.*/a').should.be.true();
      mm.possibleParent('.ab', '.a*').should.be.true();
      mm.possibleParent('a/.c.md', 'a/.c.md').should.be.true();
      mm.possibleParent('a/b/c/.xyz.md', 'a/b/c/.*.md').should.be.true();
      mm.possibleParent('a/b', 'a/b/c/.*.md').should.be.true();
      mm.possibleParent('a/b/c/d.a.md', 'a/b/c/*.md').should.be.true();
    });

    it('should\'t match', function () {
      mm.possibleParent('a/.c.md', '*.md').should.be.false();
      mm.possibleParent('.c.md', '.c.').should.be.false();
      mm.possibleParent('.abc', '.a').should.be.false();
      mm.possibleParent('b/bb.bb/aa/b.b/aa/c/xyz.md', 'a/**/c/*.md').should.be.false();
      mm.possibleParent('aaa/bbb', 'aaa?bbb').should.be.false();
    });
  });

  describe('braces', function () {
    it('should match', function () {
    mm.possibleParent('a', 'a/{b,c,d/e,f{1..5}{g,h}}/x/*.js').should.be.true();
    mm.possibleParent('a/b', 'a/{b,c,d/e,f{1..5}{g,h}}/x/*.js').should.be.true();
    mm.possibleParent('a/d', 'a/{b,c,d/e,f{1..5}{g,h}}/x/*.js').should.be.true();
    mm.possibleParent('a/d/e', 'a/{b,c,d/e,f{1..5}{g,h}}/x/*.js').should.be.true();
    mm.possibleParent('a/f1h', 'a/{b,c,d/e,f{1..5}{g,h}}/x/*.js').should.be.true();
    mm.possibleParent('a/f1h/x', 'a/{b,c,d/e,f{1..5}{g,h}}/x/*.js').should.be.true();
    mm.possibleParent('a/f1h/x/c.js', 'a/{b,c,d/e,f{1..5}{g,h}}/x/*.js').should.be.true();
    });

    it('should\'t match', function () {
    mm.possibleParent('b', 'a/{b,c,d/e,f{1..5}{g,h}}/x/*.js').should.be.false();
    mm.possibleParent('a/b/e', 'a/{b,c,d/e,f{1..5}{g,h}}/x/*.js').should.be.false();
    mm.possibleParent('a/d/x', 'a/{b,c,d/e,f{1..5}{g,h}}/x/*.js').should.be.false();
    mm.possibleParent('a/b/c', 'a/{b,c,d/e,f{1..5}{g,h}}/x/*.js').should.be.false();
    mm.possibleParent('a/f1', 'a/{b,c,d/e,f{1..5}{g,h}}/x/*.js').should.be.false();
    mm.possibleParent('a/e', 'a/{b,c,d/e,f{1..5}{g,h}}/x/*.js').should.be.false();
    });
  });

  describe('extglob', function () {
    it('should match', function () {
      mm.possibleParent('a', 'a/b?(xx)c/d').should.be.true();
      mm.possibleParent('a/bc', 'a/b?(xx)c/d').should.be.true();
      mm.possibleParent('a/bxxc', 'a/b?(xx)c/d').should.be.true();
      mm.possibleParent('a/bxxc/d', 'a/b?(xx)c/d').should.be.true();

      mm.possibleParent('a/bc', 'a/b?(x/x)c/d').should.be.true();
      mm.possibleParent('a/bx/xc', 'a/b?(x/x)c/d').should.be.true();
      mm.possibleParent('a/yyy', 'a/b?(x/x)c/d').should.be.true();

      mm.possibleParent('a/bc', 'a/b?(x@(/x))c/d').should.be.true();
      mm.possibleParent('a/bx/xc', 'a/b?(x@(/x))c/d').should.be.true();
      mm.possibleParent('a/yyy', 'a/b?(x@(/x))c/d').should.be.true();

      mm.possibleParent('yyy', '?(x/x)').should.be.true();
      mm.possibleParent('/yyy', '/?(x/x)').should.be.true();

      mm.possibleParent('a/.bx/xc', 'a/.b?(x/x)c/d').should.be.true();
      mm.possibleParent('a/bc/.d', 'a/b?(x/x)c/.d').should.be.true();
    });

    it('should\'t match', function () {
      mm.possibleParent('a/b', 'a/b?(xx)c/d').should.be.false();
      mm.possibleParent('a/bxx', 'a/b?(xx)c/d').should.be.false();

      mm.possibleParent('b/yyy', 'a/b?(x/x)c/d').should.be.false();
      mm.possibleParent('b/bx/xc', 'a/b?(x/x)c/d').should.be.false();
    });
  });

  // these are only supported by micromatch
  describe('bracket expansion', function () {
    it('should match', function () {
      mm.possibleParent('a', 'a/b[:alpha:]c/d').should.be.true();
      mm.possibleParent('a/bxc', 'a/b[:alpha:]c/d').should.be.true();

      mm.possibleParent('a', 'a[:punct:]b').should.be.true();
      mm.possibleParent('x', 'a[:punct:]b').should.be.true();
      mm.possibleParent('a', 'a/b[:punct:]c').should.be.true();
      mm.possibleParent('a/c', 'a/b[:punct:]c').should.be.true();
      mm.possibleParent('a/c/x/y', 'a/b[:punct:]c').should.be.true();

      mm.possibleParent('a', 'a[![:alpha:]]b').should.be.true();
      mm.possibleParent('x', 'a[![:alpha:]]b').should.be.true();
      mm.possibleParent('a', 'a/b[![:alpha:]]c').should.be.true();
      mm.possibleParent('a/c', 'a/b[![:alpha:]]c').should.be.true();
      mm.possibleParent('a/c/x/y', 'a/b[![:alpha:]]c').should.be.true();

      mm.possibleParent('a/c/.x', 'a/b[![:alpha:]]c/.x').should.be.true();
      mm.possibleParent('a/.0', 'a/.b[![:alpha:]]').should.be.true();
      });

      it('should\'t match', function () {
      mm.possibleParent('a', 'a[:alpha:]b').should.be.false();
      mm.possibleParent('x', 'a[:alpha:]b').should.be.false();
      mm.possibleParent('a/b', 'a/b[:alpha:]c').should.be.false();
      mm.possibleParent('a/c', 'a/b[:alpha:]c').should.be.false();
      mm.possibleParent('a/c/x/y', 'a/b[:alpha:]c').should.be.false();

      mm.possibleParent('a/bx', 'a/b[:alpha:]c/d').should.be.false();
    });
  });

  describe('miscellaneous', function () {
    it('should pass', function () {
      mm.possibleParent('aa/xx', 'aa/{xx').should.be.false();
      mm.possibleParent('aa/{xx', 'aa/{xx').should.be.true();
    });
  });

  it('should escape plus signs to match string literals', function() {
    assert(mm.possibleParent('a+b/src/glimini.js', 'a+b/src/*.js'));
    assert(mm.possibleParent('+b/src/glimini.js', '+b/src/*.js'));
    assert(mm.possibleParent('coffee+/src/glimini.js', 'coffee+/src/*.js'));
    assert(mm.possibleParent('coffee+/src/glimini.js', 'coffee+/src/*.js'));
    assert(mm.possibleParent('coffee+/src/glimini.js', 'coffee+/src/*'));
  });

  it('should correctly deal with empty globs', function() {
    mm.possibleParent('ab', '').should.be.false();
    mm.possibleParent('a', '').should.be.false();
    mm.possibleParent('.', '').should.be.false();
  });

  it('should match with non-glob patterns', function() {
    mm.possibleParent('.', '.').should.be.true();
    mm.possibleParent('/a', '/a').should.be.true();
    mm.possibleParent('/ab', '/a').should.be.false();
    mm.possibleParent('a', 'a').should.be.true();
    mm.possibleParent('ab', '/a').should.be.false();
    mm.possibleParent('ab', 'a').should.be.false();
    mm.possibleParent('ab', 'ab').should.be.true();
    mm.possibleParent('abcd', 'cd').should.be.false();
    mm.possibleParent('abcd', 'bc').should.be.false();
    mm.possibleParent('abcd', 'ab').should.be.false();
  });

  it('should match file names:', function() {
    mm.possibleParent('a.b', 'a.b').should.be.true();
    mm.possibleParent('a.b', '*.b').should.be.true();
    mm.possibleParent('a.b', 'a.*').should.be.true();
    mm.possibleParent('a.b', '*.*').should.be.true();
    mm.possibleParent('a-b.c-d', 'a*.c*').should.be.true();
    mm.possibleParent('a-b.c-d', '*b.*d').should.be.true();
    mm.possibleParent('a-b.c-d', '*.*').should.be.true();
    mm.possibleParent('a-b.c-d', '*.*-*').should.be.true();
    mm.possibleParent('a-b.c-d', '*-*.*-*').should.be.true();
    mm.possibleParent('a-b.c-d', '*.c-*').should.be.true();
    mm.possibleParent('a-b.c-d', '*.*-d').should.be.true();
    mm.possibleParent('a-b.c-d', 'a-*.*-d').should.be.true();
    mm.possibleParent('a-b.c-d', '*-b.c-*').should.be.true();
    mm.possibleParent('a-b.c-d', '*-b*c-*').should.be.true();

    // false
    mm.possibleParent('a-b.c-d', '*-bc-*').should.be.false();
  });

  it('should match with common glob patterns', function() {
    mm.possibleParent('/ab', '/*').should.be.true();
    mm.possibleParent('/cd', '/*').should.be.true();
    mm.possibleParent('ef', '/*').should.be.false();
    mm.possibleParent('ab', './*').should.be.false();
    mm.possibleParent('ab', '*').should.be.true();
    mm.possibleParent('ab', 'ab').should.be.true();
  });

  it('should match files with the given extension:', function() {
    mm.possibleParent('.md', '*.md').should.be.true();
    mm.possibleParent('.md', '.md').should.be.true();
    mm.possibleParent('.c.md', '*.md').should.be.true();
    mm.possibleParent('.c.md', '.*.md').should.be.true();
    mm.possibleParent('c.md', '*.md').should.be.true();
    mm.possibleParent('c.md', '*.md').should.be.true();
    mm.possibleParent('a/b/c/c.md', '*.md').should.be.false();
    mm.possibleParent('a/b/c.md', 'a/*.md').should.be.false();
    mm.possibleParent('a/b/c.md', 'a/*/*.md').should.be.true();
    mm.possibleParent('a/b/c.md', '**/*.md').should.be.true();
    mm.possibleParent('a/b/c.js', 'a/**/*.*').should.be.true();
  });

  it('should match wildcards:', function() {
    mm.possibleParent('a/b/c/z.js', '*.js').should.be.false();
    mm.possibleParent('a/b/z.js', '*.js').should.be.false();
    mm.possibleParent('a/z.js', '*.js').should.be.false();
    mm.possibleParent('z.js', '*.js').should.be.true();

    mm.possibleParent('z.js', 'z*.js').should.be.true();
    mm.possibleParent('a/z.js', 'a/z*.js').should.be.true();
    mm.possibleParent('a/z.js', '*/z*.js').should.be.true();
  });

  it('should match globstars:', function() {
    mm.possibleParent('a/b/c/z.js', '**/*.js').should.be.true();
    mm.possibleParent('a/b/z.js', '**/*.js').should.be.true();
    mm.possibleParent('a/z.js', '**/*.js').should.be.true();
    mm.possibleParent('z.js', '**/*.js').should.be.true();
    mm.possibleParent('z.js', '**/z*').should.be.true();

    mm.possibleParent('a/b/c/d/e/z.js', 'a/b/**/*.js').should.be.true();
    mm.possibleParent('a/b/c/d/z.js', 'a/b/**/*.js').should.be.true();
    mm.possibleParent('a/b/c/z.js', 'a/b/c/**/*.js').should.be.true();
    mm.possibleParent('a/b/c/z.js', 'a/b/c**/*.js').should.be.true();
    mm.possibleParent('a/b/c/z.js', 'a/b/**/*.js').should.be.true();
    mm.possibleParent('a/b/z.js', 'a/b/**/*.js').should.be.true();

    mm.possibleParent('a/z.js', 'a/b/**/*.js').should.be.false();
    mm.possibleParent('z.js', 'a/b/**/*.js').should.be.false();

    // issue #23
    mm.possibleParent('zzjs', 'z*.js').should.be.false();
    mm.possibleParent('zzjs', '*z.js').should.be.false();

    // issue #24
    mm.possibleParent('a', '**').should.be.true();
    mm.possibleParent('a', 'a/**').should.be.true();
    mm.possibleParent('a/', '**').should.be.true();
    mm.possibleParent('a/b/c/d', '**').should.be.true();
    mm.possibleParent('a/b/c/d/', '**').should.be.true();
    mm.possibleParent('a/b/c/d/', '**/**').should.be.true();
    mm.possibleParent('a/b/c/d/', '**/b/**').should.be.true();
    mm.possibleParent('a/b/c/d/', 'a/b/**').should.be.true();
    mm.possibleParent('a/b/c/d/', 'a/b/**/').should.be.true();
    mm.possibleParent('a/b/c/d/', 'a/b/**/c/**/').should.be.true();
    mm.possibleParent('a/b/c/d/', 'a/b/**/c/**/d/').should.be.true();
    mm.possibleParent('a/b/c/d/', 'a/b/**/f').should.be.true();
    mm.possibleParent('a/b/c/d/e.f', 'a/b/**/**/*.*').should.be.true();
    mm.possibleParent('a/b/c/d/e.f', 'a/b/**/*.*').should.be.true();
    mm.possibleParent('a/b/c/d/e.f', 'a/b/**/c/**/d/*.*').should.be.true();
    mm.possibleParent('a/b/c/d/e.f', 'a/b/**/d/**/*.*').should.be.true();
    mm.possibleParent('a/b/c/d/g/e.f', 'a/b/**/d/**/*.*').should.be.true();
    mm.possibleParent('a/b/c/d/g/g/e.f', 'a/b/**/d/**/*.*').should.be.true();

    // issue #15
    mm.possibleParent('z.js', '**/z*.js').should.be.true();
    mm.possibleParent('a/b-c/z.js', 'a/b-*/**/z.js').should.be.true();
    mm.possibleParent('a/b-c/d/e/z.js', 'a/b-*/**/z.js').should.be.true();
  });

  /**
   * 1. micromatch differs from spec
   * 2. minimatch differs from spec
   * 3. both micromatch and minimatch differ from spec
   */

  it('Extended slash-matching features', function() {
    mm.possibleParent('foo/baz/bar', 'foo*bar').should.be.false();
    mm.possibleParent('foo/baz/bar', 'foo**bar').should.be.false();
    mm.possibleParent('foobazbar', 'foo**bar').should.be.true(); // 3
    mm.possibleParent('foo/baz/bar', 'foo/**/bar').should.be.true();
    mm.possibleParent('foo/baz/bar', 'foo/**/**/bar').should.be.true();
    mm.possibleParent('foo/b/a/z/bar', 'foo/**/bar').should.be.true();
    mm.possibleParent('foo/b/a/z/bar', 'foo/**/**/bar').should.be.true();
    mm.possibleParent('foo/bar', 'foo/**/bar').should.be.true();
    mm.possibleParent('foo/bar', 'foo/**/**/bar').should.be.true();
    mm.possibleParent('foo/bar', 'foo?bar').should.be.false();
    mm.possibleParent('foo/bar', 'foo[/]bar').should.be.true(); // 2
    mm.possibleParent('foo/bar', 'f[^eiu][^eiu][^eiu][^eiu][^eiu]r').should.be.false();
    mm.possibleParent('foo-bar', 'f[^eiu][^eiu][^eiu][^eiu][^eiu]r').should.be.true();
    mm.possibleParent('foo', '**/foo').should.be.true();
    mm.possibleParent('foo', 'foo/**').should.be.true();
    mm.possibleParent('XXX/foo', '**/foo').should.be.true();
    mm.possibleParent('bar/baz/foo', '**/foo').should.be.true();
    mm.possibleParent('bar/baz/foo', '*/foo').should.be.false();
    mm.possibleParent('foo/bar/baz', '**/bar*').should.be.true();
    mm.possibleParent('deep/foo/bar/baz', '**/bar/*').should.be.true();
    mm.possibleParent('deep/foo/bar/baz/', '**/bar/*').should.be.true();
    mm.possibleParent('deep/foo/bar/baz/', '**/bar/**').should.be.true();
    mm.possibleParent('deep/foo/bar', '**/bar/*').should.be.true();
    mm.possibleParent('deep/foo/bar/', '**/bar/**').should.be.true();
    mm.possibleParent('foo/bar/baz', '**/bar**').should.be.true();
    mm.possibleParent('foo/bar/baz/x', '*/bar/**').should.be.true();
    mm.possibleParent('deep/foo/bar/baz/x', '*/bar/**').should.be.false();
    mm.possibleParent('deep/foo/bar/baz/x', '**/bar/*/*').should.be.true();
    mm.possibleParent('a/j/z/x.md', 'a/**/j/**/z/*.md').should.be.true();
    mm.possibleParent('a/b/j/c/z/x.md', 'a/**/j/**/z/*.md').should.be.true();
  });

  it('question marks should not match slashes:', function() {
    mm.possibleParent('aaa/bbb', 'aaa?bbb').should.be.false();
  });

  it('should match dotfiles when `dot` or `dotfiles` is set:', function() {
    mm.possibleParent('.c.md', '*.md', {dot: true}).should.be.true();
    mm.possibleParent('.c.md', '.*', {dot: true}).should.be.true();
    mm.possibleParent('a/b/c/.xyz.md', 'a/b/c/*.md', {dot: true}).should.be.true();
    mm.possibleParent('a/b/c/.xyz.md', 'a/b/c/.*.md', {dot: true}).should.be.true();
  });

  it('should match file paths:', function() {
    mm.possibleParent('a/b/c/xyz.md', 'a/b/c/*.md').should.be.true();
    mm.possibleParent('a/bb/c/xyz.md', 'a/*/c/*.md').should.be.true();
    mm.possibleParent('a/bbbb/c/xyz.md', 'a/*/c/*.md').should.be.true();
    mm.possibleParent('a/bb.bb/c/xyz.md', 'a/*/c/*.md').should.be.true();
    mm.possibleParent('a/bb.bb/aa/bb/aa/c/xyz.md', 'a/**/c/*.md').should.be.true();
    mm.possibleParent('a/bb.bb/aa/b.b/aa/c/xyz.md', 'a/**/c/*.md').should.be.true();
  });

  it('should match full file paths:', function() {
    mm.possibleParent('a/.b', 'a/**/z/*.md').should.be.true();
    mm.possibleParent('a/.b', 'a/.*').should.be.true();
    mm.possibleParent('a/b/z/.a', 'a/**/z/*.a').should.be.true();
    mm.possibleParent('a/b/z/.a', 'a/*/z/*.a').should.be.true();
    mm.possibleParent('a/b/z/.a', 'a/*/z/.a').should.be.true();
    mm.possibleParent('a/b/c/d/e/z/c.md', 'a/**/z/*.md').should.be.true();
    mm.possibleParent('a/b/c/d/e/j/n/p/o/z/c.md', 'a/**/j/**/z/*.md').should.be.true();
    mm.possibleParent('a/b/c/j/e/z/c.txt', 'a/**/j/**/z/*.md').should.be.true();
    mm.possibleParent('a/b/d/xyz.md', 'a/b/**/c{d,e}/**/xyz.md').should.be.true();
    mm.possibleParent('a/b/c/xyz.md', 'a/b/**/c{d,e}/**/xyz.md').should.be.true();
    mm.possibleParent('a/b/c/cd/bar/xyz.md', 'a/b/**/c{d,e}/**/xyz.md').should.be.true();
    mm.possibleParent('a/b/baz/ce/fez/xyz.md', 'a/b/**/c{d,e}/**/xyz.md').should.be.true();
  });

  it('should match paths with leading `./`:', function() {
    mm.possibleParent('./.a', 'a/**/z/*.md').should.be.false();
    mm.possibleParent('./a/b/z/.a', 'a/**/z/.a').should.be.false();
    mm.possibleParent('./a/b/z/.a', './a/**/z/.a').should.be.true();
    mm.possibleParent('./a/b/c/d/e/z/c.md', 'a/**/z/*.md').should.be.false();
    mm.possibleParent('./a/b/c/d/e/z/c.md', './a/**/z/*.md').should.be.true();
    mm.possibleParent('./a/b/c/d/e/z/c.md', './a/**/j/**/z/*.md').should.be.true();
    mm.possibleParent('./a/b/c/j/e/z/c.md', './a/**/j/**/z/*.md').should.be.true();
    mm.possibleParent('./a/b/c/j/e/z/c.md', 'a/**/j/**/z/*.md').should.be.false();
    mm.possibleParent('./a/b/c/d/e/j/n/p/o/z/c.md', './a/**/j/**/z/*.md').should.be.true();
    mm.possibleParent('./a/b/c/j/e/z/c.txt', './a/**/j/**/z/*.md').should.be.true();
    mm.possibleParent('./a/b/d/xyz.md', './a/b/**/c{d,e}/**/xyz.md').should.be.true();
    mm.possibleParent('./a/b/c/xyz.md', './a/b/**/c{d,e}/**/xyz.md').should.be.true();
    mm.possibleParent('./a/b/c/cd/bar/xyz.md', './a/b/**/c{d,e}/**/xyz.md').should.be.true();
    mm.possibleParent('./a/b/baz/ce/fez/xyz.md', './a/b/**/c{d,e}/**/xyz.md').should.be.true();
  });
});
