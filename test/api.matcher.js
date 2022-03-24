'use strict';

const path = require('path');
const assert = require('assert');
const mm = require('..');
const sep = path.sep;

describe('.matcher()', () => {
  afterEach(() => (path.sep = sep));
  after(() => (path.sep = sep));

  describe('errors', () => {
    it('should throw an error when arguments are invalid', () => {
      assert.throws(() => mm.matcher({}));
      assert.throws(() => mm.matcher(null));
      assert.throws(() => mm.matcher());
    });
  });

  describe('posix paths', () => {
    it('should return an array of matches for a literal string', () => {
      let fixtures = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
      assert.deepEqual(mm(fixtures, '(a/b)'), ['a/b']);
      assert.deepEqual(mm(fixtures, 'a/b'), ['a/b']);
    });

    it('should support regex logical or', () => {
      let fixtures = ['a/a', 'a/b', 'a/c'];
      assert.deepEqual(mm(fixtures, 'a/(a|c)'), ['a/a', 'a/c']);
      assert.deepEqual(mm(fixtures, 'a/(a|b|c)'), ['a/a', 'a/b', 'a/c']);
    });

    it('should support regex ranges', () => {
      let fixtures = ['a/a', 'a/b', 'a/c', 'a/x/y', 'a/x'];
      assert.deepEqual(mm(fixtures, 'a/[b-c]'), ['a/b', 'a/c']);
      assert.deepEqual(mm(fixtures, 'a/[a-z]'), ['a/a', 'a/b', 'a/c', 'a/x']);
    });

    it('should support negation patterns', () => {
      let fixtures = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
      assert.deepEqual(mm(fixtures, '!*/*'), []);
      assert.deepEqual(mm(fixtures, '!*/b'), ['a/a', 'a/c', 'b/a', 'b/c']);
      assert.deepEqual(mm(fixtures, '!a/*'), ['b/a', 'b/b', 'b/c']);
      assert.deepEqual(mm(fixtures, '!a/b'), ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      assert.deepEqual(mm(fixtures, '!a/(b)'), ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      assert.deepEqual(mm(fixtures, '!a/(*)'), ['b/a', 'b/b', 'b/c']);
      assert.deepEqual(mm(fixtures, '!(*/b)'), ['a/a', 'a/c', 'b/a', 'b/c']);
      assert.deepEqual(mm(fixtures, '!(a/b)'), ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
    });
  });

  describe('posix paths (array of patterns)', () => {
    it('should return an array of matches for a literal string', () => {
      let fixtures = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
      assert.deepEqual(mm(fixtures, ['(a/b)']), ['a/b']);
      assert.deepEqual(mm(fixtures, ['a/b']), ['a/b']);
    });

    it('should support regex logical or', () => {
      let fixtures = ['a/a', 'a/b', 'a/c'];
      assert.deepEqual(mm(fixtures, ['a/(a|c)']), ['a/a', 'a/c']);
      assert.deepEqual(mm(fixtures, ['a/(a|b|c)']), ['a/a', 'a/b', 'a/c']);
    });

    it('should support regex ranges', () => {
      let fixtures = ['a/a', 'a/b', 'a/c', 'a/x/y', 'a/x'];
      assert.deepEqual(mm(fixtures, ['a/[b-c]']), ['a/b', 'a/c']);
      assert.deepEqual(mm(fixtures, ['a/[a-z]']), ['a/a', 'a/b', 'a/c', 'a/x']);
    });

    it('should support negation patterns', () => {
      let fixtures = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
      assert.deepEqual(mm(fixtures, ['!*/*']), []);
      assert.deepEqual(mm(fixtures, ['!*/*']), []);
      assert.deepEqual(mm(fixtures, ['!*/b']), ['a/a', 'a/c', 'b/a', 'b/c']);
      assert.deepEqual(mm(fixtures, ['!a/*']), ['b/a', 'b/b', 'b/c']);
      assert.deepEqual(mm(fixtures, ['!a/b']), ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      assert.deepEqual(mm(fixtures, ['!a/(b)']), ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      assert.deepEqual(mm(fixtures, ['!a/(*)']), ['b/a', 'b/b', 'b/c']);
      assert.deepEqual(mm(fixtures, ['!(*/b)']), ['a/a', 'a/c', 'b/a', 'b/c']);
      assert.deepEqual(mm(fixtures, ['!(a/b)']), ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
    });
  });

  describe('backlashes for path separators, on posix', () => {
    if (process.platform === 'win32') return;
    let format = str => str;

    it('should return an array of matches for a literal string', () => {
      let fixtures = ['a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c'];
      assert.deepEqual(mm(fixtures, '(a/b)', { format }), []);
      assert.deepEqual(mm(fixtures, 'a/b', { format }), []);
    });

    it('should support regex logical or', () => {
      let fixtures = ['a\\a', 'a\\b', 'a\\c'];
      assert.deepEqual(mm(fixtures, 'a/(a|c)', { format }), []);
      assert.deepEqual(mm(fixtures, 'a/(a|b|c)', { format }), []);
    });

    it('should support regex ranges', () => {
      let fixtures = ['a\\a', 'a\\b', 'a\\c', 'a\\x\\y', 'a\\x'];
      assert.deepEqual(mm(fixtures, 'a/[b-c]', { format }), []);
      assert.deepEqual(mm(fixtures, 'a/[a-z]', { format }), []);
    });

    it('should support negation patterns', () => {
      let fixtures = ['a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c'];
      assert.deepEqual(mm(fixtures, '!*/*', { format }), fixtures);
      assert.deepEqual(mm(fixtures, '!*/b', { format }), fixtures);
      assert.deepEqual(mm(fixtures, '!a/*', { format }), fixtures);
      assert.deepEqual(mm(fixtures, '!a/b', { format }), fixtures);
      assert.deepEqual(mm(fixtures, '!a/(b)', { format }), fixtures);
      assert.deepEqual(mm(fixtures, '!a/(*)', { format }), fixtures);
      assert.deepEqual(mm(fixtures, '!(*/b)', { format }), fixtures);
      assert.deepEqual(mm(fixtures, '!(a/b)', { format }), fixtures);

      assert.deepEqual(mm(fixtures, '!*/*', { windows: true }), []);
      assert.deepEqual(mm(fixtures, ['!*/b'], { windows: true }), ['a/a', 'a/c', 'b/a', 'b/c']);
      assert.deepEqual(mm(fixtures, ['!a/*'], { windows: true }), ['b/a', 'b/b', 'b/c']);
      assert.deepEqual(mm(fixtures, ['!a/b'], { windows: true }), ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      assert.deepEqual(mm(fixtures, ['!a/(b)'], { windows: true }), ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      assert.deepEqual(mm(fixtures, ['!a/(*)'], { windows: true }), ['b/a', 'b/b', 'b/c']);
      assert.deepEqual(mm(fixtures, ['!(*/b)'], { windows: true }), ['a/a', 'a/c', 'b/a', 'b/c']);
      assert.deepEqual(mm(fixtures, ['!(a/b)'], { windows: true }), ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
    });
  });

  describe('windows paths', () => {
    beforeEach(() => {
      path.sep = '\\';
    });

    afterEach(() => {
      path.sep = sep;
    });

    it('should return an array of matches for a literal string', () => {
      let fixtures = ['a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c'];
      assert.deepEqual(mm(fixtures, '(a/b)'), ['a/b']);
      assert.deepEqual(mm(fixtures, '(a/b)', { windows: false }), []);
      assert.deepEqual(mm(fixtures, 'a/b'), ['a/b']);
      assert.deepEqual(mm(fixtures, 'a/b', { windows: false }), []);
    });

    it('should support regex logical or', () => {
      let fixtures = ['a\\a', 'a\\b', 'a\\c'];
      assert.deepEqual(mm(fixtures, 'a/(a|c)'), ['a/a', 'a/c']);
      assert.deepEqual(mm(fixtures, 'a/(a|b|c)'), ['a/a', 'a/b', 'a/c']);
    });

    it('should support regex ranges', () => {
      let fixtures = ['a\\a', 'a\\b', 'a\\c', 'a\\x\\y', 'a\\x'];
      assert.deepEqual(mm(fixtures, 'a/[b-c]'), ['a/b', 'a/c']);
      assert.deepEqual(mm(fixtures, 'a/[a-z]'), ['a/a', 'a/b', 'a/c', 'a/x']);
    });

    it('should support negation patterns', () => {
      let fixtures = ['a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c'];
      assert.deepEqual(mm(fixtures, '!*/*'), []);
      assert.deepEqual(mm(fixtures, '!*/b'), ['a/a', 'a/c', 'b/a', 'b/c']);
      assert.deepEqual(mm(fixtures, '!a/*'), ['b/a', 'b/b', 'b/c']);
      assert.deepEqual(mm(fixtures, '!a/b'), ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      assert.deepEqual(mm(fixtures, '!a/(b)'), ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      assert.deepEqual(mm(fixtures, '!a/(*)'), ['b/a', 'b/b', 'b/c']);
      assert.deepEqual(mm(fixtures, '!(*/b)'), ['a/a', 'a/c', 'b/a', 'b/c']);
      assert.deepEqual(mm(fixtures, '!(a/b)'), ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
    });
  });
});
