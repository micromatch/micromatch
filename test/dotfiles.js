'use strict';

require('mocha');
const assert = require('assert');
const mi = require('minimatch');
const mm = require('..');
const { isMatch } = mm;

describe('dotfiles', () => {
  describe('file name matching', () => {
    it('should not match a dot when the dot is not explicitly defined', () => {
      assert(!isMatch('.dot', '*dot'));
      assert(!isMatch('a/.dot', 'a/*dot'));
    });

    it('should not match leading dots with question marks', () => {
      assert(!isMatch('.dot', '?dot'));
      assert(!isMatch('/.dot', '/?dot'));
      assert(!isMatch('a/.dot', 'a/?dot'));
    });

    it('should match double dots with double dots', () => {
      let fixtures = ['a/../a', 'ab/../ac', '../a', 'a', '../../b', '../c', '../c/d'];
      assert.deepEqual(mm(fixtures, '../*'), ['../a', '../c']);
      assert.deepEqual(mm(fixtures, '*/../*'), ['a/../a', 'ab/../ac']);
      assert.deepEqual(mm(fixtures, '**/../*'), ['a/../a', 'ab/../ac', '../a', '../c']);
    });

    it('should not match exclusive double or single dots', () => {
      let fixtures = ['a/./b', 'a/../b', 'a/c/b', 'a/.d/b'];
      let opts = { dot: true };
      assert.deepEqual(mm(fixtures, 'a/.*/b'), ['a/.d/b']);
      assert.deepEqual(mm(fixtures, 'a/.*/b', opts), ['a/.d/b']);
      assert.deepEqual(mm(fixtures, 'a/*/b', opts), ['a/c/b', 'a/.d/b']);
      assert(!isMatch('../c', '**/**/**', opts));
      assert(!isMatch('../c', '**/**/**'));
    });

    it('should match dotfiles when there is a leading dot:', () => {
      let files = ['a/b', 'a/.b', '.a/b', '.a/.b'];
      let dotfiles = ['.dotfile', '.dotfile.md'];
      let opts = { dot: true };
      assert.deepEqual(mm(dotfiles, '.*.md', opts), ['.dotfile.md']);
      assert.deepEqual(mm(dotfiles, '.dotfile', opts), ['.dotfile']);
      assert.deepEqual(mm(dotfiles, '.dotfile*', opts), dotfiles);
      assert.deepEqual(mm(files, 'a/{.*,**}', opts), ['a/b', 'a/.b']);
      assert.deepEqual(mm(files, '{.*,**}', opts), files);
      assert.deepEqual(mm(files, '*/.*', opts), ['a/.b', '.a/.b']);
    });

    it('should match dotfiles when there is not a leading dot:', () => {
      let files = ['.a', 'a', 'a/b', 'a/.b', '.a/b', '.a/.b'];
      let opts = { dot: true };

      assert.deepEqual(mm(files, '*', opts), ['.a', 'a']);
      assert.deepEqual(mm(files, '*/*', opts), ['a/b', 'a/.b', '.a/b', '.a/.b']);
      assert.deepEqual(mm(files, '**', opts), files);
      assert.deepEqual(mm(['.dotfile'], '*.*', opts), ['.dotfile']);
      assert.deepEqual(mm(['.a', '.b', 'c', 'c.md'], '*.*', opts), ['.a', '.b', 'c.md']);
      assert.deepEqual(mm(['.dotfile'], '*.md', opts), []);
      assert.deepEqual(mm(['.verb.txt'], '*.md', opts), []);
      assert.deepEqual(mm(['a/b/c/.dotfile'], '*.md', opts), []);
      assert.deepEqual(mm(['a/b/c/.dotfile.md'], '*.md', opts), []);
      assert.deepEqual(mm(['a/b/c/.verb.md'], '**/*.md', opts), ['a/b/c/.verb.md']);
      assert.deepEqual(mm(['foo.md'], '*.md', opts), ['foo.md']);
      assert(isMatch('b/.c', '**/**/**', opts));
      assert(!isMatch('b/.c', '**/**/**'));
    });

    it('should use negation patterns on dotfiles:', () => {
      assert.deepEqual(mm(['.a', '.b', 'c', 'c.md'], '!.*'), ['c', 'c.md']);
      assert.deepEqual(mm(['.a', '.b', 'c', 'c.md'], '!(.*)'), ['c', 'c.md']);
      assert.deepEqual(mm(['.a', '.b', 'c', 'c.md'], '!(.*)*'), ['c', 'c.md']);
      assert.deepEqual(mm(['.a', '.b', 'c', 'c.md'], '!*.*'), ['.a', '.b', 'c']);
    });

    it('should match dotfiles when `options.dot` is true:', () => {
      assert.deepEqual(mm(['.dotfile'], '*.*', { dot: true }), ['.dotfile']);
      assert.deepEqual(mm(['.dotfile'], '*.md', { dot: true }), []);
      assert.deepEqual(mm(['.dotfile'], '.dotfile', { dot: true }), ['.dotfile']);
      assert.deepEqual(mm(['.dotfile.md'], '.*.md', { dot: true }), ['.dotfile.md']);
      assert.deepEqual(mm(['.verb.txt'], '*.md', { dot: true }), []);
      assert.deepEqual(mm(['.verb.txt'], '*.md', { dot: true }), []);
      assert.deepEqual(mm(['a/b/c/.dotfile'], '*.md', { dot: true }), []);
      assert.deepEqual(mm(['a/b/c/.dotfile.md'], '**/*.md', { dot: true }), ['a/b/c/.dotfile.md']);
      assert.deepEqual(mm(['a/b/c/.dotfile.md'], '**/.*', { dot: false }), ['a/b/c/.dotfile.md']);
      assert.deepEqual(mm(['a/b/c/.dotfile.md'], '**/.*.md', { dot: false }), ['a/b/c/.dotfile.md']);
      assert.deepEqual(mm(['a/b/c/.dotfile.md'], '*.md', { dot: false }), []);
      assert.deepEqual(mm(['a/b/c/.dotfile.md'], '*.md', { dot: true }), []);
      assert.deepEqual(mm(['a/b/c/.verb.md'], '**/*.md', { dot: true }), ['a/b/c/.verb.md']);
      assert.deepEqual(mm(['d.md'], '*.md', { dot: true }), ['d.md']);
    });

    it('should not match a dot when the dot is not explicitly defined', () => {
      let fixtures = ['a/b/.x', '.x', '.x/', '.x/a', '.x/a/b', '.x/.x', 'a/.x', 'a/b/.x/c', 'a/b/.x/c/d', 'a/b/.x/c/d/e', 'a/b/.x/', 'a/.x/b', 'a/.x/b/.x/c'];
      assert.deepEqual(mm(fixtures, '**'), []);
      assert.deepEqual(mm(fixtures, 'a/**/c'), []);
    });

    it('should match a dot when the dot is explicitly defined', () => {
      let fixtures = ['.x', '.x/', '.x/.x', '.x/a', '.x/a/b', 'a/.x/.x/c', 'a/.x/.x/.x/c', 'a/.x/b', 'a/.x/b/.x/c', 'a/b/.x', 'a/b/.x/', 'a/b/.x/c', 'a/b/.x/c/d', 'a/b/.x/c/d/e'];
      let expected = ['.x', '.x/', '.x/.x', '.x/a', '.x/a/b', 'a/.x/.x/c', 'a/.x/b', 'a/b/.x', 'a/b/.x/', 'a/b/.x/c', 'a/b/.x/c/d', 'a/b/.x/c/d/e'];

      assert.deepEqual(mm(fixtures, '**/.x/.x/**'), ['.x/.x', 'a/.x/.x/c']);
      assert.deepEqual(mm(fixtures, '**/.x/*/.x/**'), ['a/.x/b/.x/c']);
      assert.deepEqual(mm(fixtures, '**/.x/**'), expected.filter(ele => !ele.includes('.x/.x')));
      assert(isMatch('.bar.baz', '.*.*'));
      assert(isMatch('.bar.baz', '.*.*'));
      assert(!isMatch('.bar.baz', '.*.*/'));
      assert(isMatch('.bar.baz', '.*.baz'));
      assert(!isMatch('.bar.baz/', '.*.*'));
      assert(isMatch('.bar.baz/', '.*.*{,/}'));
      assert(isMatch('.bar.baz/', '.*.*/'));
      assert(isMatch('.dot', '.*ot'));
      assert(isMatch('.dot', '.[d]ot'));
      assert(isMatch('.dot.foo.bar', '.*ot.*.*'));
      assert(isMatch('.dotfile.js', '.*.js'));
      assert(isMatch('/.dot', '**/.[d]ot'));
      assert(isMatch('/.dot', '**/.dot*'));
      assert(isMatch('/.dot', '/.[d]ot'));
      assert(isMatch('/.dot', '/.dot*'));
      assert(isMatch('a/.dot', '**/.[d]ot'));
      assert(isMatch('a/.dot', '*/.[d]ot'));
      assert(isMatch('a/.dot', '*/.dot*'));
      assert(isMatch('a/b/.dot', '**/.[d]ot'));
      assert(isMatch('a/b/.dot', '**/.dot*'));
      assert(isMatch('.dot', '.[d]ot'));
      assert(isMatch('.dot', '.d?t'));
      assert(isMatch('.dot', '.dot*'));

      assert.deepEqual(mm('.dot', '.[d]ot'), ['.dot']);
      assert.deepEqual(mm('.dot', '.dot*'), ['.dot']);
      assert.deepEqual(mm('.dot', '.d?t'), ['.dot']);

      assert(!isMatch('.bar.baz', '.*.*/'));
      assert(isMatch('.bar.baz/', '.*.*{,/}'));
      assert(isMatch('.bar.baz', '.*.*'));
      assert(isMatch('.bar.baz', '.*.baz'));
      assert(isMatch('.bar.baz/', '.*.*/'));
      assert(isMatch('.dot', '.*ot'));
      assert(isMatch('.dot', '.[d]ot'));
      assert(isMatch('.dot.foo.bar', '.*ot.*.*'));
      assert(isMatch('.dotfile.js', '.*.js'));
      assert(isMatch('/.dot', '**/.[d]ot'));
      assert(isMatch('/.dot', '**/.dot*'));
      assert(isMatch('/.dot', '**/[.]dot'));
      assert(isMatch('/.dot', '/[.]dot'));
      assert(isMatch('a/.dot', '**/.[d]ot'));
      assert(isMatch('a/.dot', '*/.[d]ot'));
      assert(isMatch('a/.dot', '*/.dot*'));
      assert(isMatch('a/.dot', '*/[.]dot'));
      assert(isMatch('a/b/.dot', '**/.[d]ot'));
      assert(isMatch('a/b/.dot', '**/.dot*'));
      assert(isMatch('a/b/.dot', '**/[.]dot'));
    });

    it('should match dots in root path when glob is prefixed with **/', () => {
      assert(isMatch('.x', '**/.x/**'));
      assert(!isMatch('.x/.x', '**/.x/**'));
      assert(isMatch('.x/.x', '**/.x/.x/**'));
      assert(isMatch('a/b/.x', '**/.x/**'));
      assert(isMatch('.x/', '**/.x/**'));
      assert(isMatch('.x/a', '**/.x/**'));
      assert(isMatch('.x/a/b', '**/.x/**'));
      assert(isMatch('a/.x/b', '**/.x/**'));
      assert(isMatch('a/b/.x', '**/.x'));
      assert(isMatch('a/b/.x/', '**/.x/**'));
      assert(isMatch('a/b/.x/c', '**/.x/**'));
      assert(isMatch('a/b/.x/c/d', '**/.x/**'));
      assert(isMatch('a/b/.x/c/d/e', '**/.x/**'));
    });

    it('should not match dotfiles with single stars by default', () => {
      assert(isMatch('foo', '*'));
      assert(isMatch('foo/bar', '*/*'));
      assert(!isMatch('.foo', '*'));
      assert(!isMatch('.foo/bar', '*/*'));
      assert(!isMatch('.foo/.bar', '*/*'));
      assert(!isMatch('foo/.bar', '*/*'));
      assert(!isMatch('foo/.bar/baz', '*/*/*'));
    });

    it('should work with dots in the path', () => {
      assert(isMatch('../test.js', '../*.js'));
      assert(!isMatch('../.test.js', '../*.js'));
    });

    it('should not match dotfiles with globstars by default', () => {
      assert(!isMatch('.foo', '**/**'));
      assert(!isMatch('.foo', '**'));
      assert(!isMatch('.foo', '**/*'));
      assert(!isMatch('bar/.foo', '**/*'));
      assert(!isMatch('.bar', '**/*'));
      assert(!isMatch('foo/.bar', '**/*'));
      assert(!isMatch('foo/.bar', '**/*a*'));
    });

    it('should match dotfiles when a leading dot is in the pattern', () => {
      assert(!isMatch('foo', '**/.*a*'));
      assert(isMatch('.bar', '**/.*a*'));
      assert(isMatch('foo/.bar', '**/.*a*'));
      assert(isMatch('.foo', '**/.*'));

      assert(!isMatch('foo', '.*a*'));
      assert(isMatch('.bar', '.*a*'));
      assert(!isMatch('bar', '.*a*'));

      assert(!isMatch('foo', '.b*'));
      assert(isMatch('.bar', '.b*'));
      assert(!isMatch('bar', '.b*'));

      assert(!isMatch('foo', '.*r'));
      assert(isMatch('.bar', '.*r'));
      assert(!isMatch('bar', '.*r'));
    });

    it('should not match a dot when the dot is not explicitly defined', () => {
      assert(!isMatch('.dot', '**/*dot'));
      assert(!isMatch('.dot', '**/?dot'));
      assert(!isMatch('.dot', '*/*dot'));
      assert(!isMatch('.dot', '*/?dot'));
      assert(!isMatch('.dot', '*dot'));
      assert(!isMatch('.dot', '/*dot'));
      assert(!isMatch('.dot', '/?dot'));
      assert(!isMatch('/.dot', '**/*dot'));
      assert(!isMatch('/.dot', '**/?dot'));
      assert(!isMatch('/.dot', '*/*dot'));
      assert(!isMatch('/.dot', '*/?dot'));
      assert(!isMatch('/.dot', '/*dot'));
      assert(!isMatch('/.dot', '/?dot'));
      assert(!isMatch('a/.dot', '*/*dot'));
      assert(!isMatch('a/.dot', '*/?dot'));
      assert(!isMatch('a/.dot', 'a/*dot'));
      assert(!isMatch('a/b/.dot', '**/*dot'));
      assert(!isMatch('a/b/.dot', '**/?dot'));
    });

    it('should not match leading dots with question marks', () => {
      assert(!isMatch('.dot', '?dot'));
      assert(!isMatch('/.dot', '/?dot'));
      assert(!isMatch('a/.dot', 'a/?dot'));
    });

    it('should match with double dots', () => {
      assert(!isMatch('../../b', '**/../*'));
      assert(!isMatch('../../b', '*/../*'));
      assert(!isMatch('../../b', '../*'));
      assert(!isMatch('../a', '*/../*'));
      assert(!isMatch('../c', '*/../*'));
      assert(!isMatch('../c/d', '**/../*'));
      assert(!isMatch('../c/d', '*/../*'));
      assert(!isMatch('../c/d', '../*'));
      assert(!isMatch('a', '**/../*'));
      assert(!isMatch('a', '*/../*'));
      assert(!isMatch('a', '../*'));
      assert(!isMatch('a/../a', '../*'));
      assert(!isMatch('ab/../ac', '../*'));
      assert(!isMatch('a/../', '**/../*'));

      assert(isMatch('../a', '**/../*'));
      assert(isMatch('../a', '../*'));
      assert(isMatch('a/../a', '**/../*'));
      assert(isMatch('a/../a', '*/../*'));
      assert(isMatch('ab/../ac', '**/../*'));
      assert(isMatch('ab/../ac', '*/../*'));
    });
  });

  describe('multiple directories', () => {
    it('should not match a dot when the dot is not explicitly defined', () => {
      assert(!isMatch('.dot', '*dot'));
      assert(!isMatch('/.dot', '*/*dot'));
      assert(!isMatch('.dot', '**/*dot'));
      assert(!isMatch('.dot', '**/?dot'));
      assert(!isMatch('.dot', '*/*dot'));
      assert(!isMatch('.dot', '*/?dot'));
      assert(!isMatch('.dot', '/*dot'));
      assert(!isMatch('.dot', '/?dot'));
      assert(!isMatch('/.dot', '**/*dot'));
      assert(!isMatch('/.dot', '**/?dot'));
      assert(!isMatch('/.dot', '*/?dot'));
      assert(!isMatch('/.dot', '/*dot'));
      assert(!isMatch('/.dot', '/?dot'));
      assert(!isMatch('a/.dot', '*/*dot'));
      assert(!isMatch('a/.dot', '*/?dot'));
      assert(!isMatch('a/b/.dot', '**/*dot'));
      assert(!isMatch('a/b/.dot', '**/?dot'));

      // related https://github.com/jonschlinkert/micromatch/issues/63
      assert(!isMatch('/aaa/bbb/.git', '/aaa/bbb/**'));
      assert(!isMatch('aaa/bbb/.git', 'aaa/bbb/**'));
      assert(!isMatch('/aaa/bbb/ccc/.git', '/aaa/bbb/**'));
      assert(isMatch('/aaa/bbb/.git', '/aaa/bbb/**', { dot: true }));
      assert(isMatch('aaa/bbb/.git', 'aaa/bbb/**', { dot: true }));
      assert(isMatch('/aaa/bbb/ccc/.git', '/aaa/bbb/**', { dot: true }));
    });
  });

  describe('options.dot', () => {
    it('should match dotfiles when `options.dot` is true', () => {
      assert(isMatch('.dotfile.js', '.*.js', { dot: true }));
      assert(isMatch('.dot', '*dot', { dot: true }));
      assert(isMatch('.dot', '?dot', { dot: true }));
      assert(isMatch('.dot', '[.]dot', { dot: true }));
      assert(isMatch('/a/b/.dot', '**/*dot', { dot: true }));
      assert(isMatch('/a/b/.dot', '**/.[d]ot', { dot: true }));
      assert(isMatch('/a/b/.dot', '**/?dot', { dot: true }));
      assert(isMatch('/a/b/.dot', '**/[.]dot', { dot: false }));
      assert(isMatch('/a/b/.dot', '**/[.]dot', { dot: true }));
      assert(isMatch('a/b/.dot', '**/*dot', { dot: true }));
      assert(isMatch('a/b/.dot', '**/.[d]ot', { dot: true }));
      assert(isMatch('a/b/.dot', '**/?dot', { dot: true }));
      assert(isMatch('a/b/.dot', '**/[.]dot', { dot: false }));
      assert(isMatch('a/b/.dot', '**/[.]dot', { dot: true }));
    });

    it('should match dotfiles when `.dot` and `.matchBase` both defined', () => {
      assert(isMatch('a/b/.dot', '*dot', { dot: true, matchBase: true }));
      assert(isMatch('a/b/.dot', '[.]dot', { dot: true, matchBase: true }));
      assert(isMatch('a/b/.dot', '[.]dot', { dot: false, matchBase: true }));
      assert(isMatch('a/b/.dot', '?dot', { dot: true, matchBase: true }));
    });

    it('should work when the path has leading `./`', () => {
      let format = str => str.replace(/^\.\//, '');
      assert(!isMatch('./b/.c', '**', { format }));
      assert(isMatch('./b/.c', '**', { format, dot: true }));
      assert(isMatch('./b/.c', '**', { format, dot: true, matchBase: true }));
    });

    it('should not match dotfiles when `options.dot` is false', () => {
      assert(!isMatch('a/b/.dot', '**/*dot', { dot: false }));
      assert(!isMatch('a/b/.dot', '**/?dot', { dot: false }));
    });

    it('should not match dotfiles when `.dot` is false and `.matchBase` is true', () => {
      assert(!isMatch('a/b/.dot', '*dot', { dot: false, matchBase: true }));
      assert(!isMatch('a/b/.dot', '?dot', { dot: false, matchBase: true }));
    });

    it('should not match dotfiles when `.dot` is not defined and a dot is not in the glob pattern', () => {
      assert(!isMatch('a/b/.dot', '*dot', { matchBase: true }));
      assert(!isMatch('a/b/.dot', '?dot', { matchBase: true }));
      assert(!isMatch('a/b/.dot', '**/*dot'));
      assert(!isMatch('a/b/.dot', '**/?dot'));
    });
  });
});
