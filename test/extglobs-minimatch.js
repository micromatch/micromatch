'use strict';

require('mocha');
const path = require('path');
const assert = require('assert');
const { isMatch, makeRe } = require('..');

if (!process.env.ORIGINAL_PATH_SEP) {
  process.env.ORIGINAL_PATH_SEP = path.sep
}

/**
 * Some of tests were converted from bash 4.3, 4.4, and minimatch unit tests.
 */

describe('extglobs (minimatch)', () => {
  let setup = {
    before: () => (path.sep = '\\'),
    after: () => (path.sep = process.env.ORIGINAL_PATH_SEP)
  };

  afterEach(() => setup.after());
  beforeEach(() => setup.before());

  it('should not match empty string with "*(0|1|3|5|7|9)"', () => {
    assert(!isMatch('', '*(0|1|3|5|7|9)'));
  });

  it('"*(a|b[)" should not match "*(a|b\\[)"', () => {
    assert(!isMatch('*(a|b[)', '*(a|b\\[)'));
  });

  it('"*(a|b[)" should not match "\\*\\(a|b\\[\\)"', () => {
    assert(isMatch('*(a|b[)', '\\*\\(a\\|b\\[\\)'));
  });

  it('"***" should match "\\*\\*\\*"', () => {
    assert(isMatch('***', '\\*\\*\\*'));
  });

  it('"-adobe-courier-bold-o-normal--12-120-75-75-/-70-iso8859-1" should not match "-*-*-*-*-*-*-12-*-*-*-m-*-*-*"', () => {
    assert(!isMatch('-adobe-courier-bold-o-normal--12-120-75-75-/-70-iso8859-1', '-*-*-*-*-*-*-12-*-*-*-m-*-*-*'));
  });

  it('"-adobe-courier-bold-o-normal--12-120-75-75-m-70-iso8859-1" should match "-*-*-*-*-*-*-12-*-*-*-m-*-*-*"', () => {
    assert(isMatch('-adobe-courier-bold-o-normal--12-120-75-75-m-70-iso8859-1', '-*-*-*-*-*-*-12-*-*-*-m-*-*-*'));
  });

  it('"-adobe-courier-bold-o-normal--12-120-75-75-X-70-iso8859-1" should not match "-*-*-*-*-*-*-12-*-*-*-m-*-*-*"', () => {
    assert(!isMatch('-adobe-courier-bold-o-normal--12-120-75-75-X-70-iso8859-1', '-*-*-*-*-*-*-12-*-*-*-m-*-*-*'));
  });

  it('"/dev/udp/129.22.8.102/45" should not match "/dev\\/@(tcp|udp)\\/*\\/*"', () => {
    assert(isMatch('/dev/udp/129.22.8.102/45', '/dev\\/@(tcp|udp)\\/*\\/*'));
  });

  it('"/x/y/z" should match "/x/y/z"', () => {
    assert(isMatch('/x/y/z', '/x/y/z'));
  });

  it('"0377" should match "+([0-7])"', () => {
    assert(isMatch('0377', '+([0-7])'));
  });

  it('"07" should match "+([0-7])"', () => {
    assert(isMatch('07', '+([0-7])'));
  });

  it('"09" should not match "+([0-7])"', () => {
    assert(!isMatch('09', '+([0-7])'));
  });

  it('"1" should match "0|[1-9]*([0-9])"', () => {
    assert(isMatch('1', '0|[1-9]*([0-9])'));
  });

  it('"12" should match "0|[1-9]*([0-9])"', () => {
    assert(isMatch('12', '0|[1-9]*([0-9])'));
  });

  it('"123abc" should not match "(a+|b)*"', () => {
    assert(!isMatch('123abc', '(a+|b)*'));
  });

  it('"123abc" should not match "(a+|b)+"', () => {
    assert(!isMatch('123abc', '(a+|b)+'));
  });

  it('"123abc" should match "*?(a)bc"', () => {
    assert(isMatch('123abc', '*?(a)bc'));
  });

  it('"123abc" should not match "a(b*(foo|bar))d"', () => {
    assert(!isMatch('123abc', 'a(b*(foo|bar))d'));
  });

  it('"123abc" should not match "ab*(e|f)"', () => {
    assert(!isMatch('123abc', 'ab*(e|f)'));
  });

  it('"123abc" should not match "ab**"', () => {
    assert(!isMatch('123abc', 'ab**'));
  });

  it('"123abc" should not match "ab**(e|f)"', () => {
    assert(!isMatch('123abc', 'ab**(e|f)'));
  });

  it('"123abc" should not match "ab**(e|f)g"', () => {
    assert(!isMatch('123abc', 'ab**(e|f)g'));
  });

  it('"123abc" should not match "ab***ef"', () => {
    assert(!isMatch('123abc', 'ab***ef'));
  });

  it('"123abc" should not match "ab*+(e|f)"', () => {
    assert(!isMatch('123abc', 'ab*+(e|f)'));
  });

  it('"123abc" should not match "ab*d+(e|f)"', () => {
    assert(!isMatch('123abc', 'ab*d+(e|f)'));
  });

  it('"123abc" should not match "ab?*(e|f)"', () => {
    assert(!isMatch('123abc', 'ab?*(e|f)'));
  });

  it('"12abc" should not match "0|[1-9]*([0-9])"', () => {
    assert(!isMatch('12abc', '0|[1-9]*([0-9])'));
  });

  it('"137577991" should match "*(0|1|3|5|7|9)"', () => {
    assert(isMatch('137577991', '*(0|1|3|5|7|9)'));
  });

  it('"2468" should not match "*(0|1|3|5|7|9)"', () => {
    assert(!isMatch('2468', '*(0|1|3|5|7|9)'));
  });

  it('"?a?b" should match "\\??\\?b"', () => {
    assert(isMatch('?a?b', '\\??\\?b'));
  });

  it('"\\a\\b\\c" should not match "abc"', () => {
    assert(!isMatch('\\a\\b\\c', 'abc'));
  });

  it('"a" should match "!(*.a|*.b|*.c)"', () => {
    assert(isMatch('a', '!(*.a|*.b|*.c)'));
  });

  it('"a" should not match "!(a)"', () => {
    assert(!isMatch('a', '!(a)'));
  });

  it('"a" should not match "!(a)*"', () => {
    assert(!isMatch('a', '!(a)*'));
  });

  it('"a" should match "(a)"', () => {
    assert(isMatch('a', '(a)'));
  });

  it('"a" should not match "(b)"', () => {
    assert(!isMatch('a', '(b)'));
  });

  it('"a" should match "*(a)"', () => {
    assert(isMatch('a', '*(a)'));
  });

  it('"a" should match "+(a)"', () => {
    assert(isMatch('a', '+(a)'));
  });

  it('"a" should match "?"', () => {
    assert(isMatch('a', '?'));
  });

  it('"a" should match "?(a|b)"', () => {
    assert(isMatch('a', '?(a|b)'));
  });

  it('"a" should not match "??"', () => {
    assert(!isMatch('a', '??'));
  });

  it('"a" should match "a!(b)*"', () => {
    assert(isMatch('a', 'a!(b)*'));
  });

  it('"a" should match "a?(a|b)"', () => {
    assert(isMatch('a', 'a?(a|b)'));
  });

  it('"a" should match "a?(x)"', () => {
    assert(isMatch('a', 'a?(x)'));
  });

  it('"a" should not match "a??b"', () => {
    assert(!isMatch('a', 'a??b'));
  });

  it('"a" should not match "b?(a|b)"', () => {
    assert(!isMatch('a', 'b?(a|b)'));
  });

  it('"a((((b" should match "a(*b"', () => {
    assert(isMatch('a((((b', 'a(*b'));
  });

  it('"a((((b" should not match "a(b"', () => {
    assert(!isMatch('a((((b', 'a(b'));
  });

  it('"a((((b" should not match "a\\(b"', () => {
    assert(!isMatch('a((((b', 'a\\(b'));
  });

  it('"a((b" should match "a(*b"', () => {
    assert(isMatch('a((b', 'a(*b'));
  });

  it('"a((b" should not match "a(b"', () => {
    assert(!isMatch('a((b', 'a(b'));
  });

  it('"a((b" should not match "a\\(b"', () => {
    assert(!isMatch('a((b', 'a\\(b'));
  });

  it('"a(b" should match "a(*b"', () => {
    assert(isMatch('a(b', 'a(*b'));
  });

  it('"a(b" should match "a(b"', () => {
    assert(isMatch('a(b', 'a(b'));
  });

  it('"a(b" should match "a\\(b"', () => {
    assert(isMatch('a(b', 'a\\(b'));
  });

  it('"a." should match "!(*.a|*.b|*.c)"', () => {
    assert(isMatch('a.', '!(*.a|*.b|*.c)'));
  });

  it('"a." should match "*!(.a|.b|.c)"', () => {
    assert(isMatch('a.', '*!(.a|.b|.c)'));
  });

  it('"a." should match "*.!(a)"', () => {
    assert(isMatch('a.', '*.!(a)'));
  });

  it('"a." should match "*.!(a|b|c)"', () => {
    assert(isMatch('a.', '*.!(a|b|c)'));
  });

  it('"a." should not match "*.(a|b|@(ab|a*@(b))*(c)d)"', () => {
    assert(!isMatch('a.', '*.(a|b|@(ab|a*@(b))*(c)d)'));
  });

  it('"a." should not match "*.+(b|d)"', () => {
    assert(!isMatch('a.', '*.+(b|d)'));
  });

  it('"a.a" should not match "!(*.[a-b]*)"', () => {
    assert(!isMatch('a.a', '!(*.[a-b]*)'));
  });

  it('"a.a" should not match "!(*.a|*.b|*.c)"', () => {
    assert(!isMatch('a.a', '!(*.a|*.b|*.c)'));
  });

  it('"a.a" should not match "!(*[a-b].[a-b]*)"', () => {
    assert(!isMatch('a.a', '!(*[a-b].[a-b]*)'));
  });

  it('"a.a" should not match "!*.(a|b)"', () => {
    assert(!isMatch('a.a', '!*.(a|b)'));
  });

  it('"a.a" should not match "!*.(a|b)*"', () => {
    assert(!isMatch('a.a', '!*.(a|b)*'));
  });

  it('"a.a" should match "(a|d).(a|b)*"', () => {
    assert(isMatch('a.a', '(a|d).(a|b)*'));
  });

  it('"a.a" should match "(b|a).(a)"', () => {
    assert(isMatch('a.a', '(b|a).(a)'));
  });

  it('"a.a" should match "*!(.a|.b|.c)"', () => {
    assert(isMatch('a.a', '*!(.a|.b|.c)'));
  });

  it('"a.a" should not match "*.!(a)"', () => {
    assert(!isMatch('a.a', '*.!(a)'));
  });

  it('"a.a" should not match "*.!(a|b|c)"', () => {
    assert(!isMatch('a.a', '*.!(a|b|c)'));
  });

  it('"a.a" should match "*.(a|b|@(ab|a*@(b))*(c)d)"', () => {
    assert(isMatch('a.a', '*.(a|b|@(ab|a*@(b))*(c)d)'));
  });

  it('"a.a" should not match "*.+(b|d)"', () => {
    assert(!isMatch('a.a', '*.+(b|d)'));
  });

  it('"a.a" should match "@(b|a).@(a)"', () => {
    assert(isMatch('a.a', '@(b|a).@(a)'));
  });

  it('"a.a.a" should not match "!(*.[a-b]*)"', () => {
    assert(!isMatch('a.a.a', '!(*.[a-b]*)'));
  });

  it('"a.a.a" should not match "!(*[a-b].[a-b]*)"', () => {
    assert(!isMatch('a.a.a', '!(*[a-b].[a-b]*)'));
  });

  it('"a.a.a" should not match "!*.(a|b)"', () => {
    assert(!isMatch('a.a.a', '!*.(a|b)'));
  });

  it('"a.a.a" should not match "!*.(a|b)*"', () => {
    assert(!isMatch('a.a.a', '!*.(a|b)*'));
  });

  it('"a.a.a" should match "*.!(a)"', () => {
    assert(isMatch('a.a.a', '*.!(a)'));
  });

  it('"a.a.a" should not match "*.+(b|d)"', () => {
    assert(!isMatch('a.a.a', '*.+(b|d)'));
  });

  it('"a.aa.a" should not match "(b|a).(a)"', () => {
    assert(!isMatch('a.aa.a', '(b|a).(a)'));
  });

  it('"a.aa.a" should not match "@(b|a).@(a)"', () => {
    assert(!isMatch('a.aa.a', '@(b|a).@(a)'));
  });

  it('"a.abcd" should match "!(*.a|*.b|*.c)"', () => {
    assert(isMatch('a.abcd', '!(*.a|*.b|*.c)'));
  });

  it('"a.abcd" should not match "!(*.a|*.b|*.c)*"', () => {
    assert(!isMatch('a.abcd', '!(*.a|*.b|*.c)*'));
  });

  it('"a.abcd" should match "*!(*.a|*.b|*.c)*"', () => {
    assert(isMatch('a.abcd', '*!(*.a|*.b|*.c)*'));
  });

  it('"a.abcd" should match "*!(.a|.b|.c)"', () => {
    assert(isMatch('a.abcd', '*!(.a|.b|.c)'));
  });

  it('"a.abcd" should match "*.!(a|b|c)"', () => {
    assert(isMatch('a.abcd', '*.!(a|b|c)'));
  });

  it('"a.abcd" should not match "*.!(a|b|c)*"', () => {
    assert(!isMatch('a.abcd', '*.!(a|b|c)*'));
  });

  it('"a.abcd" should match "*.(a|b|@(ab|a*@(b))*(c)d)"', () => {
    assert(isMatch('a.abcd', '*.(a|b|@(ab|a*@(b))*(c)d)'));
  });

  it('"a.b" should not match "!(*.*)"', () => {
    assert(!isMatch('a.b', '!(*.*)'));
  });

  it('"a.b" should not match "!(*.[a-b]*)"', () => {
    assert(!isMatch('a.b', '!(*.[a-b]*)'));
  });

  it('"a.b" should not match "!(*.a|*.b|*.c)"', () => {
    assert(!isMatch('a.b', '!(*.a|*.b|*.c)'));
  });

  it('"a.b" should not match "!(*[a-b].[a-b]*)"', () => {
    assert(!isMatch('a.b', '!(*[a-b].[a-b]*)'));
  });

  it('"a.b" should not match "!*.(a|b)"', () => {
    assert(!isMatch('a.b', '!*.(a|b)'));
  });

  it('"a.b" should not match "!*.(a|b)*"', () => {
    assert(!isMatch('a.b', '!*.(a|b)*'));
  });

  it('"a.b" should match "(a|d).(a|b)*"', () => {
    assert(isMatch('a.b', '(a|d).(a|b)*'));
  });

  it('"a.b" should match "*!(.a|.b|.c)"', () => {
    assert(isMatch('a.b', '*!(.a|.b|.c)'));
  });

  it('"a.b" should match "*.!(a)"', () => {
    assert(isMatch('a.b', '*.!(a)'));
  });

  it('"a.b" should not match "*.!(a|b|c)"', () => {
    assert(!isMatch('a.b', '*.!(a|b|c)'));
  });

  it('"a.b" should match "*.(a|b|@(ab|a*@(b))*(c)d)"', () => {
    assert(isMatch('a.b', '*.(a|b|@(ab|a*@(b))*(c)d)'));
  });

  it('"a.b" should match "*.+(b|d)"', () => {
    assert(isMatch('a.b', '*.+(b|d)'));
  });

  it('"a.bb" should not match "!(*.[a-b]*)"', () => {
    assert(!isMatch('a.bb', '!(*.[a-b]*)'));
  });

  it('"a.bb" should not match "!(*[a-b].[a-b]*)"', () => {
    assert(!isMatch('a.bb', '!(*[a-b].[a-b]*)'));
  });

  it('"a.bb" should match "!*.(a|b)"', () => {
    assert(isMatch('a.bb', '!*.(a|b)'));
  });

  it('"a.bb" should not match "!*.(a|b)*"', () => {
    assert(!isMatch('a.bb', '!*.(a|b)*'));
  });

  it('"a.bb" should not match "!*.*(a|b)"', () => {
    assert(!isMatch('a.bb', '!*.*(a|b)'));
  });

  it('"a.bb" should match "(a|d).(a|b)*"', () => {
    assert(isMatch('a.bb', '(a|d).(a|b)*'));
  });

  it('"a.bb" should not match "(b|a).(a)"', () => {
    assert(!isMatch('a.bb', '(b|a).(a)'));
  });

  it('"a.bb" should match "*.+(b|d)"', () => {
    assert(isMatch('a.bb', '*.+(b|d)'));
  });

  it('"a.bb" should not match "@(b|a).@(a)"', () => {
    assert(!isMatch('a.bb', '@(b|a).@(a)'));
  });

  it('"a.c" should not match "!(*.a|*.b|*.c)"', () => {
    assert(!isMatch('a.c', '!(*.a|*.b|*.c)'));
  });

  it('"a.c" should match "*!(.a|.b|.c)"', () => {
    assert(isMatch('a.c', '*!(.a|.b|.c)'));
  });

  it('"a.c" should not match "*.!(a|b|c)"', () => {
    assert(!isMatch('a.c', '*.!(a|b|c)'));
  });

  it('"a.c" should not match "*.(a|b|@(ab|a*@(b))*(c)d)"', () => {
    assert(!isMatch('a.c', '*.(a|b|@(ab|a*@(b))*(c)d)'));
  });

  it('"a.c.d" should match "!(*.a|*.b|*.c)"', () => {
    assert(isMatch('a.c.d', '!(*.a|*.b|*.c)'));
  });

  it('"a.c.d" should match "*!(.a|.b|.c)"', () => {
    assert(isMatch('a.c.d', '*!(.a|.b|.c)'));
  });

  it('"a.c.d" should match "*.!(a|b|c)"', () => {
    assert(isMatch('a.c.d', '*.!(a|b|c)'));
  });

  it('"a.c.d" should not match "*.(a|b|@(ab|a*@(b))*(c)d)"', () => {
    assert(!isMatch('a.c.d', '*.(a|b|@(ab|a*@(b))*(c)d)'));
  });

  it('"a.ccc" should match "!(*.[a-b]*)"', () => {
    assert(isMatch('a.ccc', '!(*.[a-b]*)'));
  });

  it('"a.ccc" should match "!(*[a-b].[a-b]*)"', () => {
    assert(isMatch('a.ccc', '!(*[a-b].[a-b]*)'));
  });

  it('"a.ccc" should match "!*.(a|b)"', () => {
    assert(isMatch('a.ccc', '!*.(a|b)'));
  });

  it('"a.ccc" should match "!*.(a|b)*"', () => {
    assert(isMatch('a.ccc', '!*.(a|b)*'));
  });

  it('"a.ccc" should not match "*.+(b|d)"', () => {
    assert(!isMatch('a.ccc', '*.+(b|d)'));
  });

  it('"a.js" should not match "!(*.js)"', () => {
    assert(!isMatch('a.js', '!(*.js)'));
  });

  it('"a.js" should match "*!(.js)"', () => {
    assert(isMatch('a.js', '*!(.js)'));
  });

  it('"a.js" should not match "*.!(js)"', () => {
    assert(!isMatch('a.js', '*.!(js)'));
  });

  it('"a.js" should not match "a.!(js)"', () => {
    assert(!isMatch('a.js', 'a.!(js)'));
  });

  it('"a.js" should not match "a.!(js)*"', () => {
    assert(!isMatch('a.js', 'a.!(js)*'));
  });

  it('"a.js.js" should not match "!(*.js)"', () => {
    assert(!isMatch('a.js.js', '!(*.js)'));
  });

  it('"a.js.js" should match "*!(.js)"', () => {
    assert(isMatch('a.js.js', '*!(.js)'));
  });

  it('"a.js.js" should match "*.!(js)"', () => {
    assert(isMatch('a.js.js', '*.!(js)'));
  });

  it('"a.js.js" should match "*.*(js).js"', () => {
    assert(isMatch('a.js.js', '*.*(js).js'));
  });

  it('"a.md" should match "!(*.js)"', () => {
    assert(isMatch('a.md', '!(*.js)'));
  });

  it('"a.md" should match "*!(.js)"', () => {
    assert(isMatch('a.md', '*!(.js)'));
  });

  it('"a.md" should match "*.!(js)"', () => {
    assert(isMatch('a.md', '*.!(js)'));
  });

  it('"a.md" should match "a.!(js)"', () => {
    assert(isMatch('a.md', 'a.!(js)'));
  });

  it('"a.md" should match "a.!(js)*"', () => {
    assert(isMatch('a.md', 'a.!(js)*'));
  });

  it('"a.md.js" should not match "*.*(js).js"', () => {
    assert(!isMatch('a.md.js', '*.*(js).js'));
  });

  it('"a.txt" should match "a.!(js)"', () => {
    assert(isMatch('a.txt', 'a.!(js)'));
  });

  it('"a.txt" should match "a.!(js)*"', () => {
    assert(isMatch('a.txt', 'a.!(js)*'));
  });

  it('"a/!(z)" should match "a/!(z)"', () => {
    assert(isMatch('a/!(z)', 'a/!(z)'));
  });

  it('"a/b" should match "a/!(z)"', () => {
    assert(isMatch('a/b', 'a/!(z)'));
  });

  it('"a/b/c.txt" should not match "*/b/!(*).txt"', () => {
    assert(!isMatch('a/b/c.txt', '*/b/!(*).txt'));
  });

  it('"a/b/c.txt" should not match "*/b/!(c).txt"', () => {
    assert(!isMatch('a/b/c.txt', '*/b/!(c).txt'));
  });

  it('"a/b/c.txt" should match "*/b/!(cc).txt"', () => {
    assert(isMatch('a/b/c.txt', '*/b/!(cc).txt'));
  });

  it('"a/b/cc.txt" should not match "*/b/!(*).txt"', () => {
    assert(!isMatch('a/b/cc.txt', '*/b/!(*).txt'));
  });

  it('"a/b/cc.txt" should not match "*/b/!(c).txt"', () => {
    assert(!isMatch('a/b/cc.txt', '*/b/!(c).txt'));
  });

  it('"a/b/cc.txt" should not match "*/b/!(cc).txt"', () => {
    assert(!isMatch('a/b/cc.txt', '*/b/!(cc).txt'));
  });

  it('"a/dir/foo.txt" should match "*/dir/**/!(bar).txt"', () => {
    assert(isMatch('a/dir/foo.txt', '*/dir/**/!(bar).txt'));
  });

  it('"a/z" should not match "a/!(z)"', () => {
    assert(!isMatch('a/z', 'a/!(z)'));
  });

  it('"a\\(b" should not match "a(*b"', () => {
    assert(!isMatch('a\\(b', 'a(*b'));
  });

  it('"a\\(b" should not match "a(b"', () => {
    assert(!isMatch('a\\(b', 'a(b'));
  });

  it('"a\\z" should match "a\\z"', () => {
    assert(isMatch('a\\\\z', 'a\\\\z', { windows: false }));
  });

  it('"a\\z" should match "a\\z"', () => {
    assert(isMatch('a\\\\z', 'a\\\\z'));
  });

  it('"a\\b" should match "a/b"', () => {
    assert(isMatch('a\\b', 'a/b', { windows: true }));
  });

  it('"a\\z" should match "a\\z"', () => {
    assert(isMatch('a\\z', 'a\\\\z', { windows: false }));
  });

  it('"a\\z" should not match "a\\z"', () => {
    assert(!isMatch('a\\z', 'a\\\\z'));
  });

  it('"aa" should not match "!(a!(b))"', () => {
    assert(!isMatch('aa', '!(a!(b))'));
  });

  it('"aa" should match "!(a)"', () => {
    assert(isMatch('aa', '!(a)'));
  });

  it('"aa" should not match "!(a)*"', () => {
    assert(!isMatch('aa', '!(a)*'));
  });

  it('"aa" should not match "?"', () => {
    assert(!isMatch('aa', '?'));
  });

  it('"aa" should not match "@(a)b"', () => {
    assert(!isMatch('aa', '@(a)b'));
  });

  it('"aa" should match "a!(b)*"', () => {
    assert(isMatch('aa', 'a!(b)*'));
  });

  it('"aa" should not match "a??b"', () => {
    assert(!isMatch('aa', 'a??b'));
  });

  it('"aa.aa" should not match "(b|a).(a)"', () => {
    assert(!isMatch('aa.aa', '(b|a).(a)'));
  });

  it('"aa.aa" should not match "@(b|a).@(a)"', () => {
    assert(!isMatch('aa.aa', '@(b|a).@(a)'));
  });

  it('"aaa" should not match "!(a)*"', () => {
    assert(!isMatch('aaa', '!(a)*'));
  });

  it('"aaa" should match "a!(b)*"', () => {
    assert(isMatch('aaa', 'a!(b)*'));
  });

  it('"aaaaaaabababab" should match "*ab"', () => {
    assert(isMatch('aaaaaaabababab', '*ab'));
  });

  it('"aaac" should match "*(@(a))a@(c)"', () => {
    assert(isMatch('aaac', '*(@(a))a@(c)'));
  });

  it('"aaaz" should match "[a*(]*z"', () => {
    assert(isMatch('aaaz', '[a*(]*z'));
  });

  it('"aab" should not match "!(a)*"', () => {
    assert(!isMatch('aab', '!(a)*'));
  });

  it('"aab" should not match "?"', () => {
    assert(!isMatch('aab', '?'));
  });

  it('"aab" should not match "??"', () => {
    assert(!isMatch('aab', '??'));
  });

  it('"aab" should not match "@(c)b"', () => {
    assert(!isMatch('aab', '@(c)b'));
  });

  it('"aab" should match "a!(b)*"', () => {
    assert(isMatch('aab', 'a!(b)*'));
  });

  it('"aab" should not match "a??b"', () => {
    assert(!isMatch('aab', 'a??b'));
  });

  it('"aac" should match "*(@(a))a@(c)"', () => {
    assert(isMatch('aac', '*(@(a))a@(c)'));
  });

  it('"aac" should not match "*(@(a))b@(c)"', () => {
    assert(!isMatch('aac', '*(@(a))b@(c)'));
  });

  it('"aax" should not match "a!(a*|b)"', () => {
    assert(!isMatch('aax', 'a!(a*|b)'));
  });

  it('"aax" should match "a!(x*|b)"', () => {
    assert(isMatch('aax', 'a!(x*|b)'));
  });

  it('"aax" should match "a?(a*|b)"', () => {
    assert(isMatch('aax', 'a?(a*|b)'));
  });

  it('"aaz" should match "[a*(]*z"', () => {
    assert(isMatch('aaz', '[a*(]*z'));
  });

  it('"ab" should match "!(*.*)"', () => {
    assert(isMatch('ab', '!(*.*)'));
  });

  it('"ab" should match "!(a!(b))"', () => {
    assert(isMatch('ab', '!(a!(b))'));
  });

  it('"ab" should not match "!(a)*"', () => {
    assert(!isMatch('ab', '!(a)*'));
  });

  it('"ab" should match "(a+|b)*"', () => {
    assert(isMatch('ab', '(a+|b)*'));
  });

  it('"ab" should match "(a+|b)+"', () => {
    assert(isMatch('ab', '(a+|b)+'));
  });

  it('"ab" should not match "*?(a)bc"', () => {
    assert(!isMatch('ab', '*?(a)bc'));
  });

  it('"ab" should not match "a!(*(b|B))"', () => {
    assert(!isMatch('ab', 'a!(*(b|B))'));
  });

  it('"ab" should not match "a!(@(b|B))"', () => {
    assert(!isMatch('ab', 'a!(@(b|B))'));
  });

  it('"aB" should not match "a!(@(b|B))"', () => {
    assert(!isMatch('aB', 'a!(@(b|B))'));
  });

  it('"ab" should not match "a!(b)*"', () => {
    assert(!isMatch('ab', 'a!(b)*'));
  });

  it('"ab" should not match "a(*b"', () => {
    assert(!isMatch('ab', 'a(*b'));
  });

  it('"ab" should not match "a(b"', () => {
    assert(!isMatch('ab', 'a(b'));
  });

  it('"ab" should not match "a(b*(foo|bar))d"', () => {
    assert(!isMatch('ab', 'a(b*(foo|bar))d'));
  });

  it('"ab" should not match "a/b"', () => {
    assert(!isMatch('ab', 'a/b', { windows: true }));
  });

  it('"ab" should not match "a\\(b"', () => {
    assert(!isMatch('ab', 'a\\(b'));
  });

  it('"ab" should match "ab*(e|f)"', () => {
    assert(isMatch('ab', 'ab*(e|f)'));
  });

  it('"ab" should match "ab**"', () => {
    assert(isMatch('ab', 'ab**'));
  });

  it('"ab" should match "ab**(e|f)"', () => {
    assert(isMatch('ab', 'ab**(e|f)'));
  });

  it('"ab" should not match "ab**(e|f)g"', () => {
    assert(!isMatch('ab', 'ab**(e|f)g'));
  });

  it('"ab" should not match "ab***ef"', () => {
    assert(!isMatch('ab', 'ab***ef'));
  });

  it('"ab" should not match "ab*+(e|f)"', () => {
    assert(!isMatch('ab', 'ab*+(e|f)'));
  });

  it('"ab" should not match "ab*d+(e|f)"', () => {
    assert(!isMatch('ab', 'ab*d+(e|f)'));
  });

  it('"ab" should not match "ab?*(e|f)"', () => {
    assert(!isMatch('ab', 'ab?*(e|f)'));
  });

  it('"ab/cXd/efXg/hi" should match "**/*X*/**/*i"', () => {
    assert(isMatch('ab/cXd/efXg/hi', '**/*X*/**/*i'));
  });

  it('"ab/cXd/efXg/hi" should match "*/*X*/*/*i"', () => {
    assert(isMatch('ab/cXd/efXg/hi', '*/*X*/*/*i'));
  });

  it('"ab/cXd/efXg/hi" should not match "*X*i"', () => {
    assert(!isMatch('ab/cXd/efXg/hi', '*X*i'));
  });

  it('"ab/cXd/efXg/hi" should not match "*Xg*i"', () => {
    assert(!isMatch('ab/cXd/efXg/hi', '*Xg*i'));
  });

  it('"ab]" should match "a!(@(b|B))"', () => {
    assert(isMatch('ab]', 'a!(@(b|B))'));
  });

  it('"abab" should match "(a+|b)*"', () => {
    assert(isMatch('abab', '(a+|b)*'));
  });

  it('"abab" should match "(a+|b)+"', () => {
    assert(isMatch('abab', '(a+|b)+'));
  });

  it('"abab" should not match "*?(a)bc"', () => {
    assert(!isMatch('abab', '*?(a)bc'));
  });

  it('"abab" should not match "a(b*(foo|bar))d"', () => {
    assert(!isMatch('abab', 'a(b*(foo|bar))d'));
  });

  it('"abab" should not match "ab*(e|f)"', () => {
    assert(!isMatch('abab', 'ab*(e|f)'));
  });

  it('"abab" should match "ab**"', () => {
    assert(isMatch('abab', 'ab**'));
  });

  it('"abab" should match "ab**(e|f)"', () => {
    assert(isMatch('abab', 'ab**(e|f)'));
  });

  it('"abab" should not match "ab**(e|f)g"', () => {
    assert(!isMatch('abab', 'ab**(e|f)g'));
  });

  it('"abab" should not match "ab***ef"', () => {
    assert(!isMatch('abab', 'ab***ef'));
  });

  it('"abab" should not match "ab*+(e|f)"', () => {
    assert(!isMatch('abab', 'ab*+(e|f)'));
  });

  it('"abab" should not match "ab*d+(e|f)"', () => {
    assert(!isMatch('abab', 'ab*d+(e|f)'));
  });

  it('"abab" should not match "ab?*(e|f)"', () => {
    assert(!isMatch('abab', 'ab?*(e|f)'));
  });

  it('"abb" should match "!(*.*)"', () => {
    assert(isMatch('abb', '!(*.*)'));
  });

  it('"abb" should not match "!(a)*"', () => {
    assert(!isMatch('abb', '!(a)*'));
  });

  it('"abb" should not match "a!(b)*"', () => {
    assert(!isMatch('abb', 'a!(b)*'));
  });

  it('"abbcd" should match "@(ab|a*(b))*(c)d"', () => {
    assert(isMatch('abbcd', '@(ab|a*(b))*(c)d'));
  });

  it('"abc" should not match "\\a\\b\\c"', () => {
    assert(!isMatch('abc', '\\a\\b\\c'));
  });

  it('"aBc" should match "a!(@(b|B))"', () => {
    assert(isMatch('aBc', 'a!(@(b|B))'));
  });

  it('"abcd" should match "?@(a|b)*@(c)d"', () => {
    assert(isMatch('abcd', '?@(a|b)*@(c)d'));
  });

  it('"abcd" should match "@(ab|a*@(b))*(c)d"', () => {
    assert(isMatch('abcd', '@(ab|a*@(b))*(c)d'));
  });

  it('"abcd/abcdefg/abcdefghijk/abcdefghijklmnop.txt" should match "**/*a*b*g*n*t"', () => {
    assert(isMatch('abcd/abcdefg/abcdefghijk/abcdefghijklmnop.txt', '**/*a*b*g*n*t'));
  });

  it('"abcd/abcdefg/abcdefghijk/abcdefghijklmnop.txtz" should not match "**/*a*b*g*n*t"', () => {
    assert(!isMatch('abcd/abcdefg/abcdefghijk/abcdefghijklmnop.txtz', '**/*a*b*g*n*t'));
  });

  it('"abcdef" should match "(a+|b)*"', () => {
    assert(isMatch('abcdef', '(a+|b)*'));
  });

  it('"abcdef" should not match "(a+|b)+"', () => {
    assert(!isMatch('abcdef', '(a+|b)+'));
  });

  it('"abcdef" should not match "*?(a)bc"', () => {
    assert(!isMatch('abcdef', '*?(a)bc'));
  });

  it('"abcdef" should not match "a(b*(foo|bar))d"', () => {
    assert(!isMatch('abcdef', 'a(b*(foo|bar))d'));
  });

  it('"abcdef" should not match "ab*(e|f)"', () => {
    assert(!isMatch('abcdef', 'ab*(e|f)'));
  });

  it('"abcdef" should match "ab**"', () => {
    assert(isMatch('abcdef', 'ab**'));
  });

  it('"abcdef" should match "ab**(e|f)"', () => {
    assert(isMatch('abcdef', 'ab**(e|f)'));
  });

  it('"abcdef" should not match "ab**(e|f)g"', () => {
    assert(!isMatch('abcdef', 'ab**(e|f)g'));
  });

  it('"abcdef" should match "ab***ef"', () => {
    assert(isMatch('abcdef', 'ab***ef'));
  });

  it('"abcdef" should match "ab*+(e|f)"', () => {
    assert(isMatch('abcdef', 'ab*+(e|f)'));
  });

  it('"abcdef" should match "ab*d+(e|f)"', () => {
    assert(isMatch('abcdef', 'ab*d+(e|f)'));
  });

  it('"abcdef" should not match "ab?*(e|f)"', () => {
    assert(!isMatch('abcdef', 'ab?*(e|f)'));
  });

  it('"abcfef" should match "(a+|b)*"', () => {
    assert(isMatch('abcfef', '(a+|b)*'));
  });

  it('"abcfef" should not match "(a+|b)+"', () => {
    assert(!isMatch('abcfef', '(a+|b)+'));
  });

  it('"abcfef" should not match "*?(a)bc"', () => {
    assert(!isMatch('abcfef', '*?(a)bc'));
  });

  it('"abcfef" should not match "a(b*(foo|bar))d"', () => {
    assert(!isMatch('abcfef', 'a(b*(foo|bar))d'));
  });

  it('"abcfef" should not match "ab*(e|f)"', () => {
    assert(!isMatch('abcfef', 'ab*(e|f)'));
  });

  it('"abcfef" should match "ab**"', () => {
    assert(isMatch('abcfef', 'ab**'));
  });

  it('"abcfef" should match "ab**(e|f)"', () => {
    assert(isMatch('abcfef', 'ab**(e|f)'));
  });

  it('"abcfef" should not match "ab**(e|f)g"', () => {
    assert(!isMatch('abcfef', 'ab**(e|f)g'));
  });

  it('"abcfef" should match "ab***ef"', () => {
    assert(isMatch('abcfef', 'ab***ef'));
  });

  it('"abcfef" should match "ab*+(e|f)"', () => {
    assert(isMatch('abcfef', 'ab*+(e|f)'));
  });

  it('"abcfef" should not match "ab*d+(e|f)"', () => {
    assert(!isMatch('abcfef', 'ab*d+(e|f)'));
  });

  it('"abcfef" should match "ab?*(e|f)"', () => {
    assert(isMatch('abcfef', 'ab?*(e|f)'));
  });

  it('"abcfefg" should match "(a+|b)*"', () => {
    assert(isMatch('abcfefg', '(a+|b)*'));
  });

  it('"abcfefg" should not match "(a+|b)+"', () => {
    assert(!isMatch('abcfefg', '(a+|b)+'));
  });

  it('"abcfefg" should not match "*?(a)bc"', () => {
    assert(!isMatch('abcfefg', '*?(a)bc'));
  });

  it('"abcfefg" should not match "a(b*(foo|bar))d"', () => {
    assert(!isMatch('abcfefg', 'a(b*(foo|bar))d'));
  });

  it('"abcfefg" should not match "ab*(e|f)"', () => {
    assert(!isMatch('abcfefg', 'ab*(e|f)'));
  });

  it('"abcfefg" should match "ab**"', () => {
    assert(isMatch('abcfefg', 'ab**'));
  });

  it('"abcfefg" should match "ab**(e|f)"', () => {
    assert(isMatch('abcfefg', 'ab**(e|f)'));
  });

  it('"abcfefg" should match "ab**(e|f)g"', () => {
    assert(isMatch('abcfefg', 'ab**(e|f)g'));
  });

  it('"abcfefg" should not match "ab***ef"', () => {
    assert(!isMatch('abcfefg', 'ab***ef'));
  });

  it('"abcfefg" should not match "ab*+(e|f)"', () => {
    assert(!isMatch('abcfefg', 'ab*+(e|f)'));
  });

  it('"abcfefg" should not match "ab*d+(e|f)"', () => {
    assert(!isMatch('abcfefg', 'ab*d+(e|f)'));
  });

  it('"abcfefg" should not match "ab?*(e|f)"', () => {
    assert(!isMatch('abcfefg', 'ab?*(e|f)'));
  });

  it('"abcx" should match "!([[*])*"', () => {
    assert(isMatch('abcx', '!([[*])*'));
  });

  it('"abcx" should match "+(a|b\\[)*"', () => {
    assert(isMatch('abcx', '+(a|b\\[)*'));
  });

  it('"abcx" should not match "[a*(]*z"', () => {
    assert(!isMatch('abcx', '[a*(]*z'));
  });

  it('"abcXdefXghi" should match "*X*i"', () => {
    assert(isMatch('abcXdefXghi', '*X*i'));
  });

  it('"abcz" should match "!([[*])*"', () => {
    assert(isMatch('abcz', '!([[*])*'));
  });

  it('"abcz" should match "+(a|b\\[)*"', () => {
    assert(isMatch('abcz', '+(a|b\\[)*'));
  });

  it('"abcz" should match "[a*(]*z"', () => {
    assert(isMatch('abcz', '[a*(]*z'));
  });

  it('"abd" should match "(a+|b)*"', () => {
    assert(isMatch('abd', '(a+|b)*'));
  });

  it('"abd" should not match "(a+|b)+"', () => {
    assert(!isMatch('abd', '(a+|b)+'));
  });

  it('"abd" should not match "*?(a)bc"', () => {
    assert(!isMatch('abd', '*?(a)bc'));
  });

  it('"abd" should match "a!(*(b|B))"', () => {
    assert(isMatch('abd', 'a!(*(b|B))'));
  });

  it('"abd" should match "a!(@(b|B))"', () => {
    assert(isMatch('abd', 'a!(@(b|B))'));
  });

  it('"abd" should not match "a!(@(b|B))d"', () => {
    assert(!isMatch('abd', 'a!(@(b|B))d'));
  });

  it('"abd" should match "a(b*(foo|bar))d"', () => {
    assert(isMatch('abd', 'a(b*(foo|bar))d'));
  });

  it('"abd" should match "a+(b|c)d"', () => {
    assert(isMatch('abd', 'a+(b|c)d'));
  });

  it('"abd" should match "a[b*(foo|bar)]d"', () => {
    assert(isMatch('abd', 'a[b*(foo|bar)]d'));
  });

  it('"abd" should not match "ab*(e|f)"', () => {
    assert(!isMatch('abd', 'ab*(e|f)'));
  });

  it('"abd" should match "ab**"', () => {
    assert(isMatch('abd', 'ab**'));
  });

  it('"abd" should match "ab**(e|f)"', () => {
    assert(isMatch('abd', 'ab**(e|f)'));
  });

  it('"abd" should not match "ab**(e|f)g"', () => {
    assert(!isMatch('abd', 'ab**(e|f)g'));
  });

  it('"abd" should not match "ab***ef"', () => {
    assert(!isMatch('abd', 'ab***ef'));
  });

  it('"abd" should not match "ab*+(e|f)"', () => {
    assert(!isMatch('abd', 'ab*+(e|f)'));
  });

  it('"abd" should not match "ab*d+(e|f)"', () => {
    assert(!isMatch('abd', 'ab*d+(e|f)'));
  });

  it('"abd" should match "ab?*(e|f)"', () => {
    assert(isMatch('abd', 'ab?*(e|f)'));
  });

  it('"abef" should match "(a+|b)*"', () => {
    assert(isMatch('abef', '(a+|b)*'));
  });

  it('"abef" should not match "(a+|b)+"', () => {
    assert(!isMatch('abef', '(a+|b)+'));
  });

  it('"abef" should not match "*(a+|b)"', () => {
    assert(!isMatch('abef', '*(a+|b)'));
  });

  it('"abef" should not match "*?(a)bc"', () => {
    assert(!isMatch('abef', '*?(a)bc'));
  });

  it('"abef" should not match "a(b*(foo|bar))d"', () => {
    assert(!isMatch('abef', 'a(b*(foo|bar))d'));
  });

  it('"abef" should match "ab*(e|f)"', () => {
    assert(isMatch('abef', 'ab*(e|f)'));
  });

  it('"abef" should match "ab**"', () => {
    assert(isMatch('abef', 'ab**'));
  });

  it('"abef" should match "ab**(e|f)"', () => {
    assert(isMatch('abef', 'ab**(e|f)'));
  });

  it('"abef" should not match "ab**(e|f)g"', () => {
    assert(!isMatch('abef', 'ab**(e|f)g'));
  });

  it('"abef" should match "ab***ef"', () => {
    assert(isMatch('abef', 'ab***ef'));
  });

  it('"abef" should match "ab*+(e|f)"', () => {
    assert(isMatch('abef', 'ab*+(e|f)'));
  });

  it('"abef" should not match "ab*d+(e|f)"', () => {
    assert(!isMatch('abef', 'ab*d+(e|f)'));
  });

  it('"abef" should match "ab?*(e|f)"', () => {
    assert(isMatch('abef', 'ab?*(e|f)'));
  });

  it('"abz" should not match "a!(*)"', () => {
    assert(!isMatch('abz', 'a!(*)'));
  });

  it('"abz" should match "a!(z)"', () => {
    assert(isMatch('abz', 'a!(z)'));
  });

  it('"abz" should match "a*!(z)"', () => {
    assert(isMatch('abz', 'a*!(z)'));
  });

  it('"abz" should not match "a*(z)"', () => {
    assert(!isMatch('abz', 'a*(z)'));
  });

  it('"abz" should match "a**(z)"', () => {
    assert(isMatch('abz', 'a**(z)'));
  });

  it('"abz" should match "a*@(z)"', () => {
    assert(isMatch('abz', 'a*@(z)'));
  });

  it('"abz" should not match "a+(z)"', () => {
    assert(!isMatch('abz', 'a+(z)'));
  });

  it('"abz" should not match "a?(z)"', () => {
    assert(!isMatch('abz', 'a?(z)'));
  });

  it('"abz" should not match "a@(z)"', () => {
    assert(!isMatch('abz', 'a@(z)'));
  });

  it('"ac" should not match "!(a)*"', () => {
    assert(!isMatch('ac', '!(a)*'));
  });

  it('"ac" should match "*(@(a))a@(c)"', () => {
    assert(isMatch('ac', '*(@(a))a@(c)'));
  });

  it('"ac" should match "a!(*(b|B))"', () => {
    assert(isMatch('ac', 'a!(*(b|B))'));
  });

  it('"ac" should match "a!(@(b|B))"', () => {
    assert(isMatch('ac', 'a!(@(b|B))'));
  });

  it('"ac" should match "a!(b)*"', () => {
    assert(isMatch('ac', 'a!(b)*'));
  });

  it('"accdef" should match "(a+|b)*"', () => {
    assert(isMatch('accdef', '(a+|b)*'));
  });

  it('"accdef" should not match "(a+|b)+"', () => {
    assert(!isMatch('accdef', '(a+|b)+'));
  });

  it('"accdef" should not match "*?(a)bc"', () => {
    assert(!isMatch('accdef', '*?(a)bc'));
  });

  it('"accdef" should not match "a(b*(foo|bar))d"', () => {
    assert(!isMatch('accdef', 'a(b*(foo|bar))d'));
  });

  it('"accdef" should not match "ab*(e|f)"', () => {
    assert(!isMatch('accdef', 'ab*(e|f)'));
  });

  it('"accdef" should not match "ab**"', () => {
    assert(!isMatch('accdef', 'ab**'));
  });

  it('"accdef" should not match "ab**(e|f)"', () => {
    assert(!isMatch('accdef', 'ab**(e|f)'));
  });

  it('"accdef" should not match "ab**(e|f)g"', () => {
    assert(!isMatch('accdef', 'ab**(e|f)g'));
  });

  it('"accdef" should not match "ab***ef"', () => {
    assert(!isMatch('accdef', 'ab***ef'));
  });

  it('"accdef" should not match "ab*+(e|f)"', () => {
    assert(!isMatch('accdef', 'ab*+(e|f)'));
  });

  it('"accdef" should not match "ab*d+(e|f)"', () => {
    assert(!isMatch('accdef', 'ab*d+(e|f)'));
  });

  it('"accdef" should not match "ab?*(e|f)"', () => {
    assert(!isMatch('accdef', 'ab?*(e|f)'));
  });

  it('"acd" should match "(a+|b)*"', () => {
    assert(isMatch('acd', '(a+|b)*'));
  });

  it('"acd" should not match "(a+|b)+"', () => {
    assert(!isMatch('acd', '(a+|b)+'));
  });

  it('"acd" should not match "*?(a)bc"', () => {
    assert(!isMatch('acd', '*?(a)bc'));
  });

  it('"acd" should match "@(ab|a*(b))*(c)d"', () => {
    assert(isMatch('acd', '@(ab|a*(b))*(c)d'));
  });

  it('"acd" should match "a!(*(b|B))"', () => {
    assert(isMatch('acd', 'a!(*(b|B))'));
  });

  it('"acd" should match "a!(@(b|B))"', () => {
    assert(isMatch('acd', 'a!(@(b|B))'));
  });

  it('"acd" should match "a!(@(b|B))d"', () => {
    assert(isMatch('acd', 'a!(@(b|B))d'));
  });

  it('"acd" should not match "a(b*(foo|bar))d"', () => {
    assert(!isMatch('acd', 'a(b*(foo|bar))d'));
  });

  it('"acd" should match "a+(b|c)d"', () => {
    assert(isMatch('acd', 'a+(b|c)d'));
  });

  it('"acd" should not match "a[b*(foo|bar)]d"', () => {
    assert(!isMatch('acd', 'a[b*(foo|bar)]d'));
  });

  it('"acd" should not match "ab*(e|f)"', () => {
    assert(!isMatch('acd', 'ab*(e|f)'));
  });

  it('"acd" should not match "ab**"', () => {
    assert(!isMatch('acd', 'ab**'));
  });

  it('"acd" should not match "ab**(e|f)"', () => {
    assert(!isMatch('acd', 'ab**(e|f)'));
  });

  it('"acd" should not match "ab**(e|f)g"', () => {
    assert(!isMatch('acd', 'ab**(e|f)g'));
  });

  it('"acd" should not match "ab***ef"', () => {
    assert(!isMatch('acd', 'ab***ef'));
  });

  it('"acd" should not match "ab*+(e|f)"', () => {
    assert(!isMatch('acd', 'ab*+(e|f)'));
  });

  it('"acd" should not match "ab*d+(e|f)"', () => {
    assert(!isMatch('acd', 'ab*d+(e|f)'));
  });

  it('"acd" should not match "ab?*(e|f)"', () => {
    assert(!isMatch('acd', 'ab?*(e|f)'));
  });

  it('"ax" should match "?(a*|b)"', () => {
    assert(isMatch('ax', '?(a*|b)'));
  });

  it('"ax" should not match "a?(b*)"', () => {
    assert(!isMatch('ax', 'a?(b*)'));
  });

  it('"axz" should not match "a+(z)"', () => {
    assert(!isMatch('axz', 'a+(z)'));
  });

  it('"az" should not match "a!(*)"', () => {
    assert(!isMatch('az', 'a!(*)'));
  });

  it('"az" should not match "a!(z)"', () => {
    assert(!isMatch('az', 'a!(z)'));
  });

  it('"az" should match "a*!(z)"', () => {
    assert(isMatch('az', 'a*!(z)'));
  });

  it('"az" should match "a*(z)"', () => {
    assert(isMatch('az', 'a*(z)'));
  });

  it('"az" should match "a**(z)"', () => {
    assert(isMatch('az', 'a**(z)'));
  });

  it('"az" should match "a*@(z)"', () => {
    assert(isMatch('az', 'a*@(z)'));
  });

  it('"az" should match "a+(z)"', () => {
    assert(isMatch('az', 'a+(z)'));
  });

  it('"az" should match "a?(z)"', () => {
    assert(isMatch('az', 'a?(z)'));
  });

  it('"az" should match "a@(z)"', () => {
    assert(isMatch('az', 'a@(z)'));
  });

  it('"az" should not match "a\\z"', () => {
    assert(!isMatch('az', 'a\\\\z', { windows: false }));
  });

  it('"az" should not match "a\\z"', () => {
    assert(!isMatch('az', 'a\\\\z'));
  });

  it('"b" should match "!(a)*"', () => {
    assert(isMatch('b', '!(a)*'));
  });

  it('"b" should match "(a+|b)*"', () => {
    assert(isMatch('b', '(a+|b)*'));
  });

  it('"b" should not match "a!(b)*"', () => {
    assert(!isMatch('b', 'a!(b)*'));
  });

  it('"b.a" should match "(b|a).(a)"', () => {
    assert(isMatch('b.a', '(b|a).(a)'));
  });

  it('"b.a" should match "@(b|a).@(a)"', () => {
    assert(isMatch('b.a', '@(b|a).@(a)'));
  });

  it('"b/a" should not match "!(b/a)"', () => {
    assert(!isMatch('b/a', '!(b/a)'));
  });

  it('"b/b" should match "!(b/a)"', () => {
    assert(isMatch('b/b', '!(b/a)'));
  });

  it('"b/c" should match "!(b/a)"', () => {
    assert(isMatch('b/c', '!(b/a)'));
  });

  it('"b/c" should not match "b/!(c)"', () => {
    assert(!isMatch('b/c', 'b/!(c)'));
  });

  it('"b/c" should match "b/!(cc)"', () => {
    assert(isMatch('b/c', 'b/!(cc)'));
  });

  it('"b/c.txt" should not match "b/!(c).txt"', () => {
    assert(!isMatch('b/c.txt', 'b/!(c).txt'));
  });

  it('"b/c.txt" should match "b/!(cc).txt"', () => {
    assert(isMatch('b/c.txt', 'b/!(cc).txt'));
  });

  it('"b/cc" should match "b/!(c)"', () => {
    assert(isMatch('b/cc', 'b/!(c)'));
  });

  it('"b/cc" should not match "b/!(cc)"', () => {
    assert(!isMatch('b/cc', 'b/!(cc)'));
  });

  it('"b/cc.txt" should not match "b/!(c).txt"', () => {
    assert(!isMatch('b/cc.txt', 'b/!(c).txt'));
  });

  it('"b/cc.txt" should not match "b/!(cc).txt"', () => {
    assert(!isMatch('b/cc.txt', 'b/!(cc).txt'));
  });

  it('"b/ccc" should match "b/!(c)"', () => {
    assert(isMatch('b/ccc', 'b/!(c)'));
  });

  it('"ba" should match "!(a!(b))"', () => {
    assert(isMatch('ba', '!(a!(b))'));
  });

  it('"ba" should match "b?(a|b)"', () => {
    assert(isMatch('ba', 'b?(a|b)'));
  });

  it('"baaac" should not match "*(@(a))a@(c)"', () => {
    assert(!isMatch('baaac', '*(@(a))a@(c)'));
  });

  it('"bar" should match "!(foo)"', () => {
    assert(isMatch('bar', '!(foo)'));
  });

  it('"bar" should match "!(foo)*"', () => {
    assert(isMatch('bar', '!(foo)*'));
  });

  it('"bar" should match "!(foo)b*"', () => {
    assert(isMatch('bar', '!(foo)b*'));
  });

  it('"bar" should match "*(!(foo))"', () => {
    assert(isMatch('bar', '*(!(foo))'));
  });

  it('"baz" should match "!(foo)*"', () => {
    assert(isMatch('baz', '!(foo)*'));
  });

  it('"baz" should match "!(foo)b*"', () => {
    assert(isMatch('baz', '!(foo)b*'));
  });

  it('"baz" should match "*(!(foo))"', () => {
    assert(isMatch('baz', '*(!(foo))'));
  });

  it('"bb" should match "!(a!(b))"', () => {
    assert(isMatch('bb', '!(a!(b))'));
  });

  it('"bb" should match "!(a)*"', () => {
    assert(isMatch('bb', '!(a)*'));
  });

  it('"bb" should not match "a!(b)*"', () => {
    assert(!isMatch('bb', 'a!(b)*'));
  });

  it('"bb" should not match "a?(a|b)"', () => {
    assert(!isMatch('bb', 'a?(a|b)'));
  });

  it('"bbc" should match "!([[*])*"', () => {
    assert(isMatch('bbc', '!([[*])*'));
  });

  it('"bbc" should not match "+(a|b\\[)*"', () => {
    assert(!isMatch('bbc', '+(a|b\\[)*'));
  });

  it('"bbc" should not match "[a*(]*z"', () => {
    assert(!isMatch('bbc', '[a*(]*z'));
  });

  it('"bz" should not match "a+(z)"', () => {
    assert(!isMatch('bz', 'a+(z)'));
  });

  it('"c" should not match "*(@(a))a@(c)"', () => {
    assert(!isMatch('c', '*(@(a))a@(c)'));
  });

  it('"c.a" should not match "!(*.[a-b]*)"', () => {
    assert(!isMatch('c.a', '!(*.[a-b]*)'));
  });

  it('"c.a" should match "!(*[a-b].[a-b]*)"', () => {
    assert(isMatch('c.a', '!(*[a-b].[a-b]*)'));
  });

  it('"c.a" should not match "!*.(a|b)"', () => {
    assert(!isMatch('c.a', '!*.(a|b)'));
  });

  it('"c.a" should not match "!*.(a|b)*"', () => {
    assert(!isMatch('c.a', '!*.(a|b)*'));
  });

  it('"c.a" should not match "(b|a).(a)"', () => {
    assert(!isMatch('c.a', '(b|a).(a)'));
  });

  it('"c.a" should not match "*.!(a)"', () => {
    assert(!isMatch('c.a', '*.!(a)'));
  });

  it('"c.a" should not match "*.+(b|d)"', () => {
    assert(!isMatch('c.a', '*.+(b|d)'));
  });

  it('"c.a" should not match "@(b|a).@(a)"', () => {
    assert(!isMatch('c.a', '@(b|a).@(a)'));
  });

  it('"c.c" should not match "!(*.a|*.b|*.c)"', () => {
    assert(!isMatch('c.c', '!(*.a|*.b|*.c)'));
  });

  it('"c.c" should match "*!(.a|.b|.c)"', () => {
    assert(isMatch('c.c', '*!(.a|.b|.c)'));
  });

  it('"c.c" should not match "*.!(a|b|c)"', () => {
    assert(!isMatch('c.c', '*.!(a|b|c)'));
  });

  it('"c.c" should not match "*.(a|b|@(ab|a*@(b))*(c)d)"', () => {
    assert(!isMatch('c.c', '*.(a|b|@(ab|a*@(b))*(c)d)'));
  });

  it('"c.ccc" should match "!(*.[a-b]*)"', () => {
    assert(isMatch('c.ccc', '!(*.[a-b]*)'));
  });

  it('"c.ccc" should match "!(*[a-b].[a-b]*)"', () => {
    assert(isMatch('c.ccc', '!(*[a-b].[a-b]*)'));
  });

  it('"c.js" should not match "!(*.js)"', () => {
    assert(!isMatch('c.js', '!(*.js)'));
  });

  it('"c.js" should match "*!(.js)"', () => {
    assert(isMatch('c.js', '*!(.js)'));
  });

  it('"c.js" should not match "*.!(js)"', () => {
    assert(!isMatch('c.js', '*.!(js)'));
  });

  it('"c/a/v" should match "c/!(z)/v"', () => {
    assert(isMatch('c/a/v', 'c/!(z)/v'));
  });

  it('"c/a/v" should not match "c/*(z)/v"', () => {
    assert(!isMatch('c/a/v', 'c/*(z)/v'));
  });

  it('"c/a/v" should not match "c/+(z)/v"', () => {
    assert(!isMatch('c/a/v', 'c/+(z)/v'));
  });

  it('"c/a/v" should not match "c/@(z)/v"', () => {
    assert(!isMatch('c/a/v', 'c/@(z)/v'));
  });

  it('"c/z/v" should not match "*(z)"', () => {
    assert(!isMatch('c/z/v', '*(z)'));
  });

  it('"c/z/v" should not match "+(z)"', () => {
    assert(!isMatch('c/z/v', '+(z)'));
  });

  it('"c/z/v" should not match "?(z)"', () => {
    assert(!isMatch('c/z/v', '?(z)'));
  });

  it('"c/z/v" should not match "c/!(z)/v"', () => {
    assert(!isMatch('c/z/v', 'c/!(z)/v'));
  });

  it('"c/z/v" should match "c/*(z)/v"', () => {
    assert(isMatch('c/z/v', 'c/*(z)/v'));
  });

  it('"c/z/v" should match "c/+(z)/v"', () => {
    assert(isMatch('c/z/v', 'c/+(z)/v'));
  });

  it('"c/z/v" should match "c/@(z)/v"', () => {
    assert(isMatch('c/z/v', 'c/@(z)/v'));
  });

  it('"c/z/v" should match "c/z/v"', () => {
    assert(isMatch('c/z/v', 'c/z/v'));
  });

  it('"cc.a" should not match "(b|a).(a)"', () => {
    assert(!isMatch('cc.a', '(b|a).(a)'));
  });

  it('"cc.a" should not match "@(b|a).@(a)"', () => {
    assert(!isMatch('cc.a', '@(b|a).@(a)'));
  });

  it('"ccc" should match "!(a)*"', () => {
    assert(isMatch('ccc', '!(a)*'));
  });

  it('"ccc" should not match "a!(b)*"', () => {
    assert(!isMatch('ccc', 'a!(b)*'));
  });

  it('"cow" should match "!(*.*)"', () => {
    assert(isMatch('cow', '!(*.*)'));
  });

  it('"cow" should not match "!(*.*)."', () => {
    assert(!isMatch('cow', '!(*.*).'));
  });

  it('"cow" should not match ".!(*.*)"', () => {
    assert(!isMatch('cow', '.!(*.*)'));
  });

  it('"cz" should not match "a!(*)"', () => {
    assert(!isMatch('cz', 'a!(*)'));
  });

  it('"cz" should not match "a!(z)"', () => {
    assert(!isMatch('cz', 'a!(z)'));
  });

  it('"cz" should not match "a*!(z)"', () => {
    assert(!isMatch('cz', 'a*!(z)'));
  });

  it('"cz" should not match "a*(z)"', () => {
    assert(!isMatch('cz', 'a*(z)'));
  });

  it('"cz" should not match "a**(z)"', () => {
    assert(!isMatch('cz', 'a**(z)'));
  });

  it('"cz" should not match "a*@(z)"', () => {
    assert(!isMatch('cz', 'a*@(z)'));
  });

  it('"cz" should not match "a+(z)"', () => {
    assert(!isMatch('cz', 'a+(z)'));
  });

  it('"cz" should not match "a?(z)"', () => {
    assert(!isMatch('cz', 'a?(z)'));
  });

  it('"cz" should not match "a@(z)"', () => {
    assert(!isMatch('cz', 'a@(z)'));
  });

  it('"d.a.d" should not match "!(*.[a-b]*)"', () => {
    assert(!isMatch('d.a.d', '!(*.[a-b]*)'));
  });

  it('"d.a.d" should match "!(*[a-b].[a-b]*)"', () => {
    assert(isMatch('d.a.d', '!(*[a-b].[a-b]*)'));
  });

  it('"d.a.d" should not match "!*.(a|b)*"', () => {
    assert(!isMatch('d.a.d', '!*.(a|b)*'));
  });

  it('"d.a.d" should match "!*.*(a|b)"', () => {
    assert(isMatch('d.a.d', '!*.*(a|b)'));
  });

  it('"d.a.d" should not match "!*.{a,b}*"', () => {
    assert(!isMatch('d.a.d', '!*.{a,b}*'));
  });

  it('"d.a.d" should match "*.!(a)"', () => {
    assert(isMatch('d.a.d', '*.!(a)'));
  });

  it('"d.a.d" should match "*.+(b|d)"', () => {
    assert(isMatch('d.a.d', '*.+(b|d)'));
  });

  it('"d.d" should match "!(*.a|*.b|*.c)"', () => {
    assert(isMatch('d.d', '!(*.a|*.b|*.c)'));
  });

  it('"d.d" should match "*!(.a|.b|.c)"', () => {
    assert(isMatch('d.d', '*!(.a|.b|.c)'));
  });

  it('"d.d" should match "*.!(a|b|c)"', () => {
    assert(isMatch('d.d', '*.!(a|b|c)'));
  });

  it('"d.d" should not match "*.(a|b|@(ab|a*@(b))*(c)d)"', () => {
    assert(!isMatch('d.d', '*.(a|b|@(ab|a*@(b))*(c)d)'));
  });

  it('"d.js.d" should match "!(*.js)"', () => {
    assert(isMatch('d.js.d', '!(*.js)'));
  });

  it('"d.js.d" should match "*!(.js)"', () => {
    assert(isMatch('d.js.d', '*!(.js)'));
  });

  it('"d.js.d" should match "*.!(js)"', () => {
    assert(isMatch('d.js.d', '*.!(js)'));
  });

  it('"dd.aa.d" should not match "(b|a).(a)"', () => {
    assert(!isMatch('dd.aa.d', '(b|a).(a)'));
  });

  it('"dd.aa.d" should not match "@(b|a).@(a)"', () => {
    assert(!isMatch('dd.aa.d', '@(b|a).@(a)'));
  });

  it('"def" should not match "()ef"', () => {
    assert(!isMatch('def', '()ef'));
  });

  it('"e.e" should match "!(*.a|*.b|*.c)"', () => {
    assert(isMatch('e.e', '!(*.a|*.b|*.c)'));
  });

  it('"e.e" should match "*!(.a|.b|.c)"', () => {
    assert(isMatch('e.e', '*!(.a|.b|.c)'));
  });

  it('"e.e" should match "*.!(a|b|c)"', () => {
    assert(isMatch('e.e', '*.!(a|b|c)'));
  });

  it('"e.e" should not match "*.(a|b|@(ab|a*@(b))*(c)d)"', () => {
    assert(!isMatch('e.e', '*.(a|b|@(ab|a*@(b))*(c)d)'));
  });

  it('"ef" should match "()ef"', () => {
    assert(isMatch('ef', '()ef'));
  });

  it('"effgz" should match "@(b+(c)d|e*(f)g?|?(h)i@(j|k))"', () => {
    assert(isMatch('effgz', '@(b+(c)d|e*(f)g?|?(h)i@(j|k))'));
  });

  it('"efgz" should match "@(b+(c)d|e*(f)g?|?(h)i@(j|k))"', () => {
    assert(isMatch('efgz', '@(b+(c)d|e*(f)g?|?(h)i@(j|k))'));
  });

  it('"egz" should match "@(b+(c)d|e*(f)g?|?(h)i@(j|k))"', () => {
    assert(isMatch('egz', '@(b+(c)d|e*(f)g?|?(h)i@(j|k))'));
  });

  it('"egz" should not match "@(b+(c)d|e+(f)g?|?(h)i@(j|k))"', () => {
    assert(!isMatch('egz', '@(b+(c)d|e+(f)g?|?(h)i@(j|k))'));
  });

  it('"egzefffgzbcdij" should match "*(b+(c)d|e*(f)g?|?(h)i@(j|k))"', () => {
    assert(isMatch('egzefffgzbcdij', '*(b+(c)d|e*(f)g?|?(h)i@(j|k))'));
  });

  it('"f" should not match "!(f!(o))"', () => {
    assert(!isMatch('f', '!(f!(o))'));
  });

  it('"f" should match "!(f(o))"', () => {
    assert(isMatch('f', '!(f(o))'));
  });

  it('"f" should not match "!(f)"', () => {
    assert(!isMatch('f', '!(f)'));
  });

  it('"f" should not match "*(!(f))"', () => {
    assert(!isMatch('f', '*(!(f))'));
  });

  it('"f" should not match "+(!(f))"', () => {
    assert(!isMatch('f', '+(!(f))'));
  });

  it('"f.a" should not match "!(*.a|*.b|*.c)"', () => {
    assert(!isMatch('f.a', '!(*.a|*.b|*.c)'));
  });

  it('"f.a" should match "*!(.a|.b|.c)"', () => {
    assert(isMatch('f.a', '*!(.a|.b|.c)'));
  });

  it('"f.a" should not match "*.!(a|b|c)"', () => {
    assert(!isMatch('f.a', '*.!(a|b|c)'));
  });

  it('"f.f" should match "!(*.a|*.b|*.c)"', () => {
    assert(isMatch('f.f', '!(*.a|*.b|*.c)'));
  });

  it('"f.f" should match "*!(.a|.b|.c)"', () => {
    assert(isMatch('f.f', '*!(.a|.b|.c)'));
  });

  it('"f.f" should match "*.!(a|b|c)"', () => {
    assert(isMatch('f.f', '*.!(a|b|c)'));
  });

  it('"f.f" should not match "*.(a|b|@(ab|a*@(b))*(c)d)"', () => {
    assert(!isMatch('f.f', '*.(a|b|@(ab|a*@(b))*(c)d)'));
  });

  it('"fa" should not match "!(f!(o))"', () => {
    assert(!isMatch('fa', '!(f!(o))'));
  });

  it('"fa" should match "!(f(o))"', () => {
    assert(isMatch('fa', '!(f(o))'));
  });

  it('"fb" should not match "!(f!(o))"', () => {
    assert(!isMatch('fb', '!(f!(o))'));
  });

  it('"fb" should match "!(f(o))"', () => {
    assert(isMatch('fb', '!(f(o))'));
  });

  it('"fff" should match "!(f)"', () => {
    assert(isMatch('fff', '!(f)'));
  });

  it('"fff" should match "*(!(f))"', () => {
    assert(isMatch('fff', '*(!(f))'));
  });

  it('"fff" should match "+(!(f))"', () => {
    assert(isMatch('fff', '+(!(f))'));
  });

  it('"fffooofoooooffoofffooofff" should match "*(*(f)*(o))"', () => {
    assert(isMatch('fffooofoooooffoofffooofff', '*(*(f)*(o))'));
  });

  it('"ffo" should match "*(f*(o))"', () => {
    assert(isMatch('ffo', '*(f*(o))'));
  });

  it('"file.C" should not match "*.c?(c)"', () => {
    assert(!isMatch('file.C', '*.c?(c)'));
  });

  it('"file.c" should match "*.c?(c)"', () => {
    assert(isMatch('file.c', '*.c?(c)'));
  });

  it('"file.cc" should match "*.c?(c)"', () => {
    assert(isMatch('file.cc', '*.c?(c)'));
  });

  it('"file.ccc" should not match "*.c?(c)"', () => {
    assert(!isMatch('file.ccc', '*.c?(c)'));
  });

  it('"fo" should match "!(f!(o))"', () => {
    assert(isMatch('fo', '!(f!(o))'));
  });

  it('"fo" should not match "!(f(o))"', () => {
    assert(!isMatch('fo', '!(f(o))'));
  });

  it('"fofo" should match "*(f*(o))"', () => {
    assert(isMatch('fofo', '*(f*(o))'));
  });

  it('"fofoofoofofoo" should match "*(fo|foo)"', () => {
    assert(isMatch('fofoofoofofoo', '*(fo|foo)'));
  });

  it('"fofoofoofofoo" should match "*(fo|foo)"', () => {
    assert(isMatch('fofoofoofofoo', '*(fo|foo)'));
  });

  it('"foo" should match "!(!(foo))"', () => {
    assert(isMatch('foo', '!(!(foo))'));
  });

  it('"foo" should match "!(f)"', () => {
    assert(isMatch('foo', '!(f)'));
  });

  it('"foo" should not match "!(foo)"', () => {
    assert(!isMatch('foo', '!(foo)'));
  });

  it('"foo" should not match "!(foo)*"', () => {
    assert(!isMatch('foo', '!(foo)*'));
  });

  it('"foo" should not match "!(foo)*"', () => {
    assert(!isMatch('foo', '!(foo)*'));
  });

  it('"foo" should not match "!(foo)+"', () => {
    assert(!isMatch('foo', '!(foo)+'));
  });

  it('"foo" should not match "!(foo)b*"', () => {
    assert(!isMatch('foo', '!(foo)b*'));
  });

  it('"foo" should match "!(x)"', () => {
    assert(isMatch('foo', '!(x)'));
  });

  it('"foo" should match "!(x)*"', () => {
    assert(isMatch('foo', '!(x)*'));
  });

  it('"foo" should match "*"', () => {
    assert(isMatch('foo', '*'));
  });

  it('"foo" should match "*(!(f))"', () => {
    assert(isMatch('foo', '*(!(f))'));
  });

  it('"foo" should not match "*(!(foo))"', () => {
    assert(!isMatch('foo', '*(!(foo))'));
  });

  it('"foo" should not match "*(@(a))a@(c)"', () => {
    assert(!isMatch('foo', '*(@(a))a@(c)'));
  });

  it('"foo" should match "*(@(foo))"', () => {
    assert(isMatch('foo', '*(@(foo))'));
  });

  it('"foo" should not match "*(a|b\\[)"', () => {
    assert(!isMatch('foo', '*(a|b\\[)'));
  });

  it('"foo" should match "*(a|b\\[)|f*"', () => {
    assert(isMatch('foo', '*(a|b\\[)|f*'));
  });

  it('"foo" should match "@(*(a|b\\[)|f*)"', () => {
    assert(isMatch('foo', '@(*(a|b\\[)|f*)'));
  });

  it('"foo" should not match "*/*/*"', () => {
    assert(!isMatch('foo', '*/*/*'));
  });

  it('"foo" should not match "*f"', () => {
    assert(!isMatch('foo', '*f'));
  });

  it('"foo" should match "*foo*"', () => {
    assert(isMatch('foo', '*foo*'));
  });

  it('"foo" should match "+(!(f))"', () => {
    assert(isMatch('foo', '+(!(f))'));
  });

  it('"foo" should not match "??"', () => {
    assert(!isMatch('foo', '??'));
  });

  it('"foo" should match "???"', () => {
    assert(isMatch('foo', '???'));
  });

  it('"foo" should not match "bar"', () => {
    assert(!isMatch('foo', 'bar'));
  });

  it('"foo" should match "f*"', () => {
    assert(isMatch('foo', 'f*'));
  });

  it('"foo" should not match "fo"', () => {
    assert(!isMatch('foo', 'fo'));
  });

  it('"foo" should match "foo"', () => {
    assert(isMatch('foo', 'foo'));
  });

  it('"foo" should match "{*(a|b\\[),f*}"', () => {
    assert(isMatch('foo', '{*(a|b\\[),f*}'));
  });

  it('"foo*" should match "foo\\*"', () => {
    assert(isMatch('foo*', 'foo\\*', { windows: false }));
  });

  it('"foo*bar" should match "foo\\*bar"', () => {
    assert(isMatch('foo*bar', 'foo\\*bar'));
  });

  it('"foo.js" should not match "!(foo).js"', () => {
    assert(!isMatch('foo.js', '!(foo).js'));
  });

  it('"foo.js.js" should match "*.!(js)"', () => {
    assert(isMatch('foo.js.js', '*.!(js)'));
  });

  it('"foo.js.js" should not match "*.!(js)*"', () => {
    assert(!isMatch('foo.js.js', '*.!(js)*'));
  });

  it('"foo.js.js" should not match "*.!(js)*.!(js)"', () => {
    assert(!isMatch('foo.js.js', '*.!(js)*.!(js)'));
  });

  it('"foo.js.js" should not match "*.!(js)+"', () => {
    assert(!isMatch('foo.js.js', '*.!(js)+'));
  });

  it('"foo.txt" should match "**/!(bar).txt"', () => {
    assert(isMatch('foo.txt', '**/!(bar).txt'));
  });

  it('"foo/bar" should not match "*/*/*"', () => {
    assert(!isMatch('foo/bar', '*/*/*'));
  });

  it('"foo/bar" should match "foo/!(foo)"', () => {
    assert(isMatch('foo/bar', 'foo/!(foo)'));
  });

  it('"foo/bar" should match "foo/*"', () => {
    assert(isMatch('foo/bar', 'foo/*'));
  });

  it('"foo/bar" should match "foo/bar"', () => {
    assert(isMatch('foo/bar', 'foo/bar'));
  });

  it('"foo/bar" should not match "foo?bar"', () => {
    assert(!isMatch('foo/bar', 'foo?bar'));
  });

  it('"foo/bar" should match "foo[/]bar"', () => {
    assert(isMatch('foo/bar', 'foo[/]bar'));
  });

  it('"foo/bar/baz.jsx" should match "foo/bar/**/*.+(js|jsx)"', () => {
    assert(isMatch('foo/bar/baz.jsx', 'foo/bar/**/*.+(js|jsx)'));
  });

  it('"foo/bar/baz.jsx" should match "foo/bar/*.+(js|jsx)"', () => {
    assert(isMatch('foo/bar/baz.jsx', 'foo/bar/*.+(js|jsx)'));
  });

  it('"foo/bb/aa/rr" should match "**/**/**"', () => {
    assert(isMatch('foo/bb/aa/rr', '**/**/**'));
  });

  it('"foo/bb/aa/rr" should not match "*/*/*"', () => {
    assert(!isMatch('foo/bb/aa/rr', '*/*/*'));
  });

  it('"foo/bba/arr" should match "*/*/*"', () => {
    assert(isMatch('foo/bba/arr', '*/*/*'));
  });

  it('"foo/bba/arr" should not match "foo*"', () => {
    assert(!isMatch('foo/bba/arr', 'foo*'));
  });

  it('"foo/bba/arr" should not match "foo**"', () => {
    assert(!isMatch('foo/bba/arr', 'foo**'));
  });

  it('"foo/bba/arr" should not match "foo/*"', () => {
    assert(!isMatch('foo/bba/arr', 'foo/*'));
  });

  it('"foo/bba/arr" should match "foo/**"', () => {
    assert(isMatch('foo/bba/arr', 'foo/**'));
  });

  it('"foo/bba/arr" should not match "foo/**arr"', () => {
    assert(!isMatch('foo/bba/arr', 'foo/**arr'));
  });

  it('"foo/bba/arr" should not match "foo/**z"', () => {
    assert(!isMatch('foo/bba/arr', 'foo/**z'));
  });

  it('"foo/bba/arr" should not match "foo/*arr"', () => {
    assert(!isMatch('foo/bba/arr', 'foo/*arr'));
  });

  it('"foo/bba/arr" should not match "foo/*z"', () => {
    assert(!isMatch('foo/bba/arr', 'foo/*z'));
  });

  it('"foob" should not match "!(foo)b*"', () => {
    assert(!isMatch('foob', '!(foo)b*'));
  });

  it('"foob" should not match "(foo)bb"', () => {
    assert(!isMatch('foob', '(foo)bb'));
  });

  it('"foobar" should match "!(foo)"', () => {
    assert(isMatch('foobar', '!(foo)'));
  });

  it('"foobar" should not match "!(foo)*"', () => {
    assert(!isMatch('foobar', '!(foo)*'));
  });

  it('"foobar" should not match "!(foo)*"', () => {
    assert(!isMatch('foobar', '!(foo)*'));
  });

  it('"foobar" should not match "!(foo)b*"', () => {
    assert(!isMatch('foobar', '!(foo)b*'));
  });

  it('"foobar" should match "*(!(foo))"', () => {
    assert(isMatch('foobar', '*(!(foo))'));
  });

  it('"foobar" should match "*ob*a*r*"', () => {
    assert(isMatch('foobar', '*ob*a*r*'));
  });

  it('"foobar" should not match "foo\\*bar"', () => {
    assert(!isMatch('foobar', 'foo\\*bar'));
  });

  it('"foobb" should not match "!(foo)b*"', () => {
    assert(!isMatch('foobb', '!(foo)b*'));
  });

  it('"foobb" should match "(foo)bb"', () => {
    assert(isMatch('foobb', '(foo)bb'));
  });

  it('"(foo)bb" should match "\\(foo\\)bb"', () => {
    assert(isMatch('(foo)bb', '\\(foo\\)bb'));
  });

  it('"foofoofo" should match "@(foo|f|fo)*(f|of+(o))"', () => {
    assert(isMatch('foofoofo', '@(foo|f|fo)*(f|of+(o))'));
  });

  it('"foofoofo" should match "@(foo|f|fo)*(f|of+(o))"', () => {
    assert(isMatch('foofoofo', '@(foo|f|fo)*(f|of+(o))'));
  });

  it('"fooofoofofooo" should match "*(f*(o))"', () => {
    assert(isMatch('fooofoofofooo', '*(f*(o))'));
  });

  it('"foooofo" should match "*(f*(o))"', () => {
    assert(isMatch('foooofo', '*(f*(o))'));
  });

  it('"foooofof" should match "*(f*(o))"', () => {
    assert(isMatch('foooofof', '*(f*(o))'));
  });

  it('"foooofof" should not match "*(f+(o))"', () => {
    assert(!isMatch('foooofof', '*(f+(o))'));
  });

  it('"foooofofx" should not match "*(f*(o))"', () => {
    assert(!isMatch('foooofofx', '*(f*(o))'));
  });

  it('"foooxfooxfoxfooox" should match "*(f*(o)x)"', () => {
    assert(isMatch('foooxfooxfoxfooox', '*(f*(o)x)'));
  });

  it('"foooxfooxfxfooox" should match "*(f*(o)x)"', () => {
    assert(isMatch('foooxfooxfxfooox', '*(f*(o)x)'));
  });

  it('"foooxfooxofoxfooox" should not match "*(f*(o)x)"', () => {
    assert(!isMatch('foooxfooxofoxfooox', '*(f*(o)x)'));
  });

  it('"foot" should match "@(!(z*)|*x)"', () => {
    assert(isMatch('foot', '@(!(z*)|*x)'));
  });

  it('"foox" should match "@(!(z*)|*x)"', () => {
    assert(isMatch('foox', '@(!(z*)|*x)'));
  });

  it('"fz" should not match "*(z)"', () => {
    assert(!isMatch('fz', '*(z)'));
  });

  it('"fz" should not match "+(z)"', () => {
    assert(!isMatch('fz', '+(z)'));
  });

  it('"fz" should not match "?(z)"', () => {
    assert(!isMatch('fz', '?(z)'));
  });

  it('"moo.cow" should not match "!(moo).!(cow)"', () => {
    assert(!isMatch('moo.cow', '!(moo).!(cow)'));
  });

  it('"moo.cow" should not match "!(*).!(*)"', () => {
    assert(!isMatch('moo.cow', '!(*).!(*)'));
  });

  it('"moo.cow" should not match "!(*.*).!(*.*)"', () => {
    assert(!isMatch('moo.cow', '!(*.*).!(*.*)'));
  });

  it('"mad.moo.cow" should not match "!(*.*).!(*.*)"', () => {
    assert(!isMatch('mad.moo.cow', '!(*.*).!(*.*)'));
  });

  it('"mad.moo.cow" should not match ".!(*.*)"', () => {
    assert(!isMatch('mad.moo.cow', '.!(*.*)'));
  });

  it('"Makefile" should match "!(*.c|*.h|Makefile.in|config*|README)"', () => {
    assert(isMatch('Makefile', '!(*.c|*.h|Makefile.in|config*|README)'));
  });

  it('"Makefile.in" should not match "!(*.c|*.h|Makefile.in|config*|README)"', () => {
    assert(!isMatch('Makefile.in', '!(*.c|*.h|Makefile.in|config*|README)'));
  });

  it('"moo" should match "!(*.*)"', () => {
    assert(isMatch('moo', '!(*.*)'));
  });

  it('"moo" should not match "!(*.*)."', () => {
    assert(!isMatch('moo', '!(*.*).'));
  });

  it('"moo" should not match ".!(*.*)"', () => {
    assert(!isMatch('moo', '.!(*.*)'));
  });

  it('"moo.cow" should not match "!(*.*)"', () => {
    assert(!isMatch('moo.cow', '!(*.*)'));
  });

  it('"moo.cow" should not match "!(*.*)."', () => {
    assert(!isMatch('moo.cow', '!(*.*).'));
  });

  it('"moo.cow" should not match ".!(*.*)"', () => {
    assert(!isMatch('moo.cow', '.!(*.*)'));
  });

  it('"mucca.pazza" should not match "mu!(*(c))?.pa!(*(z))?"', () => {
    assert(!isMatch('mucca.pazza', 'mu!(*(c))?.pa!(*(z))?'));
  });

  it('"ofoofo" should match "*(of+(o))"', () => {
    assert(isMatch('ofoofo', '*(of+(o))'));
  });

  it('"ofoofo" should match "*(of+(o)|f)"', () => {
    assert(isMatch('ofoofo', '*(of+(o)|f)'));
  });

  it('"ofooofoofofooo" should not match "*(f*(o))"', () => {
    assert(!isMatch('ofooofoofofooo', '*(f*(o))'));
  });

  it('"ofoooxoofxo" should match "*(*(of*(o)x)o)"', () => {
    assert(isMatch('ofoooxoofxo', '*(*(of*(o)x)o)'));
  });

  it('"ofoooxoofxoofoooxoofxo" should match "*(*(of*(o)x)o)"', () => {
    assert(isMatch('ofoooxoofxoofoooxoofxo', '*(*(of*(o)x)o)'));
  });

  it('"ofoooxoofxoofoooxoofxofo" should not match "*(*(of*(o)x)o)"', () => {
    assert(!isMatch('ofoooxoofxoofoooxoofxofo', '*(*(of*(o)x)o)'));
  });

  it('"ofoooxoofxoofoooxoofxoo" should match "*(*(of*(o)x)o)"', () => {
    assert(isMatch('ofoooxoofxoofoooxoofxoo', '*(*(of*(o)x)o)'));
  });

  it('"ofoooxoofxoofoooxoofxooofxofxo" should match "*(*(of*(o)x)o)"', () => {
    assert(isMatch('ofoooxoofxoofoooxoofxooofxofxo', '*(*(of*(o)x)o)'));
  });

  it('"ofxoofxo" should match "*(*(of*(o)x)o)"', () => {
    assert(isMatch('ofxoofxo', '*(*(of*(o)x)o)'));
  });

  it('"oofooofo" should match "*(of|oof+(o))"', () => {
    assert(isMatch('oofooofo', '*(of|oof+(o))'));
  });

  it('"ooo" should match "!(f)"', () => {
    assert(isMatch('ooo', '!(f)'));
  });

  it('"ooo" should match "*(!(f))"', () => {
    assert(isMatch('ooo', '*(!(f))'));
  });

  it('"ooo" should match "+(!(f))"', () => {
    assert(isMatch('ooo', '+(!(f))'));
  });

  it('"oxfoxfox" should not match "*(oxf+(ox))"', () => {
    assert(!isMatch('oxfoxfox', '*(oxf+(ox))'));
  });

  it('"oxfoxoxfox" should match "*(oxf+(ox))"', () => {
    assert(isMatch('oxfoxoxfox', '*(oxf+(ox))'));
  });

  it('"para" should match "para*([0-9])"', () => {
    assert(isMatch('para', 'para*([0-9])'));
  });

  it('"para" should not match "para+([0-9])"', () => {
    assert(!isMatch('para', 'para+([0-9])'));
  });

  it('"para.38" should match "para!(*.[00-09])"', () => {
    assert(isMatch('para.38', 'para!(*.[00-09])'));
  });

  it('"para.graph" should match "para!(*.[0-9])"', () => {
    assert(isMatch('para.graph', 'para!(*.[0-9])'));
  });

  it('"para13829383746592" should match "para*([0-9])"', () => {
    assert(isMatch('para13829383746592', 'para*([0-9])'));
  });

  it('"para381" should not match "para?([345]|99)1"', () => {
    assert(!isMatch('para381', 'para?([345]|99)1'));
  });

  it('"para39" should match "para!(*.[0-9])"', () => {
    assert(isMatch('para39', 'para!(*.[0-9])'));
  });

  it('"para987346523" should match "para+([0-9])"', () => {
    assert(isMatch('para987346523', 'para+([0-9])'));
  });

  it('"para991" should match "para?([345]|99)1"', () => {
    assert(isMatch('para991', 'para?([345]|99)1'));
  });

  it('"paragraph" should match "para!(*.[0-9])"', () => {
    assert(isMatch('paragraph', 'para!(*.[0-9])'));
  });

  it('"paragraph" should not match "para*([0-9])"', () => {
    assert(!isMatch('paragraph', 'para*([0-9])'));
  });

  it('"paragraph" should match "para@(chute|graph)"', () => {
    assert(isMatch('paragraph', 'para@(chute|graph)'));
  });

  it('"paramour" should not match "para@(chute|graph)"', () => {
    assert(!isMatch('paramour', 'para@(chute|graph)'));
  });

  it('"parse.y" should match "!(*.c|*.h|Makefile.in|config*|README)"', () => {
    assert(isMatch('parse.y', '!(*.c|*.h|Makefile.in|config*|README)'));
  });

  it('"shell.c" should not match "!(*.c|*.h|Makefile.in|config*|README)"', () => {
    assert(!isMatch('shell.c', '!(*.c|*.h|Makefile.in|config*|README)'));
  });

  it('"VMS.FILE;" should not match "*\\;[1-9]*([0-9])"', () => {
    assert(!isMatch('VMS.FILE;', '*\\;[1-9]*([0-9])'));
  });

  it('"VMS.FILE;0" should not match "*\\;[1-9]*([0-9])"', () => {
    assert(!isMatch('VMS.FILE;0', '*\\;[1-9]*([0-9])'));
  });

  it('"VMS.FILE;9" should match "*\\;[1-9]*([0-9])"', () => {
    assert(isMatch('VMS.FILE;9', '*\\;[1-9]*([0-9])'));
  });

  it('"VMS.FILE;1" should match "*\\;[1-9]*([0-9])"', () => {
    assert(isMatch('VMS.FILE;1', '*\\;[1-9]*([0-9])'));
  });

  it('"VMS.FILE;1" should match "*;[1-9]*([0-9])"', () => {
    assert(isMatch('VMS.FILE;1', '*;[1-9]*([0-9])'));
  });

  it('"VMS.FILE;139" should match "*\\;[1-9]*([0-9])"', () => {
    assert(isMatch('VMS.FILE;139', '*\\;[1-9]*([0-9])'));
  });

  it('"VMS.FILE;1N" should not match "*\\;[1-9]*([0-9])"', () => {
    assert(!isMatch('VMS.FILE;1N', '*\\;[1-9]*([0-9])'));
  });

  it('"xfoooofof" should not match "*(f*(o))"', () => {
    assert(!isMatch('xfoooofof', '*(f*(o))'));
  });

  it('"XXX/adobe/courier/bold/o/normal//12/120/75/75/m/70/iso8859/1" should match "XXX/*/*/*/*/*/*/12/*/*/*/m/*/*/*"', () => {
    assert(isMatch('XXX/adobe/courier/bold/o/normal//12/120/75/75/m/70/iso8859/1', 'XXX/*/*/*/*/*/*/12/*/*/*/m/*/*/*', { windows: false }));
  });

  it('"XXX/adobe/courier/bold/o/normal//12/120/75/75/X/70/iso8859/1" should not match "XXX/*/*/*/*/*/*/12/*/*/*/m/*/*/*"', () => {
    assert(!isMatch('XXX/adobe/courier/bold/o/normal//12/120/75/75/X/70/iso8859/1', 'XXX/*/*/*/*/*/*/12/*/*/*/m/*/*/*'));
  });

  it('"z" should match "*(z)"', () => {
    assert(isMatch('z', '*(z)'));
  });

  it('"z" should match "+(z)"', () => {
    assert(isMatch('z', '+(z)'));
  });

  it('"z" should match "?(z)"', () => {
    assert(isMatch('z', '?(z)'));
  });

  it('"zf" should not match "*(z)"', () => {
    assert(!isMatch('zf', '*(z)'));
  });

  it('"zf" should not match "+(z)"', () => {
    assert(!isMatch('zf', '+(z)'));
  });

  it('"zf" should not match "?(z)"', () => {
    assert(!isMatch('zf', '?(z)'));
  });

  it('"zoot" should not match "@(!(z*)|*x)"', () => {
    assert(!isMatch('zoot', '@(!(z*)|*x)'));
  });

  it('"zoox" should match "@(!(z*)|*x)"', () => {
    assert(isMatch('zoox', '@(!(z*)|*x)'));
  });

  it('"zz" should not match "(a+|b)*"', () => {
    assert(!isMatch('zz', '(a+|b)*'));
  });
});
