'use strict';

require('mocha');
const assert = require('assert');
const mm = require('..');
const opts = { strictSlashes: true, posix: true };

const isMatch = (...args) => {
  return mm.isMatch(...args, opts);
};
const convert = (...args) => {
  let res = mm.parse(...args, opts);
  let str = '';
  res.forEach(state => (str += state.output));
  return str;
};

describe('posix classes', () => {
  describe('posix bracket type conversion', () => {
    it('should create regex character classes from POSIX bracket expressions:', () => {
      assert.equal(convert('foo[[:lower:]]bar'), 'foo[a-z]bar');
      assert.equal(convert('foo[[:lower:][:upper:]]bar'), 'foo[a-zA-Z]bar');
      assert.equal(convert('[[:alpha:]123]'), '(?=.)[a-zA-Z123]');
      assert.equal(convert('[[:lower:]]'), '(?=.)[a-z]');
      assert.equal(convert('[![:lower:]]'), '(?=.)[^a-z]');
      assert.equal(convert('[[:digit:][:upper:][:space:]]'), '(?=.)[0-9A-Z \\t\\r\\n\\v\\f]');
      assert.equal(convert('[[:xdigit:]]'), '(?=.)[A-Fa-f0-9]');
      assert.equal(convert('[[:alnum:][:alpha:][:blank:][:cntrl:][:digit:][:graph:][:lower:][:print:][:punct:][:space:][:upper:][:xdigit:]]'), '(?=.)[a-zA-Z0-9a-zA-Z \\t\\x00-\\x1F\\x7F0-9\\x21-\\x7Ea-z\\x20-\\x7E \\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~ \\t\\r\\n\\v\\fA-ZA-Fa-f0-9]');
      assert.equal(convert('[^[:alnum:][:alpha:][:blank:][:cntrl:][:digit:][:lower:][:space:][:upper:][:xdigit:]]'), '(?=.)[^a-zA-Z0-9a-zA-Z \\t\\x00-\\x1F\\x7F0-9a-z \\t\\r\\n\\v\\fA-ZA-Fa-f0-9]');
      assert.equal(convert('[a-c[:digit:]x-z]'), '(?=.)[a-c0-9x-z]');
      if (process.platform !== 'win32') {
        assert.equal(convert('[_[:alpha:]][_[:alnum:]][_[:alnum:]]*'), '(?=.)[_a-zA-Z][_a-zA-Z0-9][_a-zA-Z0-9][^/]*?', []);
      }
    });
  });

  describe('integration: posix classes with globs', () => {
    it('should work with globs', () => {
      let fixtures = ['a.b', 'a,b', 'a:b', 'a-b', 'a;b', 'a b', 'a_b'];
      assert.deepEqual(mm(fixtures, 'a[^[:alnum:]]b', { posix: true }), fixtures);
      assert.deepEqual(mm(fixtures, 'a@([^[:alnum:]])b', { posix: true }), fixtures);
      assert.deepEqual(mm(fixtures, 'a@([-.,:; _])b', { posix: true }), fixtures);

      assert.deepEqual(mm(fixtures, 'a@([^x])b', { posix: true }), ['a.b', 'a,b', 'a:b', 'a-b', 'a;b', 'a b', 'a_b']);
      assert.deepEqual(mm(fixtures, 'a+([^[:alnum:]])b', { posix: true }), fixtures);
    });
  });

  describe('.isMatch', () => {
    it('should support POSIX.2 character classes', () => {
      assert(isMatch('e', '[[:xdigit:]]'));

      assert(isMatch('a', '[[:alpha:]123]'));
      assert(isMatch('1', '[[:alpha:]123]'));
      assert(!isMatch('5', '[[:alpha:]123]'));
      assert(isMatch('A', '[[:alpha:]123]'));

      assert(isMatch('A', '[[:alpha:]]'));
      assert(!isMatch('9', '[[:alpha:]]'));
      assert(isMatch('b', '[[:alpha:]]'));

      assert(!isMatch('A', '[![:alpha:]]'));
      assert(isMatch('9', '[![:alpha:]]'));
      assert(!isMatch('b', '[![:alpha:]]'));

      assert(!isMatch('A', '[^[:alpha:]]'));
      assert(isMatch('9', '[^[:alpha:]]'));
      assert(!isMatch('b', '[^[:alpha:]]'));

      assert(!isMatch('A', '[[:digit:]]'));
      assert(isMatch('9', '[[:digit:]]'));
      assert(!isMatch('b', '[[:digit:]]'));

      assert(isMatch('A', '[^[:digit:]]'));
      assert(!isMatch('9', '[^[:digit:]]'));
      assert(isMatch('b', '[^[:digit:]]'));

      assert(isMatch('A', '[![:digit:]]'));
      assert(!isMatch('9', '[![:digit:]]'));
      assert(isMatch('b', '[![:digit:]]'));

      assert(isMatch('a', '[[:lower:]]'));
      assert(!isMatch('A', '[[:lower:]]'));
      assert(!isMatch('9', '[[:lower:]]'));

      assert(isMatch('a', '[:alpha:]'), 'invalid posix bracket, but valid char class');
      assert(isMatch('l', '[:alpha:]'), 'invalid posix bracket, but valid char class');
      assert(isMatch('p', '[:alpha:]'), 'invalid posix bracket, but valid char class');
      assert(isMatch('h', '[:alpha:]'), 'invalid posix bracket, but valid char class');
      assert(isMatch(':', '[:alpha:]'), 'invalid posix bracket, but valid char class');
      assert(!isMatch('b', '[:alpha:]'), 'invalid posix bracket, but valid char class');
    });

    it('should support multiple posix brackets in one character class', () => {
      assert(isMatch('9', '[[:lower:][:digit:]]'));
      assert(isMatch('a', '[[:lower:][:digit:]]'));
      assert(!isMatch('A', '[[:lower:][:digit:]]'));
      assert(!isMatch('aa', '[[:lower:][:digit:]]'));
      assert(!isMatch('99', '[[:lower:][:digit:]]'));
      assert(!isMatch('a9', '[[:lower:][:digit:]]'));
      assert(!isMatch('9a', '[[:lower:][:digit:]]'));
      assert(!isMatch('aA', '[[:lower:][:digit:]]'));
      assert(!isMatch('9A', '[[:lower:][:digit:]]'));
      assert(isMatch('aa', '[[:lower:][:digit:]]+'));
      assert(isMatch('99', '[[:lower:][:digit:]]+'));
      assert(isMatch('a9', '[[:lower:][:digit:]]+'));
      assert(isMatch('9a', '[[:lower:][:digit:]]+'));
      assert(!isMatch('aA', '[[:lower:][:digit:]]+'));
      assert(!isMatch('9A', '[[:lower:][:digit:]]+'));
      assert(isMatch('a', '[[:lower:][:digit:]]*'));
      assert(!isMatch('A', '[[:lower:][:digit:]]*'));
      assert(!isMatch('AA', '[[:lower:][:digit:]]*'));
      assert(isMatch('aa', '[[:lower:][:digit:]]*'));
      assert(isMatch('aaa', '[[:lower:][:digit:]]*'));
      assert(isMatch('999', '[[:lower:][:digit:]]*'));
    });

    it('should match word characters', () => {
      assert(!isMatch('a c', 'a[[:word:]]+c'));
      assert(!isMatch('a.c', 'a[[:word:]]+c'));
      assert(!isMatch('a.xy.zc', 'a[[:word:]]+c'));
      assert(!isMatch('a.zc', 'a[[:word:]]+c'));
      assert(!isMatch('abq', 'a[[:word:]]+c'));
      assert(!isMatch('axy zc', 'a[[:word:]]+c'));
      assert(!isMatch('axy', 'a[[:word:]]+c'));
      assert(!isMatch('axy.zc', 'a[[:word:]]+c'));
      assert(isMatch('a123c', 'a[[:word:]]+c'));
      assert(isMatch('a1c', 'a[[:word:]]+c'));
      assert(isMatch('abbbbc', 'a[[:word:]]+c'));
      assert(isMatch('abbbc', 'a[[:word:]]+c'));
      assert(isMatch('abbc', 'a[[:word:]]+c'));
      assert(isMatch('abc', 'a[[:word:]]+c'));

      assert(!isMatch('a c', 'a[[:word:]]+'));
      assert(!isMatch('a.c', 'a[[:word:]]+'));
      assert(!isMatch('a.xy.zc', 'a[[:word:]]+'));
      assert(!isMatch('a.zc', 'a[[:word:]]+'));
      assert(!isMatch('axy zc', 'a[[:word:]]+'));
      assert(!isMatch('axy.zc', 'a[[:word:]]+'));
      assert(isMatch('a123c', 'a[[:word:]]+'));
      assert(isMatch('a1c', 'a[[:word:]]+'));
      assert(isMatch('abbbbc', 'a[[:word:]]+'));
      assert(isMatch('abbbc', 'a[[:word:]]+'));
      assert(isMatch('abbc', 'a[[:word:]]+'));
      assert(isMatch('abc', 'a[[:word:]]+'));
      assert(isMatch('abq', 'a[[:word:]]+'));
      assert(isMatch('axy', 'a[[:word:]]+'));
      assert(isMatch('axyzc', 'a[[:word:]]+'));
      assert(isMatch('axyzc', 'a[[:word:]]+'));
    });

    it('should match character classes', () => {
      assert(!isMatch('abc', 'a[bc]d'));
      assert(isMatch('abd', 'a[bc]d'));
    });

    it('should match character class alphabetical ranges', () => {
      assert(!isMatch('abc', 'a[b-d]e'));
      assert(!isMatch('abd', 'a[b-d]e'));
      assert(isMatch('abe', 'a[b-d]e'));
      assert(!isMatch('ac', 'a[b-d]e'));
      assert(!isMatch('a-', 'a[b-d]e'));

      assert(!isMatch('abc', 'a[b-d]'));
      assert(!isMatch('abd', 'a[b-d]'));
      assert(isMatch('abd', 'a[b-d]+'));
      assert(!isMatch('abe', 'a[b-d]'));
      assert(isMatch('ac', 'a[b-d]'));
      assert(!isMatch('a-', 'a[b-d]'));
    });

    it('should match character classes with leading dashes', () => {
      assert(!isMatch('abc', 'a[-c]'));
      assert(isMatch('ac', 'a[-c]'));
      assert(isMatch('a-', 'a[-c]'));
    });

    it('should match character classes with trailing dashes', () => {
      assert(!isMatch('abc', 'a[c-]'));
      assert(isMatch('ac', 'a[c-]'));
      assert(isMatch('a-', 'a[c-]'));
    });

    it('should match bracket literals', () => {
      assert(isMatch('a]c', 'a[]]c'));
      assert(isMatch('a]c', 'a]c'));
      assert(isMatch('a]', 'a]'));

      assert(isMatch('a[c', 'a[\\[]c'));
      assert(isMatch('a[c', 'a[c'));
      assert(isMatch('a[', 'a['));
    });

    it('should support negated character classes', () => {
      assert(!isMatch('a]', 'a[^bc]d'));
      assert(!isMatch('acd', 'a[^bc]d'));
      assert(isMatch('aed', 'a[^bc]d'));
      assert(isMatch('azd', 'a[^bc]d'));
      assert(!isMatch('ac', 'a[^bc]d'));
      assert(!isMatch('a-', 'a[^bc]d'));
    });

    it('should match negated dashes', () => {
      assert(!isMatch('abc', 'a[^-b]c'));
      assert(isMatch('adc', 'a[^-b]c'));
      assert(!isMatch('a-c', 'a[^-b]c'));
    });

    it('should match negated mm', () => {
      assert(isMatch('a-c', 'a[^\\]b]c'));
      assert(!isMatch('abc', 'a[^\\]b]c'));
      assert(!isMatch('a]c', 'a[^\\]b]c'));
      assert(isMatch('adc', 'a[^\\]b]c'));
    });

    it('should match alpha-numeric characters', () => {
      assert(!isMatch('0123e45g78', '[\\de]+'));
      assert(isMatch('0123e456', '[\\de]+'));
      assert(isMatch('01234', '[\\de]+'));
    });

    it('should not create an invalid posix character class:', () => {
      assert.equal(convert('[:al:]'), '(?:\\[:al:\\]|[:al:])');
      assert.equal(convert('[abc[:punct:][0-9]'), '(?=.)[abc\\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~\\[0-9]');
    });

    it('should return `true` when the pattern matches:', () => {
      assert(isMatch('a', '[[:lower:]]'));
      assert(isMatch('A', '[[:upper:]]'));
      assert(isMatch('A', '[[:digit:][:upper:][:space:]]'));
      assert(isMatch('1', '[[:digit:][:upper:][:space:]]'));
      assert(isMatch(' ', '[[:digit:][:upper:][:space:]]'));
      assert(isMatch('5', '[[:xdigit:]]'));
      assert(isMatch('f', '[[:xdigit:]]'));
      assert(isMatch('D', '[[:xdigit:]]'));
      assert(isMatch('_', '[[:alnum:][:alpha:][:blank:][:cntrl:][:digit:][:graph:][:lower:][:print:][:punct:][:space:][:upper:][:xdigit:]]'));
      assert(isMatch('_', '[[:alnum:][:alpha:][:blank:][:cntrl:][:digit:][:graph:][:lower:][:print:][:punct:][:space:][:upper:][:xdigit:]]'));
      assert(isMatch('.', '[^[:alnum:][:alpha:][:blank:][:cntrl:][:digit:][:lower:][:space:][:upper:][:xdigit:]]'));
      assert(isMatch('5', '[a-c[:digit:]x-z]'));
      assert(isMatch('b', '[a-c[:digit:]x-z]'));
      assert(isMatch('y', '[a-c[:digit:]x-z]'));
    });

    it('should return `false` when the pattern does not match:', () => {
      assert(!isMatch('A', '[[:lower:]]'));
      assert(isMatch('A', '[![:lower:]]'));
      assert(!isMatch('a', '[[:upper:]]'));
      assert(!isMatch('a', '[[:digit:][:upper:][:space:]]'));
      assert(!isMatch('.', '[[:digit:][:upper:][:space:]]'));
      assert(!isMatch('.', '[[:alnum:][:alpha:][:blank:][:cntrl:][:digit:][:lower:][:space:][:upper:][:xdigit:]]'));
      assert(!isMatch('q', '[a-c[:digit:]x-z]'));
    });
  });

  describe('literals', () => {
    it('should match literal brackets when escaped', () => {
      assert(isMatch('a [b]', 'a [b]'));
      assert(isMatch('a b', 'a [b]'));

      assert(isMatch('a [b] c', 'a [b] c'));
      assert(isMatch('a b c', 'a [b] c'));

      assert(isMatch('a [b]', 'a \\[b\\]'));
      assert(!isMatch('a b', 'a \\[b\\]'));

      assert(isMatch('a [b]', 'a ([b])'));
      assert(isMatch('a b', 'a ([b])'));

      assert(isMatch('a b', 'a (\\[b\\]|[b])'));
      assert(isMatch('a [b]', 'a (\\[b\\]|[b])'));
    });
  });

  describe('.makeRe()', () => {
    it('should make a regular expression for the given pattern:', () => {
      assert.deepEqual(mm.makeRe('[[:alpha:]123]', opts), /^(?:(?=.)[a-zA-Z123])$/);
      assert.deepEqual(mm.makeRe('[![:lower:]]', opts), /^(?:(?=.)[^a-z])$/);
    });
  });

  describe('POSIX: From the test suite for the POSIX.2 (BRE) pattern matching code:', () => {
    it('First, test POSIX.2 character classes', () => {
      assert(isMatch('e', '[[:xdigit:]]'));
      assert(isMatch('1', '[[:xdigit:]]'));
      assert(isMatch('a', '[[:alpha:]123]'));
      assert(isMatch('1', '[[:alpha:]123]'));
    });

    it('should match using POSIX.2 negation patterns', () => {
      assert(isMatch('9', '[![:alpha:]]'));
      assert(isMatch('9', '[^[:alpha:]]'));
    });

    it('should match word characters', () => {
      assert(isMatch('A', '[[:word:]]'));
      assert(isMatch('B', '[[:word:]]'));
      assert(isMatch('a', '[[:word:]]'));
      assert(isMatch('b', '[[:word:]]'));
    });

    it('should match digits with word class', () => {
      assert(isMatch('1', '[[:word:]]'));
      assert(isMatch('2', '[[:word:]]'));
    });

    it('should not digits', () => {
      assert(isMatch('1', '[[:digit:]]'));
      assert(isMatch('2', '[[:digit:]]'));
    });

    it('should not match word characters with digit class', () => {
      assert(!isMatch('a', '[[:digit:]]'));
      assert(!isMatch('A', '[[:digit:]]'));
    });

    it('should match uppercase alpha characters', () => {
      assert(isMatch('A', '[[:upper:]]'));
      assert(isMatch('B', '[[:upper:]]'));
    });

    it('should not match lowercase alpha characters', () => {
      assert(!isMatch('a', '[[:upper:]]'));
      assert(!isMatch('b', '[[:upper:]]'));
    });

    it('should not match digits with upper class', () => {
      assert(!isMatch('1', '[[:upper:]]'));
      assert(!isMatch('2', '[[:upper:]]'));
    });

    it('should match lowercase alpha characters', () => {
      assert(isMatch('a', '[[:lower:]]'));
      assert(isMatch('b', '[[:lower:]]'));
    });

    it('should not match uppercase alpha characters', () => {
      assert(!isMatch('A', '[[:lower:]]'));
      assert(!isMatch('B', '[[:lower:]]'));
    });

    it('should match one lower and one upper character', () => {
      assert(isMatch('aA', '[[:lower:]][[:upper:]]'));
      assert(!isMatch('AA', '[[:lower:]][[:upper:]]'));
      assert(!isMatch('Aa', '[[:lower:]][[:upper:]]'));
    });

    it('should match hexidecimal digits', () => {
      assert(isMatch('ababab', '[[:xdigit:]]*'));
      assert(isMatch('020202', '[[:xdigit:]]*'));
      assert(isMatch('900', '[[:xdigit:]]*'));
    });

    it('should match punctuation characters (\\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~)', () => {
      assert(isMatch('!', '[[:punct:]]'));
      assert(isMatch('?', '[[:punct:]]'));
      assert(isMatch('#', '[[:punct:]]'));
      assert(isMatch('&', '[[:punct:]]'));
      assert(isMatch('@', '[[:punct:]]'));
      assert(isMatch('+', '[[:punct:]]'));
      assert(isMatch('*', '[[:punct:]]'));
      assert(isMatch(':', '[[:punct:]]'));
      assert(isMatch('=', '[[:punct:]]'));
      assert(isMatch('|', '[[:punct:]]'));
      assert(isMatch('|++', '[[:punct:]]*'));
    });

    it('should only match one character', () => {
      assert(!isMatch('?*+', '[[:punct:]]'));
    });

    it('should only match one or more punctuation characters', () => {
      assert(isMatch('?*+', '[[:punct:]]*'));
      assert(!isMatch('foo', 'foo[[:punct:]]*'));
      assert(isMatch('foo?*+', 'foo[[:punct:]]*'));
    });

    it('invalid character class expressions are just characters to be matched', () => {
      assert(isMatch('a', '[:al:]'));
      assert(isMatch('a', '[[:al:]'));
      assert(isMatch('!', '[abc[:punct:][0-9]'));
    });

    it('should match the start of a valid sh identifier', () => {
      assert(isMatch('PATH', '[_[:alpha:]]*'));
    });

    it('should match the first two characters of a valid sh identifier', () => {
      assert(isMatch('PATH', '[_[:alpha:]][_[:alnum:]]*'));
    });

    it('should match multiple posix classses', () => {
      assert(isMatch('a1B', '[[:alpha:]][[:digit:]][[:upper:]]'));
      assert(!isMatch('a1b', '[[:alpha:]][[:digit:]][[:upper:]]'));
      assert(isMatch('.', '[[:digit:][:punct:][:space:]]'));
      assert(!isMatch('a', '[[:digit:][:punct:][:space:]]'));
      assert(isMatch('!', '[[:digit:][:punct:][:space:]]'));
      assert(!isMatch('!', '[[:digit:]][[:punct:]][[:space:]]'));
      assert(isMatch('1! ', '[[:digit:]][[:punct:]][[:space:]]'));
      assert(!isMatch('1!  ', '[[:digit:]][[:punct:]][[:space:]]'));
    });

    /**
     * Some of these tests (and their descriptions) were ported directly
     * from the Bash 4.3 unit tests.
     */

    it('how about A?', () => {
      assert(isMatch('9', '[[:digit:]]'));
      assert(!isMatch('X', '[[:digit:]]'));
      assert(isMatch('aB', '[[:lower:]][[:upper:]]'));
      assert(isMatch('a', '[[:alpha:][:digit:]]'));
      assert(isMatch('3', '[[:alpha:][:digit:]]'));
      assert(!isMatch('aa', '[[:alpha:][:digit:]]'));
      assert(!isMatch('a3', '[[:alpha:][:digit:]]'));
      assert(!isMatch('a', '[[:alpha:]\\]'));
      assert(!isMatch('b', '[[:alpha:]\\]'));
    });

    it('OK, what\'s a tab?  is it a blank? a space?', () => {
      assert(isMatch('\t', '[[:blank:]]'));
      assert(isMatch('\t', '[[:space:]]'));
      assert(isMatch(' ', '[[:space:]]'));
    });

    it('let\'s check out characters in the ASCII range', () => {
      assert(!isMatch('\\377', '[[:ascii:]]'));
      assert(!isMatch('9', '[1[:alpha:]123]'));
    });

    it('punctuation', () => {
      assert(!isMatch(' ', '[[:punct:]]'));
    });

    it('graph', () => {
      assert(isMatch('A', '[[:graph:]]'));
      assert(!isMatch('\b', '[[:graph:]]'));
      assert(!isMatch('\n', '[[:graph:]]'));
      assert(isMatch('\s', '[[:graph:]]'));
    });
  });
});
