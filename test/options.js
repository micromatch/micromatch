'use strict';

const path = require('path');
const assert = require('assert');
const mm = require('..');
const mi = require('minimatch');

if (!process.env.ORIGINAL_PATH_SEP) {
  process.env.ORIGINAL_PATH_SEP = path.sep
}

describe('options', () => {
  beforeEach(() => (path.sep = '\\'));
  afterEach(() => (path.sep = process.env.ORIGINAL_PATH_SEP));
  after(() => (path.sep = process.env.ORIGINAL_PATH_SEP));

  describe('options.failglob (from Bash 4.3 tests)', () => {
    it('should throw an error when no matches are found:', () => {
      assert.throws(() => mm(['foo'], '\\^', { failglob: true }), /No matches found for/);
    });
  });

  describe('options.ignore', () => {
    let negations = ['a/a', 'a/b', 'a/c', 'a/d', 'a/e', 'b/a', 'b/b', 'b/c'];
    let globs = ['.a', '.a/a', '.a/a/a', '.a/a/a/a', 'a', 'a/.a', 'a/a', 'a/a/.a', 'a/a/a', 'a/a/a/a', 'a/a/a/a/a', 'a/a/b', 'a/b', 'a/b/c', 'a/c', 'a/x', 'b', 'b/b/b', 'b/b/c', 'c/c/c', 'e/f/g', 'h/i/a', 'x/x/x', 'x/y', 'z/z', 'z/z/z'];

    it('should filter out ignored patterns', () => {
      let opts = { ignore: ['a/**'], strictSlashes: true };
      let dotOpts = { ...opts, dot: true };

      assert.deepEqual(mm(globs, '*', opts), ['a', 'b']);
      assert.deepEqual(mm(globs, '*', { ...opts, strictSlashes: false }), ['b']);
      assert.deepEqual(mm(globs, '*', { ignore: '**/a' }), ['b']);
      assert.deepEqual(mm(globs, '*/*', opts), ['x/y', 'z/z']);
      assert.deepEqual(mm(globs, '*/*/*', opts), ['b/b/b', 'b/b/c', 'c/c/c', 'e/f/g', 'h/i/a', 'x/x/x', 'z/z/z']);
      assert.deepEqual(mm(globs, '*/*/*/*', opts), []);
      assert.deepEqual(mm(globs, '*/*/*/*/*', opts), []);
      assert.deepEqual(mm(globs, 'a/*', opts), []);
      assert.deepEqual(mm(globs, '**/*/x', opts), ['x/x/x']);
      assert.deepEqual(mm(globs, '**/*/[b-z]', opts), ['b/b/b', 'b/b/c', 'c/c/c', 'e/f/g', 'x/x/x', 'x/y', 'z/z', 'z/z/z']);

      assert.deepEqual(mm(globs, '*', { ignore: '**/a', dot: true }), ['.a', 'b']);
      assert.deepEqual(mm(globs, '*', dotOpts), ['.a', 'a', 'b']);
      assert.deepEqual(mm(globs, '*/*', dotOpts), ['.a/a', 'x/y', 'z/z']);
      assert.deepEqual(mm(globs, '*/*/*', dotOpts), ['.a/a/a', 'b/b/b', 'b/b/c', 'c/c/c', 'e/f/g', 'h/i/a', 'x/x/x', 'z/z/z']);
      assert.deepEqual(mm(globs, '*/*/*/*', dotOpts), ['.a/a/a/a']);
      assert.deepEqual(mm(globs, '*/*/*/*/*', dotOpts), []);
      assert.deepEqual(mm(globs, 'a/*', dotOpts), []);
      assert.deepEqual(mm(globs, '**/*/x', dotOpts), ['x/x/x']);

      // see https://github.com/jonschlinkert/micromatch/issues/79
      assert.deepEqual(mm(['foo.js', 'a/foo.js'], '**/foo.js'), ['foo.js', 'a/foo.js']);
      assert.deepEqual(mm(['foo.js', 'a/foo.js'], '**/foo.js', { dot: true }), ['foo.js', 'a/foo.js']);

      assert.deepEqual(mm(negations, '!b/a', opts), ['b/b', 'b/c']);
      assert.deepEqual(mm(negations, '!b/(a)', opts), ['b/b', 'b/c']);
      assert.deepEqual(mm(negations, '!(b/(a))', opts), ['b/b', 'b/c']);
      assert.deepEqual(mm(negations, '!(b/a)', opts), ['b/b', 'b/c']);

      assert.deepEqual(mm(negations, '**'), negations, 'nothing is ignored');
      assert.deepEqual(mm(negations, '**', { ignore: ['*/b', '*/a'] }), ['a/c', 'a/d', 'a/e', 'b/c']);
      assert.deepEqual(mm(negations, '**', { ignore: ['**'] }), []);
    });
  });

  describe('options.matchBase', () => {
    it('should match the basename of file paths when `options.matchBase` is true', () => {
      assert.deepEqual(mm(['a/b/c/d.md'], '*.md'), [], 'should not match multiple levels');
      assert.deepEqual(mm(['a/b/c/foo.md'], '*.md'), [], 'should not match multiple levels');
      assert.deepEqual(mm(['ab', 'acb', 'acb/', 'acb/d/e', 'x/y/acb', 'x/y/acb/d'], 'a?b'), ['acb'], 'should not match multiple levels');
      assert.deepEqual(mm(['a/b/c/d.md'], '*.md', { matchBase: true }), ['a/b/c/d.md']);
      assert.deepEqual(mm(['a/b/c/foo.md'], '*.md', { matchBase: true }), ['a/b/c/foo.md']);
      assert.deepEqual(mm(['x/y/acb', 'acb/', 'acb/d/e', 'x/y/acb/d'], 'a?b', { matchBase: true }), ['x/y/acb', 'acb/']);
    });

    it('should work with negation patterns', () => {
      assert(mm.isMatch('./x/y.js', '*.js', { matchBase: true }));
      assert(!mm.isMatch('./x/y.js', '!*.js', { matchBase: true }));
      assert(mm.isMatch('./x/y.js', '**/*.js', { matchBase: true }));
      assert(!mm.isMatch('./x/y.js', '!**/*.js', { matchBase: true }));
    });
  });

  describe('options.flags', () => {
    it('should be case-sensitive by default', () => {
      assert.deepEqual(mm(['a/b/d/e.md'], 'a/b/D/*.md'), [], 'should not match a dirname');
      assert.deepEqual(mm(['a/b/c/e.md'], 'A/b/*/E.md'), [], 'should not match a basename');
      assert.deepEqual(mm(['a/b/c/e.md'], 'A/b/C/*.MD'), [], 'should not match a file extension');
    });

    it('should not be case-sensitive when `i` is set on `options.flags`', () => {
      assert.deepEqual(mm(['a/b/d/e.md'], 'a/b/D/*.md', { flags: 'i' }), ['a/b/d/e.md']);
      assert.deepEqual(mm(['a/b/c/e.md'], 'A/b/*/E.md', { flags: 'i' }), ['a/b/c/e.md']);
      assert.deepEqual(mm(['a/b/c/e.md'], 'A/b/C/*.MD', { flags: 'i' }), ['a/b/c/e.md']);
    });
  });

  describe('options.nobrace', () => {
    it('should not expand braces when disabled', () => {
      assert.deepEqual(mm(['a', 'b', 'c'], '{a,b,c,d}'), ['a', 'b', 'c']);
      assert.deepEqual(mm(['a', 'b', 'c'], '{a,b,c,d}', { nobrace: true }), []);
      assert.deepEqual(mm(['1', '2', '3'], '{1..2}', { nobrace: true }), []);
    });
  });

  describe('options.nocase', () => {
    it('should not be case-sensitive when `options.nocase` is true', () => {
      assert.deepEqual(mm(['a/b/c/e.md'], 'A/b/*/E.md', { nocase: true }), ['a/b/c/e.md']);
      assert.deepEqual(mm(['a/b/c/e.md'], 'A/b/C/*.MD', { nocase: true }), ['a/b/c/e.md']);
      assert.deepEqual(mm(['a/b/c/e.md'], 'A/b/C/*.md', { nocase: true }), ['a/b/c/e.md']);
      assert.deepEqual(mm(['a/b/d/e.md'], 'a/b/D/*.md', { nocase: true }), ['a/b/d/e.md']);
    });

    it('should not double-set `i` when both `nocase` and the `i` flag are set', () => {
      let opts = { nocase: true, flags: 'i' };
      assert.deepEqual(mm(['a/b/d/e.md'], 'a/b/D/*.md', opts), ['a/b/d/e.md']);
      assert.deepEqual(mm(['a/b/c/e.md'], 'A/b/*/E.md', opts), ['a/b/c/e.md']);
      assert.deepEqual(mm(['a/b/c/e.md'], 'A/b/C/*.MD', opts), ['a/b/c/e.md']);
    });
  });

  describe('options.noextglob', () => {
    it('should match literal parens when noextglob is true (issue #116)', () => {
      assert(mm.isMatch('a/(dir)', 'a/(dir)', { noextglob: true }));
    });

    it('should not match extglobs when noextglob is true', () => {
      assert(!mm.isMatch('ax', '?(a*|b)', { noextglob: true }));
      assert.deepEqual(mm(['a.j.js', 'a.md.js'], '*.*(j).js', { noextglob: true }), ['a.j.js']);
      assert.deepEqual(mm(['a/z', 'a/b', 'a/!(z)'], 'a/!(z)', { noextglob: true }), ['a/!(z)']);
      assert.deepEqual(mm(['a/z', 'a/b'], 'a/!(z)', { noextglob: true }), []);
      assert.deepEqual(mm(['c/a/v'], 'c/!(z)/v', { noextglob: true }), []);
      assert.deepEqual(mm(['c/z/v', 'c/a/v'], 'c/!(z)/v', { noextglob: true }), []);
      assert.deepEqual(mm(['c/z/v', 'c/a/v'], 'c/@(z)/v', { noextglob: true }), []);
      assert.deepEqual(mm(['c/z/v', 'c/a/v'], 'c/+(z)/v', { noextglob: true }), []);
      assert.deepEqual(mm(['c/z/v', 'c/a/v'], 'c/*(z)/v', { noextglob: true }), ['c/z/v']);
      assert.deepEqual(mm(['c/z/v', 'z', 'zf', 'fz'], '?(z)', { noextglob: true }), ['fz']);
      assert.deepEqual(mm(['c/z/v', 'z', 'zf', 'fz'], '+(z)', { noextglob: true }), []);
      assert.deepEqual(mm(['c/z/v', 'z', 'zf', 'fz'], '*(z)', { noextglob: true }), ['z', 'fz']);
      assert.deepEqual(mm(['cz', 'abz', 'az'], 'a@(z)', { noextglob: true }), []);
      assert.deepEqual(mm(['cz', 'abz', 'az'], 'a*@(z)', { noextglob: true }), []);
      assert.deepEqual(mm(['cz', 'abz', 'az'], 'a!(z)', { noextglob: true }), []);
      assert.deepEqual(mm(['cz', 'abz', 'az', 'azz'], 'a?(z)', { noextglob: true }), ['abz', 'azz']);
      assert.deepEqual(mm(['cz', 'abz', 'az', 'azz', 'a+z'], 'a+(z)', { noextglob: true }), ['a+z']);
      assert.deepEqual(mm(['cz', 'abz', 'az'], 'a*(z)', { noextglob: true }), ['abz', 'az']);
      assert.deepEqual(mm(['cz', 'abz', 'az'], 'a**(z)', { noextglob: true }), ['abz', 'az']);
      assert.deepEqual(mm(['cz', 'abz', 'az'], 'a*!(z)', { noextglob: true }), []);
    });
  });

  describe('options.nodupes', () => {
    beforeEach(() => {
      path.sep = '\\';
    });
    afterEach(() => {
      path.sep = process.env.ORIGINAL_PATH_SEP;
    });

    it('should remove duplicate elements from the result array:', () => {
      let fixtures = ['.editorconfig', '.git', '.gitignore', '.nyc_output', '.travis.yml', '.verb.md', 'CHANGELOG.md', 'CONTRIBUTING.md', 'LICENSE', 'coverage', 'example.js', 'example.md', 'example.css', 'index.js', 'node_modules', 'package.json', 'test.js', 'utils.js'];
      assert.deepEqual(mm(['abc', '/a/b/c', '\\a\\b\\c'], '/a/b/c', { windows: true }), ['/a/b/c']);
      assert.deepEqual(mm(['abc', '/a/b/c', '\\a\\b\\c'], '\\a\\b\\c', { windows: true }), ['/a/b/c']);
      assert.deepEqual(mm(['abc', '/a/b/c', '\\a\\b\\c'], '/a/b/c', { windows: true, nodupes: true }), ['/a/b/c']);
      assert.deepEqual(mm(['abc', '/a/b/c', '\\a\\b\\c'], '\\a\\b\\c', { windows: true, nodupes: true }), ['/a/b/c']);
      assert.deepEqual(mm(fixtures, ['example.*', '*.js'], { windows: true, nodupes: true }), ['example.js', 'example.md', 'example.css', 'index.js', 'test.js', 'utils.js']);
    });

    it('should not remove duplicates', () => {
      assert.deepEqual(mm(['abc', '/a/b/c', '\\a\\b\\c'], '/a/b/c'), ['/a/b/c']);
      assert.deepEqual(mm(['abc', '/a/b/c', '\\a\\b\\c'], '/a/b/c', { nodupes: true }), ['/a/b/c']);
      assert.deepEqual(mm(['abc', '/a/b/c', '\\a\\b\\c'], '/a/b/c', { windows: true, nodupes: true }), ['/a/b/c']);
    });
  });

  describe('options.nonegate', () => {
    it('should support the `nonegate` option:', () => {
      assert.deepEqual(mm(['a/a/a', 'a/b/a', 'b/b/a', 'c/c/a', 'c/c/b'], '!**/a'), ['c/c/b']);
      assert.deepEqual(mm(['a.md', '!a.md', 'a.txt'], '!*.md', { nonegate: true }), ['!a.md']);

      // this should not return more than one nested directory, since "!**/a" is
      // collapsed to "!*/a", given that "**" is not the only thing in the segment.
      assert.deepEqual(mm(['!a/a/a', 'a/b/a', 'b/b/a', '!c/c/a', '!a/a'], '!**/a', { nonegate: true }), ['!a/a']);
      assert.deepEqual(mm(['!*.md', '.dotfile.txt', 'a/b/.dotfile'], '!*.md', { nonegate: true }), ['!*.md']);
    });
  });

  describe('options.nonull', () => {
    it('should support the `nonull` option:', () => {
      assert.deepEqual(mm(['*', '\\*'], '\\*', { nonull: true }), ['*', '\\*']);
      assert.deepEqual(mm(['*', '\\^'], '\\^', { nonull: true }), ['\\^']);
      assert.deepEqual(mm(['*', 'a\\*'], 'a\\*', { nonull: true }), ['a\\*']);
    });
  });

  describe('options.windows', () => {
    it('should windows file paths by default', () => {
      assert.deepEqual(mm(['a\\b\\c.md'], '**/*.md'), ['a/b/c.md']);
      assert.deepEqual(mm(['a\\b\\c.md'], '**\\\\*.md', { windows: false }), ['a\\b\\c.md']);
    });

    it('should windows absolute paths', () => {
      assert.deepEqual(mm(['E:\\a\\b\\c.md'], 'E:/**/*.md'), ['E:/a/b/c.md']);
      assert.deepEqual(mm(['E:\\a\\b\\c.md'], 'E:/**/*.md', { windows: false }), []);
    });

    it('should strip leading `./`', () => {
      let fixtures = ['./a', './a/a/a', './a/a/a/a', './a/a/a/a/a', './a/b', './a/x', './z/z', 'a', 'a/a', 'a/a/b', 'a/c', 'b', 'x/y'].sort();
      let format = str => str.replace(/^\.\//, '');
      let opts = { format };
      assert.deepEqual(mm(fixtures, '*', opts), ['a', 'b']);
      assert.deepEqual(mm(fixtures, '**/a/**', opts), ['a', 'a/a/a', 'a/a/a/a', 'a/a/a/a/a', 'a/b', 'a/x', 'a/a', 'a/a/b', 'a/c']);
      assert.deepEqual(mm(fixtures, '*/*', opts), ['a/b', 'a/x', 'z/z', 'a/a', 'a/c', 'x/y']);
      assert.deepEqual(mm(fixtures, '*/*/*', opts), ['a/a/a', 'a/a/b']);
      assert.deepEqual(mm(fixtures, '*/*/*/*', opts), ['a/a/a/a']);
      assert.deepEqual(mm(fixtures, '*/*/*/*/*', opts), ['a/a/a/a/a']);
      assert.deepEqual(mm(fixtures, './*', opts), ['a', 'b']);
      assert.deepEqual(mm(fixtures, './**/a/**', opts), ['a', 'a/a/a', 'a/a/a/a', 'a/a/a/a/a', 'a/b', 'a/x', 'a/a', 'a/a/b', 'a/c']);
      assert.deepEqual(mm(fixtures, 'a/*/a', opts), ['a/a/a']);
      assert.deepEqual(mm(fixtures, 'a/*', opts), ['a/b', 'a/x', 'a/a', 'a/c']);
      assert.deepEqual(mm(fixtures, 'a/*/*', opts), ['a/a/a', 'a/a/b']);
      assert.deepEqual(mm(fixtures, 'a/*/*/*', opts), ['a/a/a/a']);
      assert.deepEqual(mm(fixtures, 'a/*/*/*/*', opts), ['a/a/a/a/a']);
      assert.deepEqual(mm(fixtures, 'a/*/a', opts), ['a/a/a']);

      assert.deepEqual(mm(fixtures, '*', { ...opts, windows: false }), ['a', 'b']);
      assert.deepEqual(mm(fixtures, '**/a/**', { ...opts, windows: false }), ['a', 'a/a/a', 'a/a/a/a', 'a/a/a/a/a', 'a/b', 'a/x', 'a/a', 'a/a/b', 'a/c']);
      assert.deepEqual(mm(fixtures, '*/*', { ...opts, windows: false }), ['a/b', 'a/x', 'z/z', 'a/a', 'a/c', 'x/y']);
      assert.deepEqual(mm(fixtures, '*/*/*', { ...opts, windows: false }), ['a/a/a', 'a/a/b']);
      assert.deepEqual(mm(fixtures, '*/*/*/*', { ...opts, windows: false }), ['a/a/a/a']);
      assert.deepEqual(mm(fixtures, '*/*/*/*/*', { ...opts, windows: false }), ['a/a/a/a/a']);
      assert.deepEqual(mm(fixtures, './*', { ...opts, windows: false }), ['a', 'b']);
      assert.deepEqual(mm(fixtures, './**/a/**', { ...opts, windows: false }), ['a', 'a/a/a', 'a/a/a/a', 'a/a/a/a/a', 'a/b', 'a/x', 'a/a', 'a/a/b', 'a/c']);
      assert.deepEqual(mm(fixtures, './a/*/a', { ...opts, windows: false }), ['a/a/a']);
      assert.deepEqual(mm(fixtures, 'a/*', { ...opts, windows: false }), ['a/b', 'a/x', 'a/a', 'a/c']);
      assert.deepEqual(mm(fixtures, 'a/*/*', { ...opts, windows: false }), ['a/a/a', 'a/a/b']);
      assert.deepEqual(mm(fixtures, 'a/*/*/*', { ...opts, windows: false }), ['a/a/a/a']);
      assert.deepEqual(mm(fixtures, 'a/*/*/*/*', { ...opts, windows: false }), ['a/a/a/a/a']);
      assert.deepEqual(mm(fixtures, 'a/*/a', { ...opts, windows: false }), ['a/a/a']);
    });
  });

  describe('options.dot', () => {
    describe('when `dot` or `dotfile` is NOT true:', () => {
      it('should not match dotfiles by default:', () => {
        let format = str => str.replace(/^\.\//, '');
        let opts = { format, result: format };

        assert.deepEqual(mm(['.dotfile'], '*'), []);
        assert.deepEqual(mm(['.dotfile'], '**'), []);
        assert.deepEqual(mm(['a/b/c/.dotfile.md'], '*.md'), []);
        assert.deepEqual(mm(['a/b', 'a/.b', '.a/b', '.a/.b'], '**'), ['a/b']);
        assert.deepEqual(mm(['a/b/c/.dotfile'], '*.*'), []);

        // https://github.com/isaacs/minimatch/issues/30
        assert.deepEqual(mm(['foo/bar.js'], '**/foo/**', opts), ['foo/bar.js']);
        assert.deepEqual(mm(['./foo/bar.js'], './**/foo/**', opts), ['foo/bar.js']);
        assert.deepEqual(mm(['./foo/bar.js'], '**/foo/**', opts), ['foo/bar.js']);
        assert.deepEqual(mm(['./foo/bar.js'], './**/foo/**', { ...opts, windows: false }), ['foo/bar.js']);
        assert.deepEqual(mm(['./foo/bar.js'], '**/foo/**', { ...opts, windows: false }), ['foo/bar.js']);
      });

      it('should match dotfiles when a leading dot is defined in the path:', () => {
        assert.deepEqual(mm(['a/b/c/.dotfile.md'], '**/.*'), ['a/b/c/.dotfile.md']);
        assert.deepEqual(mm(['a/b/c/.dotfile.md'], '**/.*.md'), ['a/b/c/.dotfile.md']);
      });

      it('should use negation patterns on dotfiles:', () => {
        assert.deepEqual(mm(['.a', '.b', 'c', 'c.md'], '!.*'), ['c', 'c.md']);
        assert.deepEqual(mm(['.a', '.b', 'c', 'c.md'], '!.b'), ['.a', 'c', 'c.md']);
      });
    });
  });

  describe('windows', () => {
    it('should windows file paths', () => {
      assert.deepEqual(mm(['a\\b\\c.md'], '**/*.md'), ['a/b/c.md']);
      assert.deepEqual(mm(['a\\b\\c.md'], '**/*.md', { windows: false }), ['a\\b\\c.md']);
      assert.deepEqual(mm(['a\\b\\c.md'], '**\\\\*.md', { windows: false }), ['a\\b\\c.md']);
    });

    it('should windows absolute paths', () => {
      assert.deepEqual(mm(['E:\\a\\b\\c.md'], 'E:/**/*.md'), ['E:/a/b/c.md']);
      assert.deepEqual(mm(['E:\\a\\b\\c.md'], 'E:/**/*.md', { windows: false }), []);
    });
  });
});
