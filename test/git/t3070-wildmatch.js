/**
 * Tests based on tests from https://github.com/vmeurisse/wildmatch,
 * which were extracted from the `github.com/git/git` repository
 * Version used for import:
 *   https://github.com/git/git/blob/70a8fc999d9f0afbc793b21bbb911ecde4e24367/t/t3070-wildmatch.sh
 */

var assert = require('assert');
var wildmatch = require('../..');

var makeTest = {
  makeTest: function(name, text, pattern, options, nomatch) {
    test(name + ' <' + text + '> <' + pattern + '>', function() {

      var res = wildmatch(text, pattern, options);
      assert.equal(res, !nomatch, 'Expected ' + (nomatch ? 'no ' : '') + 'match, got ' + res);

      var flags = 0;
      if (options && options.pathname) flags = flags | wildmatch.WM_PATHNAME;
      if (options && options.case === false) flags = flags | wildmatch.WM_CASEFOLD;
      res = wildmatch.c(pattern, text, flags);
      assert.equal(!res, !nomatch, '<C interface> Expected ' + (nomatch ? 'no ' : '') + 'match, got ' + res);
    });
  },
  match: function(text, pattern) {
    makeTest.makeTest('match', text, pattern, { pathname: true });
  },
  nomatch: function(text, pattern) {
    makeTest.makeTest('nomatch', text, pattern, { pathname: true }, true);
  },
  pathmatch: function(text, pattern) {
    makeTest.makeTest('pathmatch', text, pattern);
  },
  nopathmatch: function(text, pattern) {
    makeTest.makeTest('nopathmatch', text, pattern, null, true);
  },
  imatch: function(text, pattern) {
    makeTest.makeTest('imatch', text, pattern, { case: false, pathname: true });
  },
  noimatch: function(text, pattern) {
    makeTest.makeTest('noimatch', text, pattern, { case: false, pathname: true }, true);
  },
};

describe('original wildmatch', function() {

  it('Basic wildmat features', function() {
    makeTest.match('foo', 'foo');
    makeTest.nomatch('foo', 'bar');
    makeTest.match('', '');
    makeTest.match('foo', '???');
    makeTest.nomatch('foo', '??');
    makeTest.match('foo', '*');
    makeTest.match('foo', 'f*');
    makeTest.nomatch('foo', '*f');
    makeTest.match('foo', '*foo*');
    makeTest.match('foobar', '*ob*a*r*');
    makeTest.match('aaaaaaabababab', '*ab');
    makeTest.match('foo*', 'foo\\*');
    makeTest.nomatch('foobar', 'foo\\*bar');
    makeTest.match('f\\oo', 'f\\\\oo');
    makeTest.match('ball', '*[al]?');
    makeTest.nomatch('ten', '[ten]');
    makeTest.nomatch('ten', '**[!te]');
    makeTest.nomatch('ten', '**[!ten]');
    makeTest.match('ten', 't[a-g]n');
    makeTest.nomatch('ten', 't[!a-g]n');
    makeTest.match('ton', 't[!a-g]n');
    makeTest.match('ton', 't[^a-g]n');
    makeTest.match('a]b', 'a[]]b');
    makeTest.match('a-b', 'a[]-]b');
    makeTest.match('a]b', 'a[]-]b');
    makeTest.nomatch('aab', 'a[]-]b');
    makeTest.match('aab', 'a[]a-]b');
    makeTest.match(']', ']');
  });

  it('Extended slash-matching features', function() {
    makeTest.nomatch('foo/baz/bar', 'foo*bar');
    makeTest.nomatch('foo/baz/bar', 'foo**bar');
    makeTest.nomatch('foobazbar', 'foo**bar');
    makeTest.match('foo/baz/bar', 'foo/**/bar');
    makeTest.match('foo/baz/bar', 'foo/**/**/bar');
    makeTest.match('foo/b/a/z/bar', 'foo/**/bar');
    makeTest.match('foo/b/a/z/bar', 'foo/**/**/bar');
    makeTest.match('foo/bar', 'foo/**/bar');
    makeTest.match('foo/bar', 'foo/**/**/bar');
    makeTest.nomatch('foo/bar', 'foo?bar');
    makeTest.nomatch('foo/bar', 'foo[/]bar');
    makeTest.nomatch('foo/bar', 'f[^eiu][^eiu][^eiu][^eiu][^eiu]r');
    makeTest.match('foo-bar', 'f[^eiu][^eiu][^eiu][^eiu][^eiu]r');
    makeTest.match('foo', '**/foo');
    makeTest.match('XXX/foo', '**/foo');
    makeTest.match('bar/baz/foo', '**/foo');
    makeTest.nomatch('bar/baz/foo', '*/foo');
    makeTest.nomatch('foo/bar/baz', '**/bar*');
    makeTest.match('deep/foo/bar/baz', '**/bar/*');
    makeTest.nomatch('deep/foo/bar/baz/', '**/bar/*');
    makeTest.match('deep/foo/bar/baz/', '**/bar/**');
    makeTest.nomatch('deep/foo/bar', '**/bar/*');
    makeTest.match('deep/foo/bar/', '**/bar/**');
    makeTest.nomatch('foo/bar/baz', '**/bar**');
    makeTest.match('foo/bar/baz/x', '*/bar/**');
    makeTest.nomatch('deep/foo/bar/baz/x', '*/bar/**');
    makeTest.match('deep/foo/bar/baz/x', '**/bar/*/*');
  });

  it('Various additional tests', function() {
    makeTest.nomatch('acrt', 'a[c-c]st');
    makeTest.match('acrt', 'a[c-c]rt');
    makeTest.nomatch(']', '[!]-]');
    makeTest.match('a', '[!]-]');
    makeTest.nomatch('', '\\');
    makeTest.nomatch('\\', '\\');
    makeTest.nomatch('XXX/\\', '*/\\');
    makeTest.match('XXX/\\', '*/\\\\');
    makeTest.match('foo', 'foo');
    makeTest.match('@foo', '@foo');
    makeTest.nomatch('foo', '@foo');
    makeTest.match('[ab]', '\\[ab]');
    makeTest.match('[ab]', '[[]ab]');
    makeTest.match('[ab]', '[[:]ab]');
    makeTest.nomatch('[ab]', '[[::]ab]');
    makeTest.match('[ab]', '[[:digit]ab]');
    makeTest.match('[ab]', '[\\[:]ab]');
    makeTest.match('?a?b', '\\??\\?b');
    makeTest.match('abc', '\\a\\b\\c');
    makeTest.nomatch('foo', '');
    makeTest.match('foo/bar/baz/to', '**/t[o]');
  });

  it('Character class tests', function() {
    makeTest.match('a1B', '[[:alpha:]][[:digit:]][[:upper:]]');
    makeTest.nomatch('a', '[[:digit:][:upper:][:space:]]');
    makeTest.match('A', '[[:digit:][:upper:][:space:]]');
    makeTest.match('1', '[[:digit:][:upper:][:space:]]');
    makeTest.nomatch('1', '[[:digit:][:upper:][:spaci:]]');
    makeTest.match(' ', '[[:digit:][:upper:][:space:]]');
    makeTest.nomatch('.', '[[:digit:][:upper:][:space:]]');
    makeTest.match('.', '[[:digit:][:punct:][:space:]]');
    makeTest.match('5', '[[:xdigit:]]');
    makeTest.match('f', '[[:xdigit:]]');
    makeTest.match('D', '[[:xdigit:]]');
    makeTest.match('_', '[[:alnum:][:alpha:][:blank:][:cntrl:][:digit:][:graph:][:lower:][:print:][:punct:][:space:][:upper:][:xdigit:]]');
    makeTest.match('_', '[[:alnum:][:alpha:][:blank:][:cntrl:][:digit:][:graph:][:lower:][:print:][:punct:][:space:][:upper:][:xdigit:]]');
    makeTest.match('.', '[^[:alnum:][:alpha:][:blank:][:cntrl:][:digit:][:lower:][:space:][:upper:][:xdigit:]]');
    makeTest.match('5', '[a-c[:digit:]x-z]');
    makeTest.match('b', '[a-c[:digit:]x-z]');
    makeTest.match('y', '[a-c[:digit:]x-z]');
    makeTest.nomatch('q', '[a-c[:digit:]x-z]');
  });

  it('Additional tests, including some malformed wildmats', function() {
    makeTest.match(']', '[\\\\-^]');
    makeTest.nomatch('[', '[\\\\-^]');
    makeTest.match('-', '[\\-_]');
    makeTest.match(']', '[\\]]');
    makeTest.nomatch('\\]', '[\\]]');
    makeTest.nomatch('\\', '[\\]]');
    makeTest.nomatch('ab', 'a[]b');
    makeTest.nomatch('a[]b', 'a[]b');
    makeTest.nomatch('ab[', 'ab[');
    makeTest.nomatch('ab', '[!');
    makeTest.nomatch('ab', '[-');
    makeTest.match('-', '[-]');
    makeTest.nomatch('-', '[a-');
    makeTest.nomatch('-', '[!a-');
    makeTest.match('-', '[--A]');
    makeTest.match('5', '[--A]');
    makeTest.match(' ', '[ --]');
    makeTest.match('$', '[ --]');
    makeTest.match('-', '[ --]');
    makeTest.nomatch('0', '[ --]');
    makeTest.match('-', '[---]');
    makeTest.match('-', '[------]');
    makeTest.nomatch('j', '[a-e-n]');
    makeTest.match('-', '[a-e-n]');
    makeTest.match('a', '[!------]');
    makeTest.nomatch('[', '[]-a]');
    makeTest.match('^', '[]-a]');
    makeTest.nomatch('^', '[!]-a]');
    makeTest.match('[', '[!]-a]');
    makeTest.match('^', '[a^bc]');
    makeTest.match('-b]', '[a-]b]');
    makeTest.nomatch('\\', '[\\]');
    makeTest.match('\\', '[\\\\]');
    makeTest.nomatch('\\', '[!\\\\]');
    makeTest.match('G', '[A-\\\\]');
    makeTest.nomatch('aaabbb', 'b*a');
    makeTest.nomatch('aabcaa', '*ba*');
    makeTest.match(',', '[,]');
    makeTest.match(',', '[\\\\,]');
    makeTest.match('\\', '[\\\\,]');
    makeTest.match('-', '[,-.]');
    makeTest.nomatch('+', '[,-.]');
    makeTest.nomatch('-.]', '[,-.]');
    makeTest.match('2', '[\\1-\\3]');
    makeTest.match('3', '[\\1-\\3]');
    makeTest.nomatch('4', '[\\1-\\3]');
    makeTest.match('\\', '[[-\\]]');
    makeTest.match('[', '[[-\\]]');
    makeTest.match(']', '[[-\\]]');
    makeTest.nomatch('-', '[[-\\]]');
  });

  it('Test recursion and the abort code', function() {
    makeTest.match('-adobe-courier-bold-o-normal--12-120-75-75-m-70-iso8859-1', '-*-*-*-*-*-*-12-*-*-*-m-*-*-*');
    makeTest.nomatch('-adobe-courier-bold-o-normal--12-120-75-75-X-70-iso8859-1', '-*-*-*-*-*-*-12-*-*-*-m-*-*-*');
    makeTest.nomatch('-adobe-courier-bold-o-normal--12-120-75-75-/-70-iso8859-1', '-*-*-*-*-*-*-12-*-*-*-m-*-*-*');
    makeTest.match('XXX/adobe/courier/bold/o/normal//12/120/75/75/m/70/iso8859/1', 'XXX/*/*/*/*/*/*/12/*/*/*/m/*/*/*');
    makeTest.nomatch('XXX/adobe/courier/bold/o/normal//12/120/75/75/X/70/iso8859/1', 'XXX/*/*/*/*/*/*/12/*/*/*/m/*/*/*');
    makeTest.match('abcd/abcdefg/abcdefghijk/abcdefghijklmnop.txt', '**/*a*b*g*n*t');
    makeTest.nomatch('abcd/abcdefg/abcdefghijk/abcdefghijklmnop.txtz', '**/*a*b*g*n*t');
    makeTest.nomatch('foo', '*/*/*');
    makeTest.nomatch('foo/bar', '*/*/*');
    makeTest.match('foo/bba/arr', '*/*/*');
    makeTest.nomatch('foo/bb/aa/rr', '*/*/*');
    makeTest.match('foo/bb/aa/rr', '**/**/**');
    makeTest.match('abcXdefXghi', '*X*i');
    makeTest.nomatch('ab/cXd/efXg/hi', '*X*i');
    makeTest.match('ab/cXd/efXg/hi', '*/*X*/*/*i');
    makeTest.match('ab/cXd/efXg/hi', '**/*X*/**/*i');
  });

  it('Test pathName option', function() {
    makeTest.pathmatch('foo', 'foo');
    makeTest.nopathmatch('foo', 'fo');
    makeTest.pathmatch('foo/bar', 'foo/bar');
    makeTest.pathmatch('foo/bar', 'foo/*');
    makeTest.pathmatch('foo/bba/arr', 'foo/*');
    makeTest.pathmatch('foo/bba/arr', 'foo/**');
    makeTest.pathmatch('foo/bba/arr', 'foo*');
    makeTest.pathmatch('foo/bba/arr', 'foo**');
    makeTest.pathmatch('foo/bba/arr', 'foo/*arr');
    makeTest.pathmatch('foo/bba/arr', 'foo/**arr');
    makeTest.nopathmatch('foo/bba/arr', 'foo/*z');
    makeTest.nopathmatch('foo/bba/arr', 'foo/**z');
    makeTest.pathmatch('foo/bar', 'foo?bar');
    makeTest.pathmatch('foo/bar', 'foo[/]bar');
    makeTest.nopathmatch('foo', '*/*/*');
    makeTest.nopathmatch('foo/bar', '*/*/*');
    makeTest.pathmatch('foo/bba/arr', '*/*/*');
    makeTest.pathmatch('foo/bb/aa/rr', '*/*/*');
    makeTest.pathmatch('abcXdefXghi', '*X*i');
    makeTest.pathmatch('ab/cXd/efXg/hi', '*/*X*/*/*i');
    makeTest.pathmatch('ab/cXd/efXg/hi', '*Xg*i');
  });

  it('Case-sensitivy features', function() {
    makeTest.nomatch('a', '[A-Z]');
    makeTest.match('A', '[A-Z]');
    makeTest.nomatch('A', '[a-z]');
    makeTest.match('a', '[a-z]');
    makeTest.nomatch('a', '[[:upper:]]');
    makeTest.match('A', '[[:upper:]]');
    makeTest.nomatch('A', '[[:lower:]]');
    makeTest.match('a', '[[:lower:]]');
    makeTest.nomatch('A', '[B-Za]');
    makeTest.match('a', '[B-Za]');
    makeTest.nomatch('A', '[B-a]');
    makeTest.match('a', '[B-a]');
    makeTest.nomatch('z', '[Z-y]');
    makeTest.match('Z', '[Z-y]');

    makeTest.imatch('a', '[A-Z]');
    makeTest.imatch('A', '[A-Z]');
    makeTest.imatch('A', '[a-z]');
    makeTest.imatch('a', '[a-z]');
    makeTest.imatch('a', '[[:upper:]]');
    makeTest.imatch('A', '[[:upper:]]');
    makeTest.imatch('A', '[[:lower:]]');
    makeTest.imatch('a', '[[:lower:]]');
    makeTest.imatch('A', '[B-Za]');
    makeTest.imatch('a', '[B-Za]');
    makeTest.imatch('A', '[B-a]');
    makeTest.imatch('a', '[B-a]');
    makeTest.imatch('z', '[Z-y]');
    makeTest.imatch('Z', '[Z-y]');
  });

  it('Additional tests not found in the original wildmatch', function() {
    makeTest.match('-', '[[:space:]-\\]]');
    makeTest.match('c', '[]-z]');
    makeTest.nomatch('-', '[]-z]');
    makeTest.nomatch('c', '[[:space:]-z]');
  });
});
