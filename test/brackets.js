'use strict';

require('mocha');
var assert = require('assert');
var argv = require('yargs-parser')(process.argv.slice(2));
var minimatch = require('minimatch');
var nm = require('nanomatch');
var mm = require('..');

var matcher = argv.mm ? minimatch : mm;
var isMatch = argv.mm ? minimatch : mm.isMatch.bind(matcher);

function match(fixtures, pattern, expected, msg) {
  var actual = matcher.match(fixtures, pattern).sort(alphaSort);
  expected.sort(alphaSort);
  assert.deepEqual(actual, expected, pattern + ' ' + (msg || ''));
}

function alphaSort(a, b) {
  a = String(a).toLowerCase();
  b = String(b).toLowerCase();
  return a > b ? 1 : a < b ? -1 : 0;
}

function create(pattern, options) {
  return mm.create(pattern, options).map(function(obj) {
    return obj.output;
  }).join('|');
}

describe('brackets', function() {
  describe('main export', function() {
    it('should create the equivalent regex character classes for POSIX expressions:', function() {
      assert.equal(create('foo[[:lower:]]bar'), 'foo[a-z]bar');
      assert.equal(create('foo[[:lower:][:upper:]]bar'), 'foo[a-zA-Z]bar');
      assert.equal(create('[[:alpha:]123]'), '[a-zA-Z123]');
      assert.equal(create('[[:lower:]]'), '[a-z]');
      assert.equal(create('[![:lower:]]'), '[^a-z]');
      assert.equal(create('[[:digit:][:upper:][:space:]]'), '[0-9A-Z \\t\\r\\n\\v\\f]');
      assert.equal(create('[[:xdigit:]]'), '[A-Fa-f0-9]');
      assert.equal(create('[[:alnum:][:alpha:][:blank:][:cntrl:][:digit:][:graph:][:lower:][:print:][:punct:][:space:][:upper:][:xdigit:]]'), '[a-zA-Z0-9a-zA-Z \\t\\x00-\\x1F\\x7F0-9\\x21-\\x7Ea-z\\x20-\\x7E \\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~ \\t\\r\\n\\v\\fA-ZA-Fa-f0-9]');
      assert.equal(create('[^[:alnum:][:alpha:][:blank:][:cntrl:][:digit:][:lower:][:space:][:upper:][:xdigit:]]'), '[^a-zA-Z0-9a-zA-Z \\t\\x00-\\x1F\\x7F0-9a-z \\t\\r\\n\\v\\fA-ZA-Fa-f0-9]');
      assert.equal(create('[a-c[:digit:]x-z]'), '[a-c0-9x-z]');
      assert.equal(create('[_[:alpha:]][_[:alnum:]][_[:alnum:]]*'), '[_a-zA-Z][_a-zA-Z0-9][_a-zA-Z0-9]*?\\/?', []);
    });
  });

  describe('.match', function() {
    it('should support POSIX.2 character classes', function() {
      match(['e'], '[[:xdigit:]]', [ 'e' ]);
      match(['a', '1', '5', 'A'], '[[:alpha:]123]', [ '1', 'a', 'A' ]);
      match(['9', 'A', 'b'], '[![:alpha:]]', ['9']);
      match(['9', 'A', 'b'], '[^[:alpha:]]', ['9']);
      match(['9', 'a', 'B'], '[[:digit:]]', ['9']);
      match(['a', 'b', 'A'], '[:alpha:]', ['a'], 'not a valid posix bracket, but valid char class');
      match(['a', 'b', 'A'], '[[:alpha:]]', [ 'a', 'A', 'b' ]);
      match(['a', 'aa', 'aB', 'a7'], '[[:lower:][:lower:]]', ['a']);
      match(['a', '7', 'aa', 'aB', 'a7'], '[[:lower:][:digit:]]', [ '7', 'a' ]);
    });

    it('should match word characters', function() {
      var fixtures = ['a c', 'a1c', 'a123c', 'a.c', 'a.xy.zc', 'a.zc', 'abbbbc', 'abbbc', 'abbc', 'abc', 'abq', 'axy zc', 'axy', 'axy.zc', 'axyzc'];
      match(fixtures, 'a[a-z]+c', ['abbbbc', 'abbbc', 'abbc', 'abc', 'axyzc']);
    });

    it('should match character classes', function() {
      match(['abc', 'abd'], 'a[bc]d', ['abd']);
    });

    it('should match character class alphabetical ranges', function() {
      match(['abc', 'abd', 'ace', 'ac', 'a-'], 'a[b-d]e', ['ace']);
      match(['abc', 'abd', 'ace', 'ac', 'a-'], 'a[b-d]', ['ac']);
    });

    it('should match character classes with leading dashes', function() {
      match(['abc', 'abd', 'ace', 'ac', 'a-'], 'a[-c]', ['a-', 'ac']);
    });

    it('should match character classes with trailing dashes', function() {
      match(['abc', 'abd', 'ace', 'ac', 'a-'], 'a[c-]', ['a-', 'ac']);
    });

    it('should match bracket literals', function() {
      match(['a]c', 'abd', 'ace', 'ac', 'a-'], 'a[]]c', ['a]c']);
    });

    it('should match bracket literals', function() {
      match(['a]', 'abd', 'ace', 'ac', 'a-'], 'a]', ['a]']);
    });

    it('should negation patterns', function() {
      match(['a]', 'acd', 'aed', 'ac', 'a-'], 'a[^bc]d', ['aed']);
    });

    it('should match negated dashes', function() {
      match(['adc', 'a-c'], 'a[^-b]c', ['adc']);
    });

    it('should match negated brackets', function() {
      match(['adc', 'a]c'], 'a[^]b]c', ['adc']);
    });

    it('should match alpha-numeric characters', function() {
      match(['01234', '0123e456', '0123e45g78'], '[\\de]+', ['01234', '0123e456']);
      match(['01234', '0123e456', '0123e45g78'], '[\\de]*', ['01234', '0123e456']);
      match(['01234', '0123e456', '0123e45g78'], '[e\\d]+', ['01234', '0123e456']);
    });

    it('should not create an invalid posix character class:', function() {
      assert.equal(create('[:al:]'), '[:al:]');
      assert.equal(create('[abc[:punct:][0-9]'), '[abc\\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~\\[0-9]');
    });

    it('should return `true` when the pattern matches:', function() {
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

    it('should return `false` when the pattern does not match:', function() {
      assert(!isMatch('A', '[[:lower:]]'));
      assert(isMatch('A', '[![:lower:]]'));
      assert(!isMatch('a', '[[:upper:]]'));
      assert(!isMatch('a', '[[:digit:][:upper:][:space:]]'));
      assert(!isMatch('.', '[[:digit:][:upper:][:space:]]'));
      assert(!isMatch('.', '[[:alnum:][:alpha:][:blank:][:cntrl:][:digit:][:lower:][:space:][:upper:][:xdigit:]]'));
      assert(!isMatch('q', '[a-c[:digit:]x-z]'));
    });
  });

  describe('.makeRe()', function() {
    it('should make a regular expression for the given pattern:', function() {
      assert.deepEqual(matcher.makeRe('[[:alpha:]123]'), /^(?:[a-zA-Z123])$/);
      assert.deepEqual(matcher.makeRe('[![:lower:]]'), /^(?:[^a-z])$/);
    });
  });

  describe('.match()', function() {
    it('should return an array of matching strings:', function() {
      assert.deepEqual(matcher.match(['a1B', 'a1b'], '[[:alpha:]][[:digit:]][[:upper:]]'), ['a1B']);
      assert.deepEqual(matcher.match(['.', 'a', '!'], '[[:digit:][:punct:][:space:]]'), ['.', '!']);
    });
  });

  describe('POSIX: From the test suite for the POSIX.2 (BRE) pattern matching code:', function() {
    it('First, test POSIX.2 character classes', function() {
      assert(isMatch('e', '[[:xdigit:]]'));
      assert(isMatch('1', '[[:xdigit:]]'));
      assert(isMatch('a', '[[:alpha:]123]'));
      assert(isMatch('1', '[[:alpha:]123]'));
    });

    it('should match using POSIX.2 negation patterns', function() {
      assert(isMatch('9', '[![:alpha:]]'));
      assert(isMatch('9', '[^[:alpha:]]'));
    });

    it('should match word characters', function() {
      assert(isMatch('A', '[[:word:]]'));
      assert(isMatch('B', '[[:word:]]'));
      assert(isMatch('a', '[[:word:]]'));
      assert(isMatch('b', '[[:word:]]'));
    });

    it('should match digits with word class', function() {
      assert(isMatch('1', '[[:word:]]'));
      assert(isMatch('2', '[[:word:]]'));
    });

    it('should not digits', function() {
      assert(isMatch('1', '[[:digit:]]'));
      assert(isMatch('2', '[[:digit:]]'));
    });

    it('should not match word characters with digit class', function() {
      assert(!isMatch('a', '[[:digit:]]'));
      assert(!isMatch('A', '[[:digit:]]'));
    });

    it('should match uppercase alpha characters', function() {
      assert(isMatch('A', '[[:upper:]]'));
      assert(isMatch('B', '[[:upper:]]'));
    });

    it('should not match lowercase alpha characters', function() {
      assert(!isMatch('a', '[[:upper:]]'));
      assert(!isMatch('b', '[[:upper:]]'));
    });

    it('should not match digits with upper class', function() {
      assert(!isMatch('1', '[[:upper:]]'));
      assert(!isMatch('2', '[[:upper:]]'));
    });

    it('should match lowercase alpha characters', function() {
      assert(isMatch('a', '[[:lower:]]'));
      assert(isMatch('b', '[[:lower:]]'));
    });

    it('should not match uppercase alpha characters', function() {
      assert(!isMatch('A', '[[:lower:]]'));
      assert(!isMatch('B', '[[:lower:]]'));
    });

    it('should match one lower and one upper character', function() {
      assert(isMatch('aA', '[[:lower:]][[:upper:]]'));
      assert(!isMatch('AA', '[[:lower:]][[:upper:]]'));
      assert(!isMatch('Aa', '[[:lower:]][[:upper:]]'));
    });

    it('should match hexidecimal digits', function() {
      assert(isMatch('ababab', '[[:xdigit:]]*'));
      assert(isMatch('020202', '[[:xdigit:]]*'));
      assert(isMatch('900', '[[:xdigit:]]*'));
    });

    it('should match punctuation characters (\\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~)', function() {
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

    it('should only match one character', function() {
      assert(!isMatch('?*+', '[[:punct:]]'));
    });

    it('should only match zero or more characters', function() {
      assert(isMatch('?*+', '[[:punct:]]*'));
      assert(isMatch('', '[[:punct:]]*'));
    });

    it('invalid character class expressions are just characters to be matched', function() {
      match(['a'], '[:al:]', ['a']);
      match(['a'], '[[:al:]', ['a']);
      match(['!'], '[abc[:punct:][0-9]', ['!']);
    });

    it('should match the start of a valid sh identifier', function() {
      assert(isMatch('PATH', '[_[:alpha:]]*'));
    });

    it('should match the first two characters of a valid sh identifier', function() {
      assert(isMatch('PATH', '[_[:alpha:]][_[:alnum:]]*'));
    });

    /**
     * Some of these tests (and their descriptions) were ported directly
     * from the Bash 4.3 unit tests.
     */

    it('how about A?', function() {
      match(['9'], '[[:digit:]]', ['9']);
      match(['X'], '[[:digit:]]', []);
      match(['aB'], '[[:lower:]][[:upper:]]', ['aB']);
      match(['a', '3', 'aa', 'a3', 'abc'], '[[:alpha:][:digit:]]', ['3', 'a']);
      match(['a', 'b'], '[[:alpha:]\\]', [], []);
    });

    it('OK, what\'s a tab?  is it a blank? a space?', function() {
      assert(isMatch('\t', '[[:blank:]]'));
      assert(isMatch('\t', '[[:space:]]'));
      assert(isMatch(' ', '[[:space:]]'));
    });

    it('let\'s check out characters in the ASCII range', function() {
      assert(!isMatch('\\377', '[[:ascii:]]'));
      assert(!isMatch('9', '[1[:alpha:]123]'));
    });

    it('punctuation', function() {
      assert(!isMatch(' ', '[[:punct:]]'));
    });

    it('graph', function() {
      assert(isMatch('A', '[[:graph:]]'));
      assert(!isMatch('\b', '[[:graph:]]'));
      assert(!isMatch('\n', '[[:graph:]]'));
      assert(isMatch('\s', '[[:graph:]]'));
    });
  });
});

