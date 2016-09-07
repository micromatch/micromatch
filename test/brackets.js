'use strict';

require('mocha');
var assert = require('assert');
var argv = require('yargs-parser')(process.argv.slice(2));
var minimatch = require('minimatch');
var brackets = require('..');

var matcher = argv.mm ? minimatch : brackets;
var isMatch = argv.mm ? minimatch : brackets.isMatch.bind(matcher);

function match(arr, pattern, expected, options) {
  var actual = matcher.match(arr, pattern, options);
  assert.deepEqual(actual.sort(), expected.sort());
}

describe('POSIX brackets', function() {
  it('should support POSIX.2 character classes', function() {
    assert(isMatch('e', '[[:xdigit:]]'));
    assert(isMatch('a', '[[:alpha:]123]'));
    assert(isMatch('1', '[[:alpha:]123]'));
    assert(isMatch('9', '[![:alpha:]]'));
  });

  it('should create the equivalent regex character classes for POSIX expressions:', function() {
    assert.equal(brackets('foo[[:lower:]]bar').output, 'foo[a-z]bar');
    assert.equal(brackets('foo[[:lower:][:upper:]]bar').output, 'foo[a-zA-Z]bar');
    assert.equal(brackets('[[:alpha:]123]').output, '[a-zA-Z123]');
    assert.equal(brackets('[[:lower:]]').output, '[a-z]');
    assert.equal(brackets('[![:lower:]]').output, '[^a-z]');
    assert.equal(brackets('[[:digit:][:upper:][:space:]]').output, '[0-9A-Z \\t\\r\\n\\v\\f]+');
    assert.equal(brackets('[[:xdigit:]]').output, '[A-Fa-f0-9]');
    assert.equal(brackets('[[:alnum:][:alpha:][:blank:][:cntrl:][:digit:][:graph:][:lower:][:print:][:punct:][:space:][:upper:][:xdigit:]]').output, '[a-zA-Z0-9a-zA-Z \\t\\x00-\\x1F\\x7F0-9\\x21-\\x7Ea-z\\x20-\\x7E\\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~ \\t\\r\\n\\v\\fA-ZA-Fa-f0-9]+');
    assert.equal(brackets('[^[:alnum:][:alpha:][:blank:][:cntrl:][:digit:][:lower:][:space:][:upper:][:xdigit:]]').output, '[^a-zA-Z0-9a-zA-Z \\t\\x00-\\x1F\\x7F0-9a-z \\t\\r\\n\\v\\fA-ZA-Fa-f0-9]+');
    assert.equal(brackets('[a-c[:digit:]x-z]').output, '[a-c0-9x-z]');
  });

  it('should support regex character classes:', function() {
    var arr = ['a c', 'a1c', 'a123c', 'a.c', 'a.xy.zc', 'a.zc', 'abbbbc', 'abbbc', 'abbc', 'abc', 'abq', 'axy zc', 'axy', 'axy.zc', 'axyzc'];
    match(arr, 'a[a-z]+c', ['abbbbc', 'abbbc', 'abbc', 'abc', 'axyzc'], 'Should match word characters');
    match(['abc', 'abd'], 'a[bc]d', ['abd'], 'Should match character classes');
    match(['abc', 'abd', 'ace', 'ac', 'a-'], 'a[b-d]e', ['ace'], 'Should match character class alphabetical ranges');
    match(['abc', 'abd', 'ace', 'ac', 'a-'], 'a[b-d]', ['ac'], 'Should match character class alphabetical ranges');
    match(['abc', 'abd', 'ace', 'ac', 'a-'], 'a[-c]', ['a-', 'ac'], 'Should match character classes with leading dashes');
    match(['abc', 'abd', 'ace', 'ac', 'a-'], 'a[c-]', ['a-', 'ac'], 'Should match character classes with trailing dashes');
    match(['a]c', 'abd', 'ace', 'ac', 'a-'], 'a[]]c', ['a]c'], 'Should match bracket literals in character classes');
    match(['a]', 'abd', 'ace', 'ac', 'a-'], 'a]', ['a]'], 'Should match bracket literals');
    match(['a]', 'acd', 'aed', 'ac', 'a-'], 'a[^bc]d', ['aed'], 'Should negation patterns in character classes');
    match(['adc', 'a-c'], 'a[^-b]c', ['adc'], 'Should match negated dashes in character classes');
    match(['adc', 'a]c'], 'a[^]b]c', ['adc'], 'Should match negated brackets in character classes');
    match(['01234', '0123e456', '0123e45g78'], '[\\de]+', ['01234', '0123e456'], 'Should match alpha-numeric characters in character classes');
    match(['01234', '0123e456', '0123e45g78'], '[\\de]*', ['01234', '0123e456'], 'Should match alpha-numeric characters in character classes');
    match(['01234', '0123e456', '0123e45g78'], '[e\\d]+', ['01234', '0123e456'], 'Should match alpha-numeric characters in character classes');
  });

  it('should not create an invalid posix character class:', function() {
    assert.equal(matcher('[:al:]').output, '[al]');
    assert.equal(matcher('[abc[:punct:][0-9]').output, '[abc\\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~[0-9]');
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
    assert(isMatch('a', '[:al:]'));
    assert(isMatch('a', '[[:al:]'));
    assert(isMatch('!', '[abc[:punct:][0-9]'));
  });

  it('should match the start of a valid sh identifier', function() {
    assert(isMatch('PATH', '[_[:alpha:]]*'));
  });

  it('should match the first two characters of a valid sh identifier', function() {
    assert(isMatch('PATH', '[_[:alpha:]][_[:alnum:]]*'));
  });

  it('how about A?', function() {
    assert(isMatch('9', '[[:digit:]]'));
    assert(!isMatch('X', '[[:digit:]]'));
    assert(isMatch('aB', '[[:lower:]][[:upper:]]'));
    assert.equal(brackets('[_[:alpha:]][_[:alnum:]][_[:alnum:]]*').output, '[_a-zA-Z][_a-zA-Z0-9][_a-zA-Z0-9]*?');
    assert(isMatch('a3', '[[:alpha:][:digit:]]'));
    assert(!isMatch('a', '[[:alpha:]\\]'));
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
