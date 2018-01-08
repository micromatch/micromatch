'use strict';

var assert = require('assert');
var mm = require('./support/match');

function create(pattern, options) {
  return mm.create(pattern, options).map(function(obj) {
    return obj.output.replace('(?:(?:\\.(?:\\/|\\\\))(?=.))?', '');
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
      assert.equal(create('[_[:alpha:]][_[:alnum:]][_[:alnum:]]*', {bash: false}), '[_a-zA-Z][_a-zA-Z0-9][_a-zA-Z0-9]*?(?:(?:\\/|\\\\)|$)', []);
      assert.equal(create('[_[:alpha:]][_[:alnum:]][_[:alnum:]]*'), '[_a-zA-Z][_a-zA-Z0-9][_a-zA-Z0-9][^/]*?(?:(?:\\/|\\\\)|$)', []);
    });
  });

  describe('.match', function() {
    it('should support POSIX.2 character classes', function() {
      mm(['e'], '[[:xdigit:]]', [ 'e' ]);
      mm(['a', '1', '5', 'A'], '[[:alpha:]123]', [ '1', 'a', 'A' ]);
      mm(['9', 'A', 'b'], '[![:alpha:]]', ['9']);
      mm(['9', 'A', 'b'], '[^[:alpha:]]', ['9']);
      mm(['9', 'a', 'B'], '[[:digit:]]', ['9']);
      mm(['a', 'b', 'A'], '[:alpha:]', ['a'], 'not a valid posix bracket, but valid char class');
      mm(['a', 'b', 'A'], '[[:alpha:]]', [ 'a', 'A', 'b' ]);
      mm(['a', 'aa', 'aB', 'a7'], '[[:lower:][:lower:]]', ['a']);
      mm(['a', '7', 'aa', 'aB', 'a7'], '[[:lower:][:digit:]]', [ '7', 'a' ]);
    });

    it('should match word characters', function() {
      var fixtures = ['a c', 'a1c', 'a123c', 'a.c', 'a.xy.zc', 'a.zc', 'abbbbc', 'abbbc', 'abbc', 'abc', 'abq', 'axy zc', 'axy', 'axy.zc', 'axyzc'];
      mm(fixtures, 'a[a-z]+c', ['abbbbc', 'abbbc', 'abbc', 'abc', 'axyzc']);
    });

    it('should match literal brackets', function() {
      mm(['a [b]'], 'a \\[b\\]', ['a [b]']);
      mm(['a [b] c'], 'a [b] c', ['a [b] c']);
      mm(['a [b]'], 'a \\[b\\]*', ['a [b]']);
      mm(['a [bc]'], 'a \\[bc\\]*', ['a [bc]']);
      mm(['a [b]', 'a [b].js'], 'a \\[b\\].*', ['a [b].js']);
    });

    it('should match character classes', function() {
      mm(['abc', 'abd'], 'a[bc]d', ['abd']);
    });

    it('should match character class alphabetical ranges', function() {
      mm(['abc', 'abd', 'ace', 'ac', 'a-'], 'a[b-d]e', ['ace']);
      mm(['abc', 'abd', 'ace', 'ac', 'a-'], 'a[b-d]', ['ac']);
    });

    it('should match character classes with leading dashes', function() {
      mm(['abc', 'abd', 'ace', 'ac', 'a-'], 'a[-c]', ['a-', 'ac']);
    });

    it('should match character classes with trailing dashes', function() {
      mm(['abc', 'abd', 'ace', 'ac', 'a-'], 'a[c-]', ['a-', 'ac']);
    });

    it('should match bracket literals', function() {
      mm(['a]c', 'abd', 'ace', 'ac', 'a-'], 'a[]]c', ['a]c']);
    });

    it('should match bracket literals', function() {
      mm(['a]', 'abd', 'ace', 'ac', 'a-'], 'a]', ['a]']);
    });

    it('should negation patterns', function() {
      mm(['a]', 'acd', 'aed', 'ac', 'a-'], 'a[^bc]d', ['aed']);
    });

    it('should match negated dashes', function() {
      mm(['adc', 'a-c'], 'a[^-b]c', ['adc']);
    });

    it('should match negated brackets', function() {
      mm(['adc', 'a]c'], 'a[^]b]c', ['adc']);
    });

    it('should match alpha-numeric characters', function() {
      mm(['01234', '0123e456', '0123e45g78'], '[\\de]+', ['01234', '0123e456']);
      mm(['01234', '0123e456', '0123e45g78'], '[\\de]*', ['01234', '0123e456'], {bash: false});
      mm(['01234', '0123e456', '0123e45g78'], '[\\de]*', ['01234', '0123e456', '0123e45g78']);
      mm(['01234', '0123e456', '0123e45g78'], '[e\\d]+', ['01234', '0123e456']);
    });

    it('should not create an invalid posix character class:', function() {
      assert.equal(create('[:al:]'), '[:al:]');
      assert.equal(create('[abc[:punct:][0-9]'), '[abc\\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~\\[0-9]');
    });

    it('should return `true` when the pattern matches:', function() {
      assert(mm.isMatch('a', '[[:lower:]]'));
      assert(mm.isMatch('A', '[[:upper:]]'));
      assert(mm.isMatch('A', '[[:digit:][:upper:][:space:]]'));
      assert(mm.isMatch('1', '[[:digit:][:upper:][:space:]]'));
      assert(mm.isMatch(' ', '[[:digit:][:upper:][:space:]]'));
      assert(mm.isMatch('5', '[[:xdigit:]]'));
      assert(mm.isMatch('f', '[[:xdigit:]]'));
      assert(mm.isMatch('D', '[[:xdigit:]]'));
      assert(mm.isMatch('_', '[[:alnum:][:alpha:][:blank:][:cntrl:][:digit:][:graph:][:lower:][:print:][:punct:][:space:][:upper:][:xdigit:]]'));
      assert(mm.isMatch('_', '[[:alnum:][:alpha:][:blank:][:cntrl:][:digit:][:graph:][:lower:][:print:][:punct:][:space:][:upper:][:xdigit:]]'));
      assert(mm.isMatch('.', '[^[:alnum:][:alpha:][:blank:][:cntrl:][:digit:][:lower:][:space:][:upper:][:xdigit:]]'));
      assert(mm.isMatch('5', '[a-c[:digit:]x-z]'));
      assert(mm.isMatch('b', '[a-c[:digit:]x-z]'));
      assert(mm.isMatch('y', '[a-c[:digit:]x-z]'));
    });

    it('should return `false` when the pattern does not match:', function() {
      assert(!mm.isMatch('A', '[[:lower:]]'));
      assert(mm.isMatch('A', '[![:lower:]]'));
      assert(!mm.isMatch('a', '[[:upper:]]'));
      assert(!mm.isMatch('a', '[[:digit:][:upper:][:space:]]'));
      assert(!mm.isMatch('.', '[[:digit:][:upper:][:space:]]'));
      assert(!mm.isMatch('.', '[[:alnum:][:alpha:][:blank:][:cntrl:][:digit:][:lower:][:space:][:upper:][:xdigit:]]'));
      assert(!mm.isMatch('q', '[a-c[:digit:]x-z]'));
    });
  });

  describe('.makeRe()', function() {
    it('should make a regular expression for the given pattern:', function() {
      assert.deepEqual(mm.makeRe('[[:alpha:]123]'), /^(?:(?:(?:\.(?:\/|\\))(?=.))?[a-zA-Z123])$/);
      assert.deepEqual(mm.makeRe('[![:lower:]]'), /^(?:(?:(?:\.(?:\/|\\))(?=.))?[^a-z])$/);
    });
  });

  describe('.mm()', function() {
    it('should return an array of matching strings:', function() {
      mm(['a1B', 'a1b'], '[[:alpha:]][[:digit:]][[:upper:]]', ['a1B']);
      mm(['.', 'a', '!'], '[[:digit:][:punct:][:space:]]', ['.', '!']);
    });
  });

  describe('POSIX: From the test suite for the POSIX.2 (BRE) pattern matching code:', function() {
    it('First, test POSIX.2 character classes', function() {
      assert(mm.isMatch('e', '[[:xdigit:]]'));
      assert(mm.isMatch('1', '[[:xdigit:]]'));
      assert(mm.isMatch('a', '[[:alpha:]123]'));
      assert(mm.isMatch('1', '[[:alpha:]123]'));
    });

    it('should match using POSIX.2 negation patterns', function() {
      assert(mm.isMatch('9', '[![:alpha:]]'));
      assert(mm.isMatch('9', '[^[:alpha:]]'));
    });

    it('should match word characters', function() {
      assert(mm.isMatch('A', '[[:word:]]'));
      assert(mm.isMatch('B', '[[:word:]]'));
      assert(mm.isMatch('a', '[[:word:]]'));
      assert(mm.isMatch('b', '[[:word:]]'));
    });

    it('should match digits with word class', function() {
      assert(mm.isMatch('1', '[[:word:]]'));
      assert(mm.isMatch('2', '[[:word:]]'));
    });

    it('should not digits', function() {
      assert(mm.isMatch('1', '[[:digit:]]'));
      assert(mm.isMatch('2', '[[:digit:]]'));
    });

    it('should not match word characters with digit class', function() {
      assert(!mm.isMatch('a', '[[:digit:]]'));
      assert(!mm.isMatch('A', '[[:digit:]]'));
    });

    it('should match uppercase alpha characters', function() {
      assert(mm.isMatch('A', '[[:upper:]]'));
      assert(mm.isMatch('B', '[[:upper:]]'));
    });

    it('should not match lowercase alpha characters', function() {
      assert(!mm.isMatch('a', '[[:upper:]]'));
      assert(!mm.isMatch('b', '[[:upper:]]'));
    });

    it('should not match digits with upper class', function() {
      assert(!mm.isMatch('1', '[[:upper:]]'));
      assert(!mm.isMatch('2', '[[:upper:]]'));
    });

    it('should match lowercase alpha characters', function() {
      assert(mm.isMatch('a', '[[:lower:]]'));
      assert(mm.isMatch('b', '[[:lower:]]'));
    });

    it('should not match uppercase alpha characters', function() {
      assert(!mm.isMatch('A', '[[:lower:]]'));
      assert(!mm.isMatch('B', '[[:lower:]]'));
    });

    it('should match one lower and one upper character', function() {
      assert(mm.isMatch('aA', '[[:lower:]][[:upper:]]'));
      assert(!mm.isMatch('AA', '[[:lower:]][[:upper:]]'));
      assert(!mm.isMatch('Aa', '[[:lower:]][[:upper:]]'));
    });

    it('should match hexidecimal digits', function() {
      assert(mm.isMatch('ababab', '[[:xdigit:]]*'));
      assert(mm.isMatch('020202', '[[:xdigit:]]*'));
      assert(mm.isMatch('900', '[[:xdigit:]]*'));
    });

    it('should match punctuation characters (\\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~)', function() {
      assert(mm.isMatch('!', '[[:punct:]]'));
      assert(mm.isMatch('?', '[[:punct:]]'));
      assert(mm.isMatch('#', '[[:punct:]]'));
      assert(mm.isMatch('&', '[[:punct:]]'));
      assert(mm.isMatch('@', '[[:punct:]]'));
      assert(mm.isMatch('+', '[[:punct:]]'));
      assert(mm.isMatch('*', '[[:punct:]]'));
      assert(mm.isMatch(':', '[[:punct:]]'));
      assert(mm.isMatch('=', '[[:punct:]]'));
      assert(mm.isMatch('|', '[[:punct:]]'));
      assert(mm.isMatch('|++', '[[:punct:]]*'));
    });

    it('should only match one character', function() {
      assert(!mm.isMatch('?*+', '[[:punct:]]'));
    });

    it('should only match one or more characters', function() {
      assert(mm.isMatch('?*+', '[[:punct:]]*'));
      assert(mm.isMatch('*', '[[:punct:]]*'));
      assert(mm.isMatch('+', '[[:punct:]]*'));
      assert(mm.isMatch('?', '[[:punct:]]*'));
      assert(mm.isMatch('?abc', '[[:punct:]]*'));
      assert(mm.isMatch('*abc', '[[:punct:]]*'));
      assert(mm.isMatch('+abc', '[[:punct:]]*'));
      assert(!mm.isMatch('abc+abc', '[[:punct:]]*'));
      assert(!mm.isMatch('', '[[:punct:]]*'));
    });

    it('invalid character class expressions are just characters to be matched', function() {
      mm(['a'], '[:al:]', ['a']);
      mm(['a'], '[[:al:]', ['a']);
      mm(['!'], '[abc[:punct:][0-9]', ['!']);
    });

    it('should match the start of a valid sh identifier', function() {
      assert(mm.isMatch('PATH', '[_[:alpha:]]*'));
    });

    it('should match the first two characters of a valid sh identifier', function() {
      assert(mm.isMatch('PATH', '[_[:alpha:]][_[:alnum:]]*'));
    });

    /**
     * Some of these tests (and their descriptions) were ported directly
     * from the Bash 4.3 unit tests.
     */

    it('how about A?', function() {
      mm(['9'], '[[:digit:]]', ['9']);
      mm(['X'], '[[:digit:]]', []);
      mm(['aB'], '[[:lower:]][[:upper:]]', ['aB']);
      mm(['a', '3', 'aa', 'a3', 'abc'], '[[:alpha:][:digit:]]', ['3', 'a']);
      mm(['a', 'b'], '[[:alpha:]\\]', [], []);
    });

    it('OK, what\'s a tab?  is it a blank? a space?', function() {
      assert(mm.isMatch('\t', '[[:blank:]]'));
      assert(mm.isMatch('\t', '[[:space:]]'));
      assert(mm.isMatch(' ', '[[:space:]]'));
    });

    it('let\'s check out characters in the ASCII range', function() {
      assert(!mm.isMatch('\\377', '[[:ascii:]]'));
      assert(!mm.isMatch('9', '[1[:alpha:]123]'));
    });

    it('punctuation', function() {
      assert(!mm.isMatch(' ', '[[:punct:]]'));
    });

    it('graph', function() {
      assert(mm.isMatch('A', '[[:graph:]]'));
      assert(!mm.isMatch('\b', '[[:graph:]]'));
      assert(!mm.isMatch('\n', '[[:graph:]]'));
      assert(mm.isMatch('\s', '[[:graph:]]'));
    });
  });
});

