'use strict';

const assert = require('assert');
const mm = require('..');
const { isMatch } = mm;

/**
 * Most of these tests were converted directly from bash 4.3 and 4.4 unit tests.
 */

describe('extglobs', () => {
  it('should throw on imbalanced sets when `options.strictBrackets` is true', () => {
    assert.throws(() => mm.makeRe('a(b', { strictBrackets: true }), /missing closing: "\)"/i);
    assert.throws(() => mm.makeRe('a)b', { strictBrackets: true }), /missing opening: "\("/i);
  });

  it('should match extglobs ending with statechar', () => {
    assert(!isMatch('ax', 'a?(b*)'));
    assert(isMatch('ax', '?(a*|b)'));
  });

  it('should not choke on non-extglobs', () => {
    assert(isMatch('c/z/v', 'c/z/v'));
  });

  it('should work with file extensions', () => {
    assert(!isMatch('.md', '@(a|b).md'));
    assert(!isMatch('a.js', '@(a|b).md'));
    assert(isMatch('a.md', '@(a|b).md'));
    assert(isMatch('b.md', '@(a|b).md'));
    assert(!isMatch('c.md', '@(a|b).md'));

    assert(!isMatch('.md', '+(a|b).md'));
    assert(!isMatch('a.js', '+(a|b).md'));
    assert(isMatch('a.md', '+(a|b).md'));
    assert(isMatch('aa.md', '+(a|b).md'));
    assert(isMatch('ab.md', '+(a|b).md'));
    assert(isMatch('b.md', '+(a|b).md'));
    assert(isMatch('bb.md', '+(a|b).md'));
    assert(!isMatch('c.md', '+(a|b).md'));

    assert(isMatch('.md', '*(a|b).md'));
    assert(!isMatch('a.js', '*(a|b).md'));
    assert(isMatch('a.md', '*(a|b).md'));
    assert(isMatch('aa.md', '*(a|b).md'));
    assert(isMatch('ab.md', '*(a|b).md'));
    assert(isMatch('b.md', '*(a|b).md'));
    assert(isMatch('bb.md', '*(a|b).md'));
    assert(!isMatch('c.md', '*(a|b).md'));
  });

  it('should support !(...)', () => {
    // these are correct, since * is greedy and matches before ! can negate
    assert(isMatch('file.txt', '*!(.jpg|.gif)'));
    assert(isMatch('file.jpg', '*!(.jpg|.gif)'));
    assert(isMatch('file.gif', '*!(.jpg|.gif)'));

    // this is how you negate extensions
    assert(!isMatch('file.jpg', '!(*.jpg|*.gif)'));
    assert(!isMatch('file.gif', '!(*.jpg|*.gif)'));

    assert(!isMatch('moo.cow', '!(moo).!(cow)'));
    assert(!isMatch('foo.cow', '!(moo).!(cow)'));
    assert(!isMatch('moo.bar', '!(moo).!(cow)'));
    assert(isMatch('foo.bar', '!(moo).!(cow)'));
    assert(isMatch('moo.cow', '!(!(moo)).!(!(cow))'));
    assert(isMatch('moo.bar', '@(moo).!(cow)'));
    assert(isMatch('moomoo.bar', '+(moo).!(cow)'));
    assert(isMatch('moomoo.bar', '+(moo)*(foo).!(cow)'));
    assert(isMatch('moomoofoo.bar', '+(moo)*(foo).!(cow)'));
    assert(isMatch('moomoofoofoo.bar', '+(moo)*(foo).!(cow)'));
    assert(!isMatch('c/z/v', 'c/!(z)/v'));
    assert(isMatch('c/a/v', 'c/!(z)/v'));

    assert(!isMatch('c/z', 'a!(z)'));
    assert(isMatch('abz', 'a!(z)'));
    assert(!isMatch('az', 'a!(z)'));

    assert(!isMatch('a/z', 'a/!(z)'));
    assert(isMatch('a/b', 'a/!(z)'));

    assert(!isMatch('c/z', 'a*!(z)'));
    assert(isMatch('abz', 'a*!(z)'));
    assert(isMatch('az', 'a*!(z)'));

    assert(isMatch('a/a', '!(b/a)'));
    assert(isMatch('a/b', '!(b/a)'));
    assert(isMatch('a/c', '!(b/a)'));
    assert(!isMatch('b/a', '!(b/a)'));
    assert(isMatch('b/b', '!(b/a)'));
    assert(isMatch('b/c', '!(b/a)'));

    assert(isMatch('a/a', '!(b/a)'));
    assert(isMatch('a/b', '!(b/a)'));
    assert(isMatch('a/c', '!(b/a)'));
    assert(!isMatch('b/a', '!(b/a)'));
    assert(isMatch('b/b', '!(b/a)'));
    assert(isMatch('b/c', '!(b/a)'));

    assert(isMatch('a/a', '!((b/a))'));
    assert(isMatch('a/b', '!((b/a))'));
    assert(isMatch('a/c', '!((b/a))'));
    assert(!isMatch('b/a', '!((b/a))'));
    assert(isMatch('b/b', '!((b/a))'));
    assert(isMatch('b/c', '!((b/a))'));

    assert(isMatch('a/a', '!((?:b/a))'));
    assert(isMatch('a/b', '!((?:b/a))'));
    assert(isMatch('a/c', '!((?:b/a))'));
    assert(!isMatch('b/a', '!((?:b/a))'));
    assert(isMatch('b/b', '!((?:b/a))'));
    assert(isMatch('b/c', '!((?:b/a))'));

    assert(isMatch('a/a', '!(b/(a))'));
    assert(isMatch('a/b', '!(b/(a))'));
    assert(isMatch('a/c', '!(b/(a))'));
    assert(!isMatch('b/a', '!(b/(a))'));
    assert(isMatch('b/b', '!(b/(a))'));
    assert(isMatch('b/c', '!(b/(a))'));

    assert(isMatch('a/a', '!(b/a)'));
    assert(isMatch('a/b', '!(b/a)'));
    assert(isMatch('a/c', '!(b/a)'));
    assert(!isMatch('b/a', '!(b/a)'));
    assert(isMatch('b/b', '!(b/a)'));
    assert(isMatch('b/c', '!(b/a)'));

    assert(!isMatch('a   ', '@(!(a) )*'));
    assert(!isMatch('a   b', '@(!(a) )*'));
    assert(!isMatch('a  b', '@(!(a) )*'));
    assert(!isMatch('a  ', '@(!(a) )*'));
    assert(!isMatch('a ', '@(!(a) )*'));
    assert(!isMatch('a', '@(!(a) )*'));
    assert(!isMatch('aa', '@(!(a) )*'));
    assert(!isMatch('b', '@(!(a) )*'));
    assert(!isMatch('bb', '@(!(a) )*'));
    assert(isMatch(' a ', '@(!(a) )*'));
    assert(isMatch('b  ', '@(!(a) )*'));
    assert(isMatch('b ', '@(!(a) )*'));

    assert(!isMatch('a', '!(a)'));
    assert(isMatch('aa', '!(a)'));
    assert(isMatch('b', '!(a)'));

    assert(!isMatch('a', '!(a*)'));
    assert(!isMatch('aa', '!(a*)'));
    assert(!isMatch('ab', '!(a*)'));
    assert(isMatch('b', '!(a*)'));

    assert(!isMatch('a', '!(*a*)'));
    assert(!isMatch('aa', '!(*a*)'));
    assert(!isMatch('ab', '!(*a*)'));
    assert(!isMatch('ac', '!(*a*)'));
    assert(isMatch('b', '!(*a*)'));

    assert(!isMatch('a', '!(*a)'));
    assert(!isMatch('aa', '!(*a)'));
    assert(!isMatch('bba', '!(*a)'));
    assert(isMatch('ab', '!(*a)'));
    assert(isMatch('ac', '!(*a)'));
    assert(isMatch('b', '!(*a)'));

    assert(!isMatch('a', '!(*a)*'));
    assert(!isMatch('aa', '!(*a)*'));
    assert(!isMatch('bba', '!(*a)*'));
    assert(!isMatch('ab', '!(*a)*'));
    assert(!isMatch('ac', '!(*a)*'));
    assert(isMatch('b', '!(*a)*'));

    assert(!isMatch('a', '!(a)*'));
    assert(!isMatch('abb', '!(a)*'));
    assert(isMatch('ba', '!(a)*'));

    assert(isMatch('aa', 'a!(b)*'));
    assert(!isMatch('ab', 'a!(b)*'));
    assert(!isMatch('aba', 'a!(b)*'));
    assert(isMatch('ac', 'a!(b)*'));

    assert(isMatch('aac', 'a!(b)c'));
    assert(!isMatch('abc', 'a!(b)c'));
    assert(isMatch('acc', 'a!(b)c'));

    assert(!isMatch('a.c', 'a!(.)c'));
    assert(isMatch('abc', 'a!(.)c'));
  });

  it('should support logical-or inside negation !(...) extglobs', () => {
    assert(!isMatch('ac', '!(a|b)c'));
    assert(!isMatch('bc', '!(a|b)c'));
    assert(isMatch('cc', '!(a|b)c'));
  });

  it('should support multiple negation !(...) extglobs in one expression', () => {
    assert(!isMatch('ac.d', '!(a|b)c.!(d|e)'));
    assert(!isMatch('bc.d', '!(a|b)c.!(d|e)'));
    assert(!isMatch('cc.d', '!(a|b)c.!(d|e)'));
    assert(!isMatch('ac.e', '!(a|b)c.!(d|e)'));
    assert(!isMatch('bc.e', '!(a|b)c.!(d|e)'));
    assert(!isMatch('cc.e', '!(a|b)c.!(d|e)'));
    assert(!isMatch('ac.f', '!(a|b)c.!(d|e)'));
    assert(!isMatch('bc.f', '!(a|b)c.!(d|e)'));
    assert(isMatch('cc.f', '!(a|b)c.!(d|e)'));
    assert(isMatch('dc.g', '!(a|b)c.!(d|e)'));
  });

  it('should support nested negation !(...) extglobs', () => {
    assert(isMatch('ac.d', '!(!(a|b)c.!(d|e))'));
    assert(isMatch('bc.d', '!(!(a|b)c.!(d|e))'));
    assert(!isMatch('cc.d', '!(a|b)c.!(d|e)'));
    assert(isMatch('cc.d', '!(!(a|b)c.!(d|e))'));
    assert(isMatch('cc.d', '!(!(a|b)c.!(d|e))'));
    assert(isMatch('ac.e', '!(!(a|b)c.!(d|e))'));
    assert(isMatch('bc.e', '!(!(a|b)c.!(d|e))'));
    assert(isMatch('cc.e', '!(!(a|b)c.!(d|e))'));
    assert(isMatch('ac.f', '!(!(a|b)c.!(d|e))'));
    assert(isMatch('bc.f', '!(!(a|b)c.!(d|e))'));
    assert(!isMatch('cc.f', '!(!(a|b)c.!(d|e))'));
    assert(!isMatch('dc.g', '!(!(a|b)c.!(d|e))'));
  });

  it('should support *(...)', () => {
    assert(isMatch('a', 'a*(z)'));
    assert(isMatch('az', 'a*(z)'));
    assert(isMatch('azz', 'a*(z)'));
    assert(isMatch('azzz', 'a*(z)'));
    assert(!isMatch('abz', 'a*(z)'));
    assert(!isMatch('cz', 'a*(z)'));

    assert(!isMatch('a/a', '*(b/a)'));
    assert(!isMatch('a/b', '*(b/a)'));
    assert(!isMatch('a/c', '*(b/a)'));
    assert(isMatch('b/a', '*(b/a)'));
    assert(!isMatch('b/b', '*(b/a)'));
    assert(!isMatch('b/c', '*(b/a)'));

    assert(!isMatch('cz', 'a**(z)'));
    assert(isMatch('abz', 'a**(z)'));
    assert(isMatch('az', 'a**(z)'));

    assert(!isMatch('c/z/v', '*(z)'));
    assert(isMatch('z', '*(z)'));
    assert(!isMatch('zf', '*(z)'));
    assert(!isMatch('fz', '*(z)'));

    assert(!isMatch('c/a/v', 'c/*(z)/v'));
    assert(isMatch('c/z/v', 'c/*(z)/v'));

    assert(!isMatch('a.md.js', '*.*(js).js'));
    assert(isMatch('a.js.js', '*.*(js).js'));
  });

  it('should support +(...) extglobs', () => {
    assert(!isMatch('a', 'a+(z)'));
    assert(isMatch('az', 'a+(z)'));
    assert(!isMatch('cz', 'a+(z)'));
    assert(!isMatch('abz', 'a+(z)'));
    assert(!isMatch('a+z', 'a+(z)'));
    assert(isMatch('a+z', 'a++(z)'));
    assert(!isMatch('c+z', 'a+(z)'));
    assert(!isMatch('a+bz', 'a+(z)'));
    assert(!isMatch('az', '+(z)'));
    assert(!isMatch('cz', '+(z)'));
    assert(!isMatch('abz', '+(z)'));
    assert(!isMatch('fz', '+(z)'));
    assert(isMatch('z', '+(z)'));
    assert(isMatch('zz', '+(z)'));
    assert(isMatch('c/z/v', 'c/+(z)/v'));
    assert(isMatch('c/zz/v', 'c/+(z)/v'));
    assert(!isMatch('c/a/v', 'c/+(z)/v'));
  });

  it('should support ?(...) extglobs', () => {
    assert(isMatch('a?z', 'a??(z)'));

    assert(!isMatch('a?z', 'a?(z)'));
    assert(!isMatch('abz', 'a?(z)'));
    assert(!isMatch('z', 'a?(z)'));
    assert(isMatch('a', 'a?(z)'));
    assert(isMatch('az', 'a?(z)'));

    assert(!isMatch('abz', '?(z)'));
    assert(!isMatch('az', '?(z)'));
    assert(!isMatch('cz', '?(z)'));
    assert(!isMatch('fz', '?(z)'));
    assert(!isMatch('zz', '?(z)'));
    assert(isMatch('z', '?(z)'));

    assert(!isMatch('c/a/v', 'c/?(z)/v'));
    assert(!isMatch('c/zz/v', 'c/?(z)/v'));
    assert(isMatch('c/z/v', 'c/?(z)/v'));
  });

  it('should support @(...) extglobs', () => {
    assert(isMatch('c/z/v', 'c/@(z)/v'));
    assert(!isMatch('c/a/v', 'c/@(z)/v'));
    assert(isMatch('moo.cow', '@(*.*)'));

    assert(!isMatch('cz', 'a*@(z)'));
    assert(isMatch('abz', 'a*@(z)'));
    assert(isMatch('az', 'a*@(z)'));

    assert(!isMatch('cz', 'a@(z)'));
    assert(!isMatch('abz', 'a@(z)'));
    assert(isMatch('az', 'a@(z)'));
  });

  it('should support qmark matching', () => {
    assert(isMatch('a', '?'));
    assert(!isMatch('aa', '?'));
    assert(!isMatch('ab', '?'));
    assert(!isMatch('aaa', '?'));
    assert(!isMatch('abcdefg', '?'));

    assert(!isMatch('a', '??'));
    assert(isMatch('aa', '??'));
    assert(isMatch('ab', '??'));
    assert(!isMatch('aaa', '??'));
    assert(!isMatch('abcdefg', '??'));

    assert(!isMatch('a', '???'));
    assert(!isMatch('aa', '???'));
    assert(!isMatch('ab', '???'));
    assert(isMatch('aaa', '???'));
    assert(!isMatch('abcdefg', '???'));
  });

  it('should match exactly one of the given pattern:', () => {
    assert(!isMatch('aa.aa', '(b|a).(a)'));
    assert(!isMatch('a.bb', '(b|a).(a)'));
    assert(!isMatch('a.aa.a', '(b|a).(a)'));
    assert(!isMatch('cc.a', '(b|a).(a)'));
    assert(isMatch('a.a', '(b|a).(a)'));
    assert(!isMatch('c.a', '(b|a).(a)'));
    assert(!isMatch('dd.aa.d', '(b|a).(a)'));
    assert(isMatch('b.a', '(b|a).(a)'));

    assert(!isMatch('aa.aa', '@(b|a).@(a)'));
    assert(!isMatch('a.bb', '@(b|a).@(a)'));
    assert(!isMatch('a.aa.a', '@(b|a).@(a)'));
    assert(!isMatch('cc.a', '@(b|a).@(a)'));
    assert(isMatch('a.a', '@(b|a).@(a)'));
    assert(!isMatch('c.a', '@(b|a).@(a)'));
    assert(!isMatch('dd.aa.d', '@(b|a).@(a)'));
    assert(isMatch('b.a', '@(b|a).@(a)'));
  });

  it('should pass tests from rosenblatt\'s korn shell book', () => {
    assert(!isMatch('', '*(0|1|3|5|7|9)')); // only one that disagrees, since we don't match empty strings
    assert(isMatch('137577991', '*(0|1|3|5|7|9)'));
    assert(!isMatch('2468', '*(0|1|3|5|7|9)'));

    assert(isMatch('file.c', '*.c?(c)'));
    assert(!isMatch('file.C', '*.c?(c)'));
    assert(isMatch('file.cc', '*.c?(c)'));
    assert(!isMatch('file.ccc', '*.c?(c)'));

    assert(isMatch('parse.y', '!(*.c|*.h|Makefile.in|config*|README)'));
    assert(!isMatch('shell.c', '!(*.c|*.h|Makefile.in|config*|README)'));
    assert(isMatch('Makefile', '!(*.c|*.h|Makefile.in|config*|README)'));
    assert(!isMatch('Makefile.in', '!(*.c|*.h|Makefile.in|config*|README)'));

    assert(!isMatch('VMS.FILE;', '*\\;[1-9]*([0-9])'));
    assert(!isMatch('VMS.FILE;0', '*\\;[1-9]*([0-9])'));
    assert(isMatch('VMS.FILE;1', '*\\;[1-9]*([0-9])'));
    assert(isMatch('VMS.FILE;139', '*\\;[1-9]*([0-9])'));
    assert(!isMatch('VMS.FILE;1N', '*\\;[1-9]*([0-9])'));
  });

  it('tests derived from the pd-ksh test suite', () => {
    assert(isMatch('abcx', '!([*)*'));
    assert(isMatch('abcz', '!([*)*'));
    assert(isMatch('bbc', '!([*)*'));

    assert(isMatch('abcx', '!([[*])*'));
    assert(isMatch('abcz', '!([[*])*'));
    assert(isMatch('bbc', '!([[*])*'));

    assert(isMatch('abcx', '+(a|b\\[)*'));
    assert(isMatch('abcz', '+(a|b\\[)*'));
    assert(!isMatch('bbc', '+(a|b\\[)*'));

    assert(isMatch('abcx', '+(a|b[)*'));
    assert(isMatch('abcz', '+(a|b[)*'));
    assert(!isMatch('bbc', '+(a|b[)*'));

    assert(!isMatch('abcx', '[a*(]*z'));
    assert(isMatch('abcz', '[a*(]*z'));
    assert(!isMatch('bbc', '[a*(]*z'));
    assert(isMatch('aaz', '[a*(]*z'));
    assert(isMatch('aaaz', '[a*(]*z'));

    assert(!isMatch('abcx', '[a*(]*)z'));
    assert(!isMatch('abcz', '[a*(]*)z'));
    assert(!isMatch('bbc', '[a*(]*)z'));

    assert(!isMatch('abc', '+()c'));
    assert(!isMatch('abc', '+()x'));
    assert(isMatch('abc', '+(*)c'));
    assert(!isMatch('abc', '+(*)x'));
    assert(!isMatch('abc', 'no-file+(a|b)stuff'));
    assert(!isMatch('abc', 'no-file+(a*(c)|b)stuff'));

    assert(isMatch('abd', 'a+(b|c)d'));
    assert(isMatch('acd', 'a+(b|c)d'));

    assert(!isMatch('abc', 'a+(b|c)d'));

    assert(isMatch('abd', 'a!(@(b|B))'));
    assert(isMatch('acd', 'a!(@(b|B))'));
    assert(isMatch('ac', 'a!(@(b|B))'));
    assert(!isMatch('ab', 'a!(@(b|B))'));

    assert(!isMatch('abc', 'a!(@(b|B))d'));
    assert(!isMatch('abd', 'a!(@(b|B))d'));
    assert(isMatch('acd', 'a!(@(b|B))d'));

    assert(isMatch('abd', 'a[b*(foo|bar)]d'));
    assert(!isMatch('abc', 'a[b*(foo|bar)]d'));
    assert(!isMatch('acd', 'a[b*(foo|bar)]d'));
  });

  it('stuff from korn\'s book', () => {
    assert(!isMatch('para', 'para+([0-9])'));
    assert(!isMatch('para381', 'para?([345]|99)1'));
    assert(!isMatch('paragraph', 'para*([0-9])'));
    assert(!isMatch('paramour', 'para@(chute|graph)'));
    assert(isMatch('para', 'para*([0-9])'));
    assert(isMatch('para.38', 'para!(*.[0-9])'));
    assert(isMatch('para.38', 'para!(*.[00-09])'));
    assert(isMatch('para.graph', 'para!(*.[0-9])'));
    assert(isMatch('para13829383746592', 'para*([0-9])'));
    assert(isMatch('para39', 'para!(*.[0-9])'));
    assert(isMatch('para987346523', 'para+([0-9])'));
    assert(isMatch('para991', 'para?([345]|99)1'));
    assert(isMatch('paragraph', 'para!(*.[0-9])'));
    assert(isMatch('paragraph', 'para@(chute|graph)'));
  });

  it('simple kleene star tests', () => {
    assert(!isMatch('foo', '*(a|b[)'));
    assert(!isMatch('(', '*(a|b[)'));
    assert(!isMatch(')', '*(a|b[)'));
    assert(!isMatch('|', '*(a|b[)'));
    assert(isMatch('a', '*(a|b)'));
    assert(isMatch('b', '*(a|b)'));
    assert(isMatch('b[', '*(a|b\\[)'));
    assert(isMatch('ab[', '+(a|b\\[)'));
    assert(!isMatch('ab[cde', '+(a|b\\[)'));
    assert(isMatch('ab[cde', '+(a|b\\[)*'));

    assert(isMatch('foo', '*(a|b|f)*'));
    assert(isMatch('foo', '*(a|b|o)*'));
    assert(isMatch('foo', '*(a|b|f|o)'));
    assert(isMatch('*(a|b[)', '\\*\\(a\\|b\\[\\)'));
    assert(!isMatch('foo', '*(a|b)'));
    assert(!isMatch('foo', '*(a|b\\[)'));
    assert(isMatch('foo', '*(a|b\\[)|f*'));
  });

  it('should support multiple extglobs:', () => {
    assert(isMatch('moo.cow', '@(*).@(*)'));
    assert(isMatch('a.a', '*.@(a|b|@(ab|a*@(b))*@(c)d)'));
    assert(isMatch('a.b', '*.@(a|b|@(ab|a*@(b))*@(c)d)'));
    assert(!isMatch('a.c', '*.@(a|b|@(ab|a*@(b))*@(c)d)'));
    assert(!isMatch('a.c.d', '*.@(a|b|@(ab|a*@(b))*@(c)d)'));
    assert(!isMatch('c.c', '*.@(a|b|@(ab|a*@(b))*@(c)d)'));
    assert(!isMatch('a.', '*.@(a|b|@(ab|a*@(b))*@(c)d)'));
    assert(!isMatch('d.d', '*.@(a|b|@(ab|a*@(b))*@(c)d)'));
    assert(!isMatch('e.e', '*.@(a|b|@(ab|a*@(b))*@(c)d)'));
    assert(!isMatch('f.f', '*.@(a|b|@(ab|a*@(b))*@(c)d)'));
    assert(isMatch('a.abcd', '*.@(a|b|@(ab|a*@(b))*@(c)d)'));

    assert(!isMatch('a.a', '!(*.a|*.b|*.c)'));
    assert(!isMatch('a.b', '!(*.a|*.b|*.c)'));
    assert(!isMatch('a.c', '!(*.a|*.b|*.c)'));
    assert(isMatch('a.c.d', '!(*.a|*.b|*.c)'));
    assert(!isMatch('c.c', '!(*.a|*.b|*.c)'));
    assert(isMatch('a.', '!(*.a|*.b|*.c)'));
    assert(isMatch('d.d', '!(*.a|*.b|*.c)'));
    assert(isMatch('e.e', '!(*.a|*.b|*.c)'));
    assert(isMatch('f.f', '!(*.a|*.b|*.c)'));
    assert(isMatch('a.abcd', '!(*.a|*.b|*.c)'));

    assert(isMatch('a.a', '!(*.[^a-c])'));
    assert(isMatch('a.b', '!(*.[^a-c])'));
    assert(isMatch('a.c', '!(*.[^a-c])'));
    assert(!isMatch('a.c.d', '!(*.[^a-c])'));
    assert(isMatch('c.c', '!(*.[^a-c])'));
    assert(isMatch('a.', '!(*.[^a-c])'));
    assert(!isMatch('d.d', '!(*.[^a-c])'));
    assert(!isMatch('e.e', '!(*.[^a-c])'));
    assert(!isMatch('f.f', '!(*.[^a-c])'));
    assert(isMatch('a.abcd', '!(*.[^a-c])'));

    assert(!isMatch('a.a', '!(*.[a-c])'));
    assert(!isMatch('a.b', '!(*.[a-c])'));
    assert(!isMatch('a.c', '!(*.[a-c])'));
    assert(isMatch('a.c.d', '!(*.[a-c])'));
    assert(!isMatch('c.c', '!(*.[a-c])'));
    assert(isMatch('a.', '!(*.[a-c])'));
    assert(isMatch('d.d', '!(*.[a-c])'));
    assert(isMatch('e.e', '!(*.[a-c])'));
    assert(isMatch('f.f', '!(*.[a-c])'));
    assert(isMatch('a.abcd', '!(*.[a-c])'));

    assert(!isMatch('a.a', '!(*.[a-c]*)'));
    assert(!isMatch('a.b', '!(*.[a-c]*)'));
    assert(!isMatch('a.c', '!(*.[a-c]*)'));
    assert(!isMatch('a.c.d', '!(*.[a-c]*)'));
    assert(!isMatch('c.c', '!(*.[a-c]*)'));
    assert(isMatch('a.', '!(*.[a-c]*)'));
    assert(isMatch('d.d', '!(*.[a-c]*)'));
    assert(isMatch('e.e', '!(*.[a-c]*)'));
    assert(isMatch('f.f', '!(*.[a-c]*)'));
    assert(!isMatch('a.abcd', '!(*.[a-c]*)'));

    assert(!isMatch('a.a', '*.!(a|b|c)'));
    assert(!isMatch('a.b', '*.!(a|b|c)'));
    assert(!isMatch('a.c', '*.!(a|b|c)'));
    assert(isMatch('a.c.d', '*.!(a|b|c)'));
    assert(!isMatch('c.c', '*.!(a|b|c)'));
    assert(isMatch('a.', '*.!(a|b|c)'));
    assert(isMatch('d.d', '*.!(a|b|c)'));
    assert(isMatch('e.e', '*.!(a|b|c)'));
    assert(isMatch('f.f', '*.!(a|b|c)'));
    assert(isMatch('a.abcd', '*.!(a|b|c)'));

    assert(isMatch('a.a', '*!(.a|.b|.c)'));
    assert(isMatch('a.b', '*!(.a|.b|.c)'));
    assert(isMatch('a.c', '*!(.a|.b|.c)'));
    assert(isMatch('a.c.d', '*!(.a|.b|.c)'));
    assert(isMatch('c.c', '*!(.a|.b|.c)'));
    assert(isMatch('a.', '*!(.a|.b|.c)'));
    assert(isMatch('d.d', '*!(.a|.b|.c)'));
    assert(isMatch('e.e', '*!(.a|.b|.c)'));
    assert(isMatch('f.f', '*!(.a|.b|.c)'));
    assert(isMatch('a.abcd', '*!(.a|.b|.c)'));

    assert(!isMatch('a.a', '!(*.[a-c])*'));
    assert(!isMatch('a.b', '!(*.[a-c])*'));
    assert(!isMatch('a.c', '!(*.[a-c])*'));
    assert(!isMatch('a.c.d', '!(*.[a-c])*'));
    assert(!isMatch('c.c', '!(*.[a-c])*'));
    assert(isMatch('a.', '!(*.[a-c])*'));
    assert(isMatch('d.d', '!(*.[a-c])*'));
    assert(isMatch('e.e', '!(*.[a-c])*'));
    assert(isMatch('f.f', '!(*.[a-c])*'));
    assert(!isMatch('a.abcd', '!(*.[a-c])*'));

    assert(isMatch('a.a', '*!(.a|.b|.c)*'));
    assert(isMatch('a.b', '*!(.a|.b|.c)*'));
    assert(isMatch('a.c', '*!(.a|.b|.c)*'));
    assert(isMatch('a.c.d', '*!(.a|.b|.c)*'));
    assert(isMatch('c.c', '*!(.a|.b|.c)*'));
    assert(isMatch('a.', '*!(.a|.b|.c)*'));
    assert(isMatch('d.d', '*!(.a|.b|.c)*'));
    assert(isMatch('e.e', '*!(.a|.b|.c)*'));
    assert(isMatch('f.f', '*!(.a|.b|.c)*'));
    assert(isMatch('a.abcd', '*!(.a|.b|.c)*'));

    assert(!isMatch('a.a', '*.!(a|b|c)*'));
    assert(!isMatch('a.b', '*.!(a|b|c)*'));
    assert(!isMatch('a.c', '*.!(a|b|c)*'));
    assert(isMatch('a.c.d', '*.!(a|b|c)*'));
    assert(!isMatch('c.c', '*.!(a|b|c)*'));
    assert(isMatch('a.', '*.!(a|b|c)*'));
    assert(isMatch('d.d', '*.!(a|b|c)*'));
    assert(isMatch('e.e', '*.!(a|b|c)*'));
    assert(isMatch('f.f', '*.!(a|b|c)*'));
    assert(!isMatch('a.abcd', '*.!(a|b|c)*'));
  });

  it('should correctly match empty parens', () => {
    assert(!isMatch('def', '@()ef'));
    assert(isMatch('ef', '@()ef'));

    assert(!isMatch('def', '()ef'));
    assert(isMatch('ef', '()ef'));
  });

  it('should match escaped parens', () => {
    if (process.platform !== 'win32') {
      assert(isMatch('a\\(b', 'a\\\\\\(b'));
    }
    assert(isMatch('a(b', 'a(b'));
    assert(isMatch('a(b', 'a\\(b'));
    assert(!isMatch('a((b', 'a(b'));
    assert(!isMatch('a((((b', 'a(b'));
    assert(!isMatch('ab', 'a(b'));

    assert(isMatch('a(b', 'a\\(b'));
    assert(!isMatch('a((b', 'a\\(b'));
    assert(!isMatch('a((((b', 'a\\(b'));
    assert(!isMatch('ab', 'a\\(b'));

    assert(isMatch('a(b', 'a(*b'));
    assert(isMatch('a(ab', 'a\\(*b'));
    assert(isMatch('a((b', 'a(*b'));
    assert(isMatch('a((((b', 'a(*b'));
    assert(!isMatch('ab', 'a(*b'));
  });

  it('should match escaped backslashes', () => {
    if (process.platform !== 'win32') {
      assert(isMatch('a\\(b', 'a\\(b'));
      assert(isMatch('a\\b', 'a\\b'));
    }

    assert(isMatch('a\\\\(b', 'a\\\\(b'));
    assert(!isMatch('a(b', 'a\\\\(b'));
    assert(!isMatch('a\\(b', 'a\\\\(b'));
    assert(!isMatch('a((b', 'a\\(b'));
    assert(!isMatch('a((((b', 'a\\(b'));
    assert(!isMatch('ab', 'a\\(b'));

    assert(!isMatch('a/b', 'a\\b'));
    assert(!isMatch('ab', 'a\\b'));
  });

  // these are not extglobs, and do not need to pass, but they are included
  // to test integration with other features
  it('should support regex characters', () => {
    let fixtures = ['a c', 'a.c', 'a.xy.zc', 'a.zc', 'a123c', 'a1c', 'abbbbc', 'abbbc', 'abbc', 'abc', 'abq', 'axy zc', 'axy', 'axy.zc', 'axyzc'];

    if (process.platform !== 'win32') {
      assert.deepEqual(mm(['a\\b', 'a/b', 'ab'], 'a/b'), ['a/b']);
    }

    assert.deepEqual(mm(['a/b', 'ab'], 'a/b'), ['a/b']);
    assert.deepEqual(mm(fixtures, 'ab?bc'), ['abbbc']);
    assert.deepEqual(mm(fixtures, 'ab*c'), ['abbbbc', 'abbbc', 'abbc', 'abc']);
    assert.deepEqual(mm(fixtures, 'a+(b)bc'), ['abbbbc', 'abbbc', 'abbc']);
    assert.deepEqual(mm(fixtures, '^abc$'), []);
    assert.deepEqual(mm(fixtures, 'a.c'), ['a.c']);
    assert.deepEqual(mm(fixtures, 'a.*c'), ['a.c', 'a.xy.zc', 'a.zc']);
    assert.deepEqual(mm(fixtures, 'a*c'), ['a c', 'a.c', 'a.xy.zc', 'a.zc', 'a123c', 'a1c', 'abbbbc', 'abbbc', 'abbc', 'abc', 'axy zc', 'axy.zc', 'axyzc']);
    assert.deepEqual(mm(fixtures, 'a[\\w]+c'), ['a123c', 'a1c', 'abbbbc', 'abbbc', 'abbc', 'abc', 'axyzc'], 'Should match word characters');
    assert.deepEqual(mm(fixtures, 'a[\\W]+c'), ['a c', 'a.c'], 'Should match non-word characters');
    assert.deepEqual(mm(fixtures, 'a[\\d]+c'), ['a123c', 'a1c'], 'Should match numbers');
    assert.deepEqual(mm(['foo@#$%123ASD #$$%^&', 'foo!@#$asdfl;', '123'], '[\\d]+'), ['123']);
    assert.deepEqual(mm(['a123c', 'abbbc'], 'a[\\D]+c'), ['abbbc'], 'Should match non-numbers');
    assert.deepEqual(mm(['foo', ' foo '], '(f|o)+\\b'), ['foo'], 'Should match word boundaries');
  });
});

describe('extglobs from the bash spec', () => {
  it('should match negation extglobs', () => {
    assert(isMatch('bar', '!(foo)'));
    assert(isMatch('f', '!(foo)'));
    assert(isMatch('fa', '!(foo)'));
    assert(isMatch('fb', '!(foo)'));
    assert(isMatch('ff', '!(foo)'));
    assert(isMatch('fff', '!(foo)'));
    assert(isMatch('fo', '!(foo)'));
    assert(!isMatch('foo', '!(foo)'));
    assert(!isMatch('foo/bar', '!(foo)'));
    assert(!isMatch('a/b/c/bar', '**/!(bar)'));
    assert(isMatch('a/b/c/foo/bar', '**/!(baz)/bar'));
    assert(isMatch('foobar', '!(foo)'));
    assert(isMatch('foot', '!(foo)'));
    assert(isMatch('foox', '!(foo)'));
    assert(isMatch('o', '!(foo)'));
    assert(isMatch('of', '!(foo)'));
    assert(isMatch('ooo', '!(foo)'));
    assert(isMatch('ox', '!(foo)'));
    assert(isMatch('x', '!(foo)'));
    assert(isMatch('xx', '!(foo)'));

    assert(!isMatch('bar', '!(!(foo))'));
    assert(!isMatch('f', '!(!(foo))'));
    assert(!isMatch('fa', '!(!(foo))'));
    assert(!isMatch('fb', '!(!(foo))'));
    assert(!isMatch('ff', '!(!(foo))'));
    assert(!isMatch('fff', '!(!(foo))'));
    assert(!isMatch('fo', '!(!(foo))'));
    assert(isMatch('foo', '!(!(foo))'));
    assert(!isMatch('foo/bar', '!(!(foo))'));
    assert(!isMatch('foobar', '!(!(foo))'));
    assert(!isMatch('foot', '!(!(foo))'));
    assert(!isMatch('foox', '!(!(foo))'));
    assert(!isMatch('o', '!(!(foo))'));
    assert(!isMatch('of', '!(!(foo))'));
    assert(!isMatch('ooo', '!(!(foo))'));
    assert(!isMatch('ox', '!(!(foo))'));
    assert(!isMatch('x', '!(!(foo))'));
    assert(!isMatch('xx', '!(!(foo))'));

    assert(isMatch('bar', '!(!(!(foo)))'));
    assert(isMatch('f', '!(!(!(foo)))'));
    assert(isMatch('fa', '!(!(!(foo)))'));
    assert(isMatch('fb', '!(!(!(foo)))'));
    assert(isMatch('ff', '!(!(!(foo)))'));
    assert(isMatch('fff', '!(!(!(foo)))'));
    assert(isMatch('fo', '!(!(!(foo)))'));
    assert(!isMatch('foo', '!(!(!(foo)))'));
    assert(!isMatch('foo/bar', '!(!(!(foo)))'));
    assert(isMatch('foobar', '!(!(!(foo)))'));
    assert(isMatch('foot', '!(!(!(foo)))'));
    assert(isMatch('foox', '!(!(!(foo)))'));
    assert(isMatch('o', '!(!(!(foo)))'));
    assert(isMatch('of', '!(!(!(foo)))'));
    assert(isMatch('ooo', '!(!(!(foo)))'));
    assert(isMatch('ox', '!(!(!(foo)))'));
    assert(isMatch('x', '!(!(!(foo)))'));
    assert(isMatch('xx', '!(!(!(foo)))'));

    assert(!isMatch('bar', '!(!(!(!(foo))))'));
    assert(!isMatch('f', '!(!(!(!(foo))))'));
    assert(!isMatch('fa', '!(!(!(!(foo))))'));
    assert(!isMatch('fb', '!(!(!(!(foo))))'));
    assert(!isMatch('ff', '!(!(!(!(foo))))'));
    assert(!isMatch('fff', '!(!(!(!(foo))))'));
    assert(!isMatch('fo', '!(!(!(!(foo))))'));
    assert(isMatch('foo', '!(!(!(!(foo))))'));
    assert(!isMatch('foo/bar', '!(!(!(!(foo))))'));
    assert(!isMatch('foot', '!(!(!(!(foo))))'));
    assert(!isMatch('o', '!(!(!(!(foo))))'));
    assert(!isMatch('of', '!(!(!(!(foo))))'));
    assert(!isMatch('ooo', '!(!(!(!(foo))))'));
    assert(!isMatch('ox', '!(!(!(!(foo))))'));
    assert(!isMatch('x', '!(!(!(!(foo))))'));
    assert(!isMatch('xx', '!(!(!(!(foo))))'));

    assert(!isMatch('bar', '!(!(foo))*'));
    assert(!isMatch('f', '!(!(foo))*'));
    assert(!isMatch('fa', '!(!(foo))*'));
    assert(!isMatch('fb', '!(!(foo))*'));
    assert(!isMatch('ff', '!(!(foo))*'));
    assert(!isMatch('fff', '!(!(foo))*'));
    assert(!isMatch('fo', '!(!(foo))*'));
    assert(isMatch('foo', '!(!(foo))*'));
    assert(!isMatch('foo/bar', '!(!(foo))*'));
    assert(isMatch('foobar', '!(!(foo))*'));
    assert(isMatch('foot', '!(!(foo))*'));
    assert(isMatch('foox', '!(!(foo))*'));
    assert(!isMatch('o', '!(!(foo))*'));
    assert(!isMatch('of', '!(!(foo))*'));
    assert(!isMatch('ooo', '!(!(foo))*'));
    assert(!isMatch('ox', '!(!(foo))*'));
    assert(!isMatch('x', '!(!(foo))*'));
    assert(!isMatch('xx', '!(!(foo))*'));

    assert(isMatch('bar', '!(f!(o))'));
    assert(!isMatch('f', '!(f!(o))'));
    assert(!isMatch('fa', '!(f!(o))'));
    assert(!isMatch('fb', '!(f!(o))'));
    assert(!isMatch('ff', '!(f!(o))'));
    assert(!isMatch('fff', '!(f!(o))'));
    assert(isMatch('fo', '!(f!(o))'));
    assert(isMatch('foo', '!(!(foo))'));
    assert(isMatch('go', '!(f!(o))'));
    assert(!isMatch('foo', '!(f!(o))'));
    assert(!isMatch('foo/bar', '!(f!(o))'));
    assert(!isMatch('foobar', '!(f)!(o)'));
    assert(!isMatch('foobar', '!(f)!(o)!(o)bar'));
    assert(isMatch('barbar', '!(f)!(o)!(o)bar'));
    assert(!isMatch('foobar', '!(f!(o))'));
    assert(!isMatch('foot', '!(f!(o))'));
    assert(!isMatch('foox', '!(f!(o))'));
    assert(isMatch('o', '!(f!(o))'));
    assert(isMatch('of', '!(f!(o))'));
    assert(isMatch('ooo', '!(f!(o))'));
    assert(isMatch('ox', '!(f!(o))'));
    assert(isMatch('x', '!(f!(o))'));
    assert(isMatch('xx', '!(f!(o))'));

    assert(isMatch('bar', '!(f(o))'));
    assert(isMatch('f', '!(f(o))'));
    assert(isMatch('fa', '!(f(o))'));
    assert(isMatch('fb', '!(f(o))'));
    assert(isMatch('ff', '!(f(o))'));
    assert(isMatch('fff', '!(f(o))'));
    assert(!isMatch('fo', '!(f(o))'));
    assert(isMatch('foo', '!(f(o))'));
    assert(!isMatch('foo/bar', '!(f(o))'));
    assert(isMatch('foobar', '!(f(o))'));
    assert(isMatch('foot', '!(f(o))'));
    assert(isMatch('foox', '!(f(o))'));
    assert(isMatch('o', '!(f(o))'));
    assert(isMatch('of', '!(f(o))'));
    assert(isMatch('ooo', '!(f(o))'));
    assert(isMatch('ox', '!(f(o))'));
    assert(isMatch('x', '!(f(o))'));
    assert(isMatch('xx', '!(f(o))'));

    assert(isMatch('bar', '!(f)'));
    assert(!isMatch('f', '!(f)'));
    assert(isMatch('fa', '!(f)'));
    assert(isMatch('fb', '!(f)'));
    assert(isMatch('ff', '!(f)'));
    assert(isMatch('fff', '!(f)'));
    assert(isMatch('fo', '!(f)'));
    assert(isMatch('foo', '!(f)'));
    assert(!isMatch('foo/bar', '!(f)'));
    assert(isMatch('foobar', '!(f)'));
    assert(isMatch('foot', '!(f)'));
    assert(isMatch('foox', '!(f)'));
    assert(isMatch('o', '!(f)'));
    assert(isMatch('of', '!(f)'));
    assert(isMatch('ooo', '!(f)'));
    assert(isMatch('ox', '!(f)'));
    assert(isMatch('x', '!(f)'));
    assert(isMatch('xx', '!(f)'));

    assert(isMatch('bar', '!(f)'));
    assert(!isMatch('f', '!(f)'));
    assert(isMatch('fa', '!(f)'));
    assert(isMatch('fb', '!(f)'));
    assert(isMatch('ff', '!(f)'));
    assert(isMatch('fff', '!(f)'));
    assert(isMatch('fo', '!(f)'));
    assert(isMatch('foo', '!(f)'));
    assert(!isMatch('foo/bar', '!(f)'));
    assert(isMatch('foobar', '!(f)'));
    assert(isMatch('foot', '!(f)'));
    assert(isMatch('foox', '!(f)'));
    assert(isMatch('o', '!(f)'));
    assert(isMatch('of', '!(f)'));
    assert(isMatch('ooo', '!(f)'));
    assert(isMatch('ox', '!(f)'));
    assert(isMatch('x', '!(f)'));
    assert(isMatch('xx', '!(f)'));

    assert(isMatch('bar', '!(foo)'));
    assert(isMatch('f', '!(foo)'));
    assert(isMatch('fa', '!(foo)'));
    assert(isMatch('fb', '!(foo)'));
    assert(isMatch('ff', '!(foo)'));
    assert(isMatch('fff', '!(foo)'));
    assert(isMatch('fo', '!(foo)'));
    assert(!isMatch('foo', '!(foo)'));
    assert(!isMatch('foo/bar', '!(foo)'));
    assert(isMatch('foobar', '!(foo)'));
    assert(isMatch('foot', '!(foo)'));
    assert(isMatch('foox', '!(foo)'));
    assert(isMatch('o', '!(foo)'));
    assert(isMatch('of', '!(foo)'));
    assert(isMatch('ooo', '!(foo)'));
    assert(isMatch('ox', '!(foo)'));
    assert(isMatch('x', '!(foo)'));
    assert(isMatch('xx', '!(foo)'));

    assert(isMatch('bar', '!(foo)*'));
    assert(isMatch('f', '!(foo)*'));
    assert(isMatch('fa', '!(foo)*'));
    assert(isMatch('fb', '!(foo)*'));
    assert(isMatch('ff', '!(foo)*'));
    assert(isMatch('fff', '!(foo)*'));
    assert(isMatch('fo', '!(foo)*'));
    assert(!isMatch('foo', '!(foo)*'));
    assert(!isMatch('foo/bar', '!(foo)*'));
    assert(!isMatch('foobar', '!(foo)*'));
    assert(!isMatch('foot', '!(foo)*'));
    assert(!isMatch('foox', '!(foo)*'));
    assert(isMatch('o', '!(foo)*'));
    assert(isMatch('of', '!(foo)*'));
    assert(isMatch('ooo', '!(foo)*'));
    assert(isMatch('ox', '!(foo)*'));
    assert(isMatch('x', '!(foo)*'));
    assert(isMatch('xx', '!(foo)*'));

    assert(isMatch('bar', '!(x)'));
    assert(isMatch('f', '!(x)'));
    assert(isMatch('fa', '!(x)'));
    assert(isMatch('fb', '!(x)'));
    assert(isMatch('ff', '!(x)'));
    assert(isMatch('fff', '!(x)'));
    assert(isMatch('fo', '!(x)'));
    assert(isMatch('foo', '!(x)'));
    assert(!isMatch('foo/bar', '!(x)'));
    assert(isMatch('foobar', '!(x)'));
    assert(isMatch('foot', '!(x)'));
    assert(isMatch('foox', '!(x)'));
    assert(isMatch('o', '!(x)'));
    assert(isMatch('of', '!(x)'));
    assert(isMatch('ooo', '!(x)'));
    assert(isMatch('ox', '!(x)'));
    assert(!isMatch('x', '!(x)'));
    assert(isMatch('xx', '!(x)'));

    assert(isMatch('bar', '!(x)*'));
    assert(isMatch('f', '!(x)*'));
    assert(isMatch('fa', '!(x)*'));
    assert(isMatch('fb', '!(x)*'));
    assert(isMatch('ff', '!(x)*'));
    assert(isMatch('fff', '!(x)*'));
    assert(isMatch('fo', '!(x)*'));
    assert(isMatch('foo', '!(x)*'));
    assert(!isMatch('foo/bar', '!(x)*'));
    assert(isMatch('foobar', '!(x)*'));
    assert(isMatch('foot', '!(x)*'));
    assert(isMatch('foox', '!(x)*'));
    assert(isMatch('o', '!(x)*'));
    assert(isMatch('of', '!(x)*'));
    assert(isMatch('ooo', '!(x)*'));
    assert(isMatch('ox', '!(x)*'));
    assert(!isMatch('x', '!(x)*'));
    assert(!isMatch('xx', '!(x)*'));

    assert(isMatch('bar', '*(!(f))'));
    assert(!isMatch('f', '*(!(f))'));
    assert(isMatch('fa', '*(!(f))'));
    assert(isMatch('fb', '*(!(f))'));
    assert(isMatch('ff', '*(!(f))'));
    assert(isMatch('fff', '*(!(f))'));
    assert(isMatch('fo', '*(!(f))'));
    assert(isMatch('foo', '*(!(f))'));
    assert(!isMatch('foo/bar', '*(!(f))'));
    assert(isMatch('foobar', '*(!(f))'));
    assert(isMatch('foot', '*(!(f))'));
    assert(isMatch('foox', '*(!(f))'));
    assert(isMatch('o', '*(!(f))'));
    assert(isMatch('of', '*(!(f))'));
    assert(isMatch('ooo', '*(!(f))'));
    assert(isMatch('ox', '*(!(f))'));
    assert(isMatch('x', '*(!(f))'));
    assert(isMatch('xx', '*(!(f))'));

    assert(!isMatch('bar', '*((foo))'));
    assert(!isMatch('f', '*((foo))'));
    assert(!isMatch('fa', '*((foo))'));
    assert(!isMatch('fb', '*((foo))'));
    assert(!isMatch('ff', '*((foo))'));
    assert(!isMatch('fff', '*((foo))'));
    assert(!isMatch('fo', '*((foo))'));
    assert(isMatch('foo', '*((foo))'));
    assert(!isMatch('foo/bar', '*((foo))'));
    assert(!isMatch('foobar', '*((foo))'));
    assert(!isMatch('foot', '*((foo))'));
    assert(!isMatch('foox', '*((foo))'));
    assert(!isMatch('o', '*((foo))'));
    assert(!isMatch('of', '*((foo))'));
    assert(!isMatch('ooo', '*((foo))'));
    assert(!isMatch('ox', '*((foo))'));
    assert(!isMatch('x', '*((foo))'));
    assert(!isMatch('xx', '*((foo))'));

    assert(isMatch('bar', '+(!(f))'));
    assert(!isMatch('f', '+(!(f))'));
    assert(isMatch('fa', '+(!(f))'));
    assert(isMatch('fb', '+(!(f))'));
    assert(isMatch('ff', '+(!(f))'));
    assert(isMatch('fff', '+(!(f))'));
    assert(isMatch('fo', '+(!(f))'));
    assert(isMatch('foo', '+(!(f))'));
    assert(!isMatch('foo/bar', '+(!(f))'));
    assert(isMatch('foobar', '+(!(f))'));
    assert(isMatch('foot', '+(!(f))'));
    assert(isMatch('foox', '+(!(f))'));
    assert(isMatch('o', '+(!(f))'));
    assert(isMatch('of', '+(!(f))'));
    assert(isMatch('ooo', '+(!(f))'));
    assert(isMatch('ox', '+(!(f))'));
    assert(isMatch('x', '+(!(f))'));
    assert(isMatch('xx', '+(!(f))'));

    assert(isMatch('bar', '@(!(z*)|*x)'));
    assert(isMatch('f', '@(!(z*)|*x)'));
    assert(isMatch('fa', '@(!(z*)|*x)'));
    assert(isMatch('fb', '@(!(z*)|*x)'));
    assert(isMatch('ff', '@(!(z*)|*x)'));
    assert(isMatch('fff', '@(!(z*)|*x)'));
    assert(isMatch('fo', '@(!(z*)|*x)'));
    assert(isMatch('foo', '@(!(z*)|*x)'));
    assert(isMatch('foo/bar', '@(!(z*/*)|*x)'));
    assert(!isMatch('foo/bar', '@(!(z*)|*x)'));
    assert(isMatch('foobar', '@(!(z*)|*x)'));
    assert(isMatch('foot', '@(!(z*)|*x)'));
    assert(isMatch('foox', '@(!(z*)|*x)'));
    assert(isMatch('o', '@(!(z*)|*x)'));
    assert(isMatch('of', '@(!(z*)|*x)'));
    assert(isMatch('ooo', '@(!(z*)|*x)'));
    assert(isMatch('ox', '@(!(z*)|*x)'));
    assert(isMatch('x', '@(!(z*)|*x)'));
    assert(isMatch('xx', '@(!(z*)|*x)'));

    assert(!isMatch('bar', 'foo/!(foo)'));
    assert(!isMatch('f', 'foo/!(foo)'));
    assert(!isMatch('fa', 'foo/!(foo)'));
    assert(!isMatch('fb', 'foo/!(foo)'));
    assert(!isMatch('ff', 'foo/!(foo)'));
    assert(!isMatch('fff', 'foo/!(foo)'));
    assert(!isMatch('fo', 'foo/!(foo)'));
    assert(!isMatch('foo', 'foo/!(foo)'));
    assert(isMatch('foo/bar', 'foo/!(foo)'));
    assert(!isMatch('foobar', 'foo/!(foo)'));
    assert(!isMatch('foot', 'foo/!(foo)'));
    assert(!isMatch('foox', 'foo/!(foo)'));
    assert(!isMatch('o', 'foo/!(foo)'));
    assert(!isMatch('of', 'foo/!(foo)'));
    assert(!isMatch('ooo', 'foo/!(foo)'));
    assert(!isMatch('ox', 'foo/!(foo)'));
    assert(!isMatch('x', 'foo/!(foo)'));
    assert(!isMatch('xx', 'foo/!(foo)'));

    assert(!isMatch('ffffffo', '(foo)bb'));
    assert(!isMatch('fffooofoooooffoofffooofff', '(foo)bb'));
    assert(!isMatch('ffo', '(foo)bb'));
    assert(!isMatch('fofo', '(foo)bb'));
    assert(!isMatch('fofoofoofofoo', '(foo)bb'));
    assert(!isMatch('foo', '(foo)bb'));
    assert(!isMatch('foob', '(foo)bb'));
    assert(isMatch('foobb', '(foo)bb'));
    assert(!isMatch('foofoofo', '(foo)bb'));
    assert(!isMatch('fooofoofofooo', '(foo)bb'));
    assert(!isMatch('foooofo', '(foo)bb'));
    assert(!isMatch('foooofof', '(foo)bb'));
    assert(!isMatch('foooofofx', '(foo)bb'));
    assert(!isMatch('foooxfooxfoxfooox', '(foo)bb'));
    assert(!isMatch('foooxfooxfxfooox', '(foo)bb'));
    assert(!isMatch('foooxfooxofoxfooox', '(foo)bb'));
    assert(!isMatch('foot', '(foo)bb'));
    assert(!isMatch('foox', '(foo)bb'));
    assert(!isMatch('ofoofo', '(foo)bb'));
    assert(!isMatch('ofooofoofofooo', '(foo)bb'));
    assert(!isMatch('ofoooxoofxo', '(foo)bb'));
    assert(!isMatch('ofoooxoofxoofoooxoofxo', '(foo)bb'));
    assert(!isMatch('ofoooxoofxoofoooxoofxofo', '(foo)bb'));
    assert(!isMatch('ofoooxoofxoofoooxoofxoo', '(foo)bb'));
    assert(!isMatch('ofoooxoofxoofoooxoofxooofxofxo', '(foo)bb'));
    assert(!isMatch('ofxoofxo', '(foo)bb'));
    assert(!isMatch('oofooofo', '(foo)bb'));
    assert(!isMatch('ooo', '(foo)bb'));
    assert(!isMatch('oxfoxfox', '(foo)bb'));
    assert(!isMatch('oxfoxoxfox', '(foo)bb'));
    assert(!isMatch('xfoooofof', '(foo)bb'));

    assert(isMatch('ffffffo', '*(*(f)*(o))'));
    assert(isMatch('fffooofoooooffoofffooofff', '*(*(f)*(o))'));
    assert(isMatch('ffo', '*(*(f)*(o))'));
    assert(isMatch('fofo', '*(*(f)*(o))'));
    assert(isMatch('fofoofoofofoo', '*(*(f)*(o))'));
    assert(isMatch('foo', '*(*(f)*(o))'));
    assert(!isMatch('foob', '*(*(f)*(o))'));
    assert(!isMatch('foobb', '*(*(f)*(o))'));
    assert(isMatch('foofoofo', '*(*(f)*(o))'));
    assert(isMatch('fooofoofofooo', '*(*(f)*(o))'));
    assert(isMatch('foooofo', '*(*(f)*(o))'));
    assert(isMatch('foooofof', '*(*(f)*(o))'));
    assert(!isMatch('foooofofx', '*(*(f)*(o))'));
    assert(!isMatch('foooxfooxfoxfooox', '*(*(f)*(o))'));
    assert(!isMatch('foooxfooxfxfooox', '*(*(f)*(o))'));
    assert(!isMatch('foooxfooxofoxfooox', '*(*(f)*(o))'));
    assert(!isMatch('foot', '*(*(f)*(o))'));
    assert(!isMatch('foox', '*(*(f)*(o))'));
    assert(isMatch('ofoofo', '*(*(f)*(o))'));
    assert(isMatch('ofooofoofofooo', '*(*(f)*(o))'));
    assert(!isMatch('ofoooxoofxo', '*(*(f)*(o))'));
    assert(!isMatch('ofoooxoofxoofoooxoofxo', '*(*(f)*(o))'));
    assert(!isMatch('ofoooxoofxoofoooxoofxofo', '*(*(f)*(o))'));
    assert(!isMatch('ofoooxoofxoofoooxoofxoo', '*(*(f)*(o))'));
    assert(!isMatch('ofoooxoofxoofoooxoofxooofxofxo', '*(*(f)*(o))'));
    assert(!isMatch('ofxoofxo', '*(*(f)*(o))'));
    assert(isMatch('oofooofo', '*(*(f)*(o))'));
    assert(isMatch('ooo', '*(*(f)*(o))'));
    assert(!isMatch('oxfoxfox', '*(*(f)*(o))'));
    assert(!isMatch('oxfoxoxfox', '*(*(f)*(o))'));
    assert(!isMatch('xfoooofof', '*(*(f)*(o))'));

    assert(!isMatch('ffffffo', '*(*(of*(o)x)o)'));
    assert(!isMatch('fffooofoooooffoofffooofff', '*(*(of*(o)x)o)'));
    assert(!isMatch('ffo', '*(*(of*(o)x)o)'));
    assert(!isMatch('fofo', '*(*(of*(o)x)o)'));
    assert(!isMatch('fofoofoofofoo', '*(*(of*(o)x)o)'));
    assert(!isMatch('foo', '*(*(of*(o)x)o)'));
    assert(!isMatch('foob', '*(*(of*(o)x)o)'));
    assert(!isMatch('foobb', '*(*(of*(o)x)o)'));
    assert(!isMatch('foofoofo', '*(*(of*(o)x)o)'));
    assert(!isMatch('fooofoofofooo', '*(*(of*(o)x)o)'));
    assert(!isMatch('foooofo', '*(*(of*(o)x)o)'));
    assert(!isMatch('foooofof', '*(*(of*(o)x)o)'));
    assert(!isMatch('foooofofx', '*(*(of*(o)x)o)'));
    assert(!isMatch('foooxfooxfoxfooox', '*(*(of*(o)x)o)'));
    assert(!isMatch('foooxfooxfxfooox', '*(*(of*(o)x)o)'));
    assert(!isMatch('foooxfooxofoxfooox', '*(*(of*(o)x)o)'));
    assert(!isMatch('foot', '*(*(of*(o)x)o)'));
    assert(!isMatch('foox', '*(*(of*(o)x)o)'));
    assert(!isMatch('ofoofo', '*(*(of*(o)x)o)'));
    assert(!isMatch('ofooofoofofooo', '*(*(of*(o)x)o)'));
    assert(isMatch('ofoooxoofxo', '*(*(of*(o)x)o)'));
    assert(isMatch('ofoooxoofxoofoooxoofxo', '*(*(of*(o)x)o)'));
    assert(!isMatch('ofoooxoofxoofoooxoofxofo', '*(*(of*(o)x)o)'));
    assert(isMatch('ofoooxoofxoofoooxoofxoo', '*(*(of*(o)x)o)'));
    assert(isMatch('ofoooxoofxoofoooxoofxooofxofxo', '*(*(of*(o)x)o)'));
    assert(isMatch('ofxoofxo', '*(*(of*(o)x)o)'));
    assert(!isMatch('oofooofo', '*(*(of*(o)x)o)'));
    assert(isMatch('ooo', '*(*(of*(o)x)o)'));
    assert(!isMatch('oxfoxfox', '*(*(of*(o)x)o)'));
    assert(!isMatch('oxfoxoxfox', '*(*(of*(o)x)o)'));
    assert(!isMatch('xfoooofof', '*(*(of*(o)x)o)'));

    assert(isMatch('ffffffo', '*(f*(o))'));
    assert(isMatch('fffooofoooooffoofffooofff', '*(f*(o))'));
    assert(isMatch('ffo', '*(f*(o))'));
    assert(isMatch('fofo', '*(f*(o))'));
    assert(isMatch('fofoofoofofoo', '*(f*(o))'));
    assert(isMatch('foo', '*(f*(o))'));
    assert(!isMatch('foob', '*(f*(o))'));
    assert(!isMatch('foobb', '*(f*(o))'));
    assert(isMatch('foofoofo', '*(f*(o))'));
    assert(isMatch('fooofoofofooo', '*(f*(o))'));
    assert(isMatch('foooofo', '*(f*(o))'));
    assert(isMatch('foooofof', '*(f*(o))'));
    assert(!isMatch('foooofofx', '*(f*(o))'));
    assert(!isMatch('foooxfooxfoxfooox', '*(f*(o))'));
    assert(!isMatch('foooxfooxfxfooox', '*(f*(o))'));
    assert(!isMatch('foooxfooxofoxfooox', '*(f*(o))'));
    assert(!isMatch('foot', '*(f*(o))'));
    assert(!isMatch('foox', '*(f*(o))'));
    assert(!isMatch('ofoofo', '*(f*(o))'));
    assert(!isMatch('ofooofoofofooo', '*(f*(o))'));
    assert(!isMatch('ofoooxoofxo', '*(f*(o))'));
    assert(!isMatch('ofoooxoofxoofoooxoofxo', '*(f*(o))'));
    assert(!isMatch('ofoooxoofxoofoooxoofxofo', '*(f*(o))'));
    assert(!isMatch('ofoooxoofxoofoooxoofxoo', '*(f*(o))'));
    assert(!isMatch('ofoooxoofxoofoooxoofxooofxofxo', '*(f*(o))'));
    assert(!isMatch('ofxoofxo', '*(f*(o))'));
    assert(!isMatch('oofooofo', '*(f*(o))'));
    assert(!isMatch('ooo', '*(f*(o))'));
    assert(!isMatch('oxfoxfox', '*(f*(o))'));
    assert(!isMatch('oxfoxoxfox', '*(f*(o))'));
    assert(!isMatch('xfoooofof', '*(f*(o))'));

    assert(!isMatch('ffffffo', '*(f*(o)x)'));
    assert(!isMatch('fffooofoooooffoofffooofff', '*(f*(o)x)'));
    assert(!isMatch('ffo', '*(f*(o)x)'));
    assert(!isMatch('fofo', '*(f*(o)x)'));
    assert(!isMatch('fofoofoofofoo', '*(f*(o)x)'));
    assert(!isMatch('foo', '*(f*(o)x)'));
    assert(!isMatch('foob', '*(f*(o)x)'));
    assert(!isMatch('foobb', '*(f*(o)x)'));
    assert(!isMatch('foofoofo', '*(f*(o)x)'));
    assert(!isMatch('fooofoofofooo', '*(f*(o)x)'));
    assert(!isMatch('foooofo', '*(f*(o)x)'));
    assert(!isMatch('foooofof', '*(f*(o)x)'));
    assert(!isMatch('foooofofx', '*(f*(o)x)'));
    assert(isMatch('foooxfooxfoxfooox', '*(f*(o)x)'));
    assert(isMatch('foooxfooxfxfooox', '*(f*(o)x)'));
    assert(!isMatch('foooxfooxofoxfooox', '*(f*(o)x)'));
    assert(!isMatch('foot', '*(f*(o)x)'));
    assert(isMatch('foox', '*(f*(o)x)'));
    assert(!isMatch('ofoofo', '*(f*(o)x)'));
    assert(!isMatch('ofooofoofofooo', '*(f*(o)x)'));
    assert(!isMatch('ofoooxoofxo', '*(f*(o)x)'));
    assert(!isMatch('ofoooxoofxoofoooxoofxo', '*(f*(o)x)'));
    assert(!isMatch('ofoooxoofxoofoooxoofxofo', '*(f*(o)x)'));
    assert(!isMatch('ofoooxoofxoofoooxoofxoo', '*(f*(o)x)'));
    assert(!isMatch('ofoooxoofxoofoooxoofxooofxofxo', '*(f*(o)x)'));
    assert(!isMatch('ofxoofxo', '*(f*(o)x)'));
    assert(!isMatch('oofooofo', '*(f*(o)x)'));
    assert(!isMatch('ooo', '*(f*(o)x)'));
    assert(!isMatch('oxfoxfox', '*(f*(o)x)'));
    assert(!isMatch('oxfoxoxfox', '*(f*(o)x)'));
    assert(!isMatch('xfoooofof', '*(f*(o)x)'));

    assert(!isMatch('ffffffo', '*(f+(o))'));
    assert(!isMatch('fffooofoooooffoofffooofff', '*(f+(o))'));
    assert(!isMatch('ffo', '*(f+(o))'));
    assert(isMatch('fofo', '*(f+(o))'));
    assert(isMatch('fofoofoofofoo', '*(f+(o))'));
    assert(isMatch('foo', '*(f+(o))'));
    assert(!isMatch('foob', '*(f+(o))'));
    assert(!isMatch('foobb', '*(f+(o))'));
    assert(isMatch('foofoofo', '*(f+(o))'));
    assert(isMatch('fooofoofofooo', '*(f+(o))'));
    assert(isMatch('foooofo', '*(f+(o))'));
    assert(!isMatch('foooofof', '*(f+(o))'));
    assert(!isMatch('foooofofx', '*(f+(o))'));
    assert(!isMatch('foooxfooxfoxfooox', '*(f+(o))'));
    assert(!isMatch('foooxfooxfxfooox', '*(f+(o))'));
    assert(!isMatch('foooxfooxofoxfooox', '*(f+(o))'));
    assert(!isMatch('foot', '*(f+(o))'));
    assert(!isMatch('foox', '*(f+(o))'));
    assert(!isMatch('ofoofo', '*(f+(o))'));
    assert(!isMatch('ofooofoofofooo', '*(f+(o))'));
    assert(!isMatch('ofoooxoofxo', '*(f+(o))'));
    assert(!isMatch('ofoooxoofxoofoooxoofxo', '*(f+(o))'));
    assert(!isMatch('ofoooxoofxoofoooxoofxofo', '*(f+(o))'));
    assert(!isMatch('ofoooxoofxoofoooxoofxoo', '*(f+(o))'));
    assert(!isMatch('ofoooxoofxoofoooxoofxooofxofxo', '*(f+(o))'));
    assert(!isMatch('ofxoofxo', '*(f+(o))'));
    assert(!isMatch('oofooofo', '*(f+(o))'));
    assert(!isMatch('ooo', '*(f+(o))'));
    assert(!isMatch('oxfoxfox', '*(f+(o))'));
    assert(!isMatch('oxfoxoxfox', '*(f+(o))'));
    assert(!isMatch('xfoooofof', '*(f+(o))'));

    assert(!isMatch('ffffffo', '*(of+(o))'));
    assert(!isMatch('fffooofoooooffoofffooofff', '*(of+(o))'));
    assert(!isMatch('ffo', '*(of+(o))'));
    assert(!isMatch('fofo', '*(of+(o))'));
    assert(!isMatch('fofoofoofofoo', '*(of+(o))'));
    assert(!isMatch('foo', '*(of+(o))'));
    assert(!isMatch('foob', '*(of+(o))'));
    assert(!isMatch('foobb', '*(of+(o))'));
    assert(!isMatch('foofoofo', '*(of+(o))'));
    assert(!isMatch('fooofoofofooo', '*(of+(o))'));
    assert(!isMatch('foooofo', '*(of+(o))'));
    assert(!isMatch('foooofof', '*(of+(o))'));
    assert(!isMatch('foooofofx', '*(of+(o))'));
    assert(!isMatch('foooxfooxfoxfooox', '*(of+(o))'));
    assert(!isMatch('foooxfooxfxfooox', '*(of+(o))'));
    assert(!isMatch('foooxfooxofoxfooox', '*(of+(o))'));
    assert(!isMatch('foot', '*(of+(o))'));
    assert(!isMatch('foox', '*(of+(o))'));
    assert(isMatch('ofoofo', '*(of+(o))'));
    assert(!isMatch('ofooofoofofooo', '*(of+(o))'));
    assert(!isMatch('ofoooxoofxo', '*(of+(o))'));
    assert(!isMatch('ofoooxoofxoofoooxoofxo', '*(of+(o))'));
    assert(!isMatch('ofoooxoofxoofoooxoofxofo', '*(of+(o))'));
    assert(!isMatch('ofoooxoofxoofoooxoofxoo', '*(of+(o))'));
    assert(!isMatch('ofoooxoofxoofoooxoofxooofxofxo', '*(of+(o))'));
    assert(!isMatch('ofxoofxo', '*(of+(o))'));
    assert(!isMatch('oofooofo', '*(of+(o))'));
    assert(!isMatch('ooo', '*(of+(o))'));
    assert(!isMatch('oxfoxfox', '*(of+(o))'));
    assert(!isMatch('oxfoxoxfox', '*(of+(o))'));
    assert(!isMatch('xfoooofof', '*(of+(o))'));

    assert(!isMatch('ffffffo', '*(of+(o)|f)'));
    assert(!isMatch('fffooofoooooffoofffooofff', '*(of+(o)|f)'));
    assert(!isMatch('ffo', '*(of+(o)|f)'));
    assert(isMatch('fofo', '*(of+(o)|f)'));
    assert(isMatch('fofoofoofofoo', '*(of+(o)|f)'));
    assert(!isMatch('foo', '*(of+(o)|f)'));
    assert(!isMatch('foob', '*(of+(o)|f)'));
    assert(!isMatch('foobb', '*(of+(o)|f)'));
    assert(!isMatch('foofoofo', '*(of+(o)|f)'));
    assert(!isMatch('fooofoofofooo', '*(of+(o)|f)'));
    assert(!isMatch('foooofo', '*(of+(o)|f)'));
    assert(!isMatch('foooofof', '*(of+(o)|f)'));
    assert(!isMatch('foooofofx', '*(of+(o)|f)'));
    assert(!isMatch('foooxfooxfoxfooox', '*(of+(o)|f)'));
    assert(!isMatch('foooxfooxfxfooox', '*(of+(o)|f)'));
    assert(!isMatch('foooxfooxofoxfooox', '*(of+(o)|f)'));
    assert(!isMatch('foot', '*(of+(o)|f)'));
    assert(!isMatch('foox', '*(of+(o)|f)'));
    assert(isMatch('ofoofo', '*(of+(o)|f)'));
    assert(isMatch('ofooofoofofooo', '*(of+(o)|f)'));
    assert(!isMatch('ofoooxoofxo', '*(of+(o)|f)'));
    assert(!isMatch('ofoooxoofxoofoooxoofxo', '*(of+(o)|f)'));
    assert(!isMatch('ofoooxoofxoofoooxoofxofo', '*(of+(o)|f)'));
    assert(!isMatch('ofoooxoofxoofoooxoofxoo', '*(of+(o)|f)'));
    assert(!isMatch('ofoooxoofxoofoooxoofxooofxofxo', '*(of+(o)|f)'));
    assert(!isMatch('ofxoofxo', '*(of+(o)|f)'));
    assert(!isMatch('oofooofo', '*(of+(o)|f)'));
    assert(!isMatch('ooo', '*(of+(o)|f)'));
    assert(!isMatch('oxfoxfox', '*(of+(o)|f)'));
    assert(!isMatch('oxfoxoxfox', '*(of+(o)|f)'));
    assert(!isMatch('xfoooofof', '*(of+(o)|f)'));

    assert(!isMatch('ffffffo', '*(of|oof+(o))'));
    assert(!isMatch('fffooofoooooffoofffooofff', '*(of|oof+(o))'));
    assert(!isMatch('ffo', '*(of|oof+(o))'));
    assert(!isMatch('fofo', '*(of|oof+(o))'));
    assert(!isMatch('fofoofoofofoo', '*(of|oof+(o))'));
    assert(!isMatch('foo', '*(of|oof+(o))'));
    assert(!isMatch('foob', '*(of|oof+(o))'));
    assert(!isMatch('foobb', '*(of|oof+(o))'));
    assert(!isMatch('foofoofo', '*(of|oof+(o))'));
    assert(!isMatch('fooofoofofooo', '*(of|oof+(o))'));
    assert(!isMatch('foooofo', '*(of|oof+(o))'));
    assert(!isMatch('foooofof', '*(of|oof+(o))'));
    assert(!isMatch('foooofofx', '*(of|oof+(o))'));
    assert(!isMatch('foooxfooxfoxfooox', '*(of|oof+(o))'));
    assert(!isMatch('foooxfooxfxfooox', '*(of|oof+(o))'));
    assert(!isMatch('foooxfooxofoxfooox', '*(of|oof+(o))'));
    assert(!isMatch('foot', '*(of|oof+(o))'));
    assert(!isMatch('foox', '*(of|oof+(o))'));
    assert(isMatch('ofoofo', '*(of|oof+(o))'));
    assert(!isMatch('ofooofoofofooo', '*(of|oof+(o))'));
    assert(!isMatch('ofoooxoofxo', '*(of|oof+(o))'));
    assert(!isMatch('ofoooxoofxoofoooxoofxo', '*(of|oof+(o))'));
    assert(!isMatch('ofoooxoofxoofoooxoofxofo', '*(of|oof+(o))'));
    assert(!isMatch('ofoooxoofxoofoooxoofxoo', '*(of|oof+(o))'));
    assert(!isMatch('ofoooxoofxoofoooxoofxooofxofxo', '*(of|oof+(o))'));
    assert(!isMatch('ofxoofxo', '*(of|oof+(o))'));
    assert(isMatch('oofooofo', '*(of|oof+(o))'));
    assert(!isMatch('ooo', '*(of|oof+(o))'));
    assert(!isMatch('oxfoxfox', '*(of|oof+(o))'));
    assert(!isMatch('oxfoxoxfox', '*(of|oof+(o))'));
    assert(!isMatch('xfoooofof', '*(of|oof+(o))'));

    assert(!isMatch('ffffffo', '*(oxf+(ox))'));
    assert(!isMatch('fffooofoooooffoofffooofff', '*(oxf+(ox))'));
    assert(!isMatch('ffo', '*(oxf+(ox))'));
    assert(!isMatch('fofo', '*(oxf+(ox))'));
    assert(!isMatch('fofoofoofofoo', '*(oxf+(ox))'));
    assert(!isMatch('foo', '*(oxf+(ox))'));
    assert(!isMatch('foob', '*(oxf+(ox))'));
    assert(!isMatch('foobb', '*(oxf+(ox))'));
    assert(!isMatch('foofoofo', '*(oxf+(ox))'));
    assert(!isMatch('fooofoofofooo', '*(oxf+(ox))'));
    assert(!isMatch('foooofo', '*(oxf+(ox))'));
    assert(!isMatch('foooofof', '*(oxf+(ox))'));
    assert(!isMatch('foooofofx', '*(oxf+(ox))'));
    assert(!isMatch('foooxfooxfoxfooox', '*(oxf+(ox))'));
    assert(!isMatch('foooxfooxfxfooox', '*(oxf+(ox))'));
    assert(!isMatch('foooxfooxofoxfooox', '*(oxf+(ox))'));
    assert(!isMatch('foot', '*(oxf+(ox))'));
    assert(!isMatch('foox', '*(oxf+(ox))'));
    assert(!isMatch('ofoofo', '*(oxf+(ox))'));
    assert(!isMatch('ofooofoofofooo', '*(oxf+(ox))'));
    assert(!isMatch('ofoooxoofxo', '*(oxf+(ox))'));
    assert(!isMatch('ofoooxoofxoofoooxoofxo', '*(oxf+(ox))'));
    assert(!isMatch('ofoooxoofxoofoooxoofxofo', '*(oxf+(ox))'));
    assert(!isMatch('ofoooxoofxoofoooxoofxoo', '*(oxf+(ox))'));
    assert(!isMatch('ofoooxoofxoofoooxoofxooofxofxo', '*(oxf+(ox))'));
    assert(!isMatch('ofxoofxo', '*(oxf+(ox))'));
    assert(!isMatch('oofooofo', '*(oxf+(ox))'));
    assert(!isMatch('ooo', '*(oxf+(ox))'));
    assert(!isMatch('oxfoxfox', '*(oxf+(ox))'));
    assert(isMatch('oxfoxoxfox', '*(oxf+(ox))'));
    assert(!isMatch('xfoooofof', '*(oxf+(ox))'));

    assert(isMatch('ffffffo', '@(!(z*)|*x)'));
    assert(isMatch('fffooofoooooffoofffooofff', '@(!(z*)|*x)'));
    assert(isMatch('ffo', '@(!(z*)|*x)'));
    assert(isMatch('fofo', '@(!(z*)|*x)'));
    assert(isMatch('fofoofoofofoo', '@(!(z*)|*x)'));
    assert(isMatch('foo', '@(!(z*)|*x)'));
    assert(isMatch('foob', '@(!(z*)|*x)'));
    assert(isMatch('foobb', '@(!(z*)|*x)'));
    assert(isMatch('foofoofo', '@(!(z*)|*x)'));
    assert(isMatch('fooofoofofooo', '@(!(z*)|*x)'));
    assert(isMatch('foooofo', '@(!(z*)|*x)'));
    assert(isMatch('foooofof', '@(!(z*)|*x)'));
    assert(isMatch('foooofofx', '@(!(z*)|*x)'));
    assert(isMatch('foooxfooxfoxfooox', '@(!(z*)|*x)'));
    assert(isMatch('foooxfooxfxfooox', '@(!(z*)|*x)'));
    assert(isMatch('foooxfooxofoxfooox', '@(!(z*)|*x)'));
    assert(isMatch('foot', '@(!(z*)|*x)'));
    assert(isMatch('foox', '@(!(z*)|*x)'));
    assert(isMatch('ofoofo', '@(!(z*)|*x)'));
    assert(isMatch('ofooofoofofooo', '@(!(z*)|*x)'));
    assert(isMatch('ofoooxoofxo', '@(!(z*)|*x)'));
    assert(isMatch('ofoooxoofxoofoooxoofxo', '@(!(z*)|*x)'));
    assert(isMatch('ofoooxoofxoofoooxoofxofo', '@(!(z*)|*x)'));
    assert(isMatch('ofoooxoofxoofoooxoofxoo', '@(!(z*)|*x)'));
    assert(isMatch('ofoooxoofxoofoooxoofxooofxofxo', '@(!(z*)|*x)'));
    assert(isMatch('ofxoofxo', '@(!(z*)|*x)'));
    assert(isMatch('oofooofo', '@(!(z*)|*x)'));
    assert(isMatch('ooo', '@(!(z*)|*x)'));
    assert(isMatch('oxfoxfox', '@(!(z*)|*x)'));
    assert(isMatch('oxfoxoxfox', '@(!(z*)|*x)'));
    assert(isMatch('xfoooofof', '@(!(z*)|*x)'));

    assert(!isMatch('ffffffo', '@(foo|f|fo)*(f|of+(o))'));
    assert(!isMatch('fffooofoooooffoofffooofff', '@(foo|f|fo)*(f|of+(o))'));
    assert(!isMatch('ffo', '@(foo|f|fo)*(f|of+(o))'));
    assert(isMatch('fofo', '@(foo|f|fo)*(f|of+(o))'));
    assert(isMatch('fofoofoofofoo', '@(foo|f|fo)*(f|of+(o))'));
    assert(isMatch('foo', '@(foo|f|fo)*(f|of+(o))'));
    assert(!isMatch('foob', '@(foo|f|fo)*(f|of+(o))'));
    assert(!isMatch('foobb', '@(foo|f|fo)*(f|of+(o))'));
    assert(isMatch('foofoofo', '@(foo|f|fo)*(f|of+(o))'));
    assert(isMatch('fooofoofofooo', '@(foo|f|fo)*(f|of+(o))'));
    assert(!isMatch('foooofo', '@(foo|f|fo)*(f|of+(o))'));
    assert(!isMatch('foooofof', '@(foo|f|fo)*(f|of+(o))'));
    assert(!isMatch('foooofofx', '@(foo|f|fo)*(f|of+(o))'));
    assert(!isMatch('foooxfooxfoxfooox', '@(foo|f|fo)*(f|of+(o))'));
    assert(!isMatch('foooxfooxfxfooox', '@(foo|f|fo)*(f|of+(o))'));
    assert(!isMatch('foooxfooxofoxfooox', '@(foo|f|fo)*(f|of+(o))'));
    assert(!isMatch('foot', '@(foo|f|fo)*(f|of+(o))'));
    assert(!isMatch('foox', '@(foo|f|fo)*(f|of+(o))'));
    assert(!isMatch('ofoofo', '@(foo|f|fo)*(f|of+(o))'));
    assert(!isMatch('ofooofoofofooo', '@(foo|f|fo)*(f|of+(o))'));
    assert(!isMatch('ofoooxoofxo', '@(foo|f|fo)*(f|of+(o))'));
    assert(!isMatch('ofoooxoofxoofoooxoofxo', '@(foo|f|fo)*(f|of+(o))'));
    assert(!isMatch('ofoooxoofxoofoooxoofxofo', '@(foo|f|fo)*(f|of+(o))'));
    assert(!isMatch('ofoooxoofxoofoooxoofxoo', '@(foo|f|fo)*(f|of+(o))'));
    assert(!isMatch('ofoooxoofxoofoooxoofxooofxofxo', '@(foo|f|fo)*(f|of+(o))'));
    assert(!isMatch('ofxoofxo', '@(foo|f|fo)*(f|of+(o))'));
    assert(!isMatch('oofooofo', '@(foo|f|fo)*(f|of+(o))'));
    assert(!isMatch('ooo', '@(foo|f|fo)*(f|of+(o))'));
    assert(!isMatch('oxfoxfox', '@(foo|f|fo)*(f|of+(o))'));
    assert(!isMatch('oxfoxoxfox', '@(foo|f|fo)*(f|of+(o))'));
    assert(!isMatch('xfoooofof', '@(foo|f|fo)*(f|of+(o))'));

    assert(isMatch('aaac', '*(@(a))a@(c)'));
    assert(isMatch('aac', '*(@(a))a@(c)'));
    assert(isMatch('ac', '*(@(a))a@(c)'));
    assert(!isMatch('abbcd', '*(@(a))a@(c)'));
    assert(!isMatch('abcd', '*(@(a))a@(c)'));
    assert(!isMatch('acd', '*(@(a))a@(c)'));
    assert(!isMatch('baaac', '*(@(a))a@(c)'));
    assert(!isMatch('c', '*(@(a))a@(c)'));
    assert(!isMatch('foo', '*(@(a))a@(c)'));

    assert(!isMatch('aaac', '@(ab|a*(b))*(c)d'));
    assert(!isMatch('aac', '@(ab|a*(b))*(c)d'));
    assert(!isMatch('ac', '@(ab|a*(b))*(c)d'));
    assert(isMatch('abbcd', '@(ab|a*(b))*(c)d'));
    assert(isMatch('abcd', '@(ab|a*(b))*(c)d'));
    assert(isMatch('acd', '@(ab|a*(b))*(c)d'));
    assert(!isMatch('baaac', '@(ab|a*(b))*(c)d'));
    assert(!isMatch('c', '@(ab|a*(b))*(c)d'));
    assert(!isMatch('foo', '@(ab|a*(b))*(c)d'));

    assert(!isMatch('aaac', '?@(a|b)*@(c)d'));
    assert(!isMatch('aac', '?@(a|b)*@(c)d'));
    assert(!isMatch('ac', '?@(a|b)*@(c)d'));
    assert(isMatch('abbcd', '?@(a|b)*@(c)d'));
    assert(isMatch('abcd', '?@(a|b)*@(c)d'));
    assert(!isMatch('acd', '?@(a|b)*@(c)d'));
    assert(!isMatch('baaac', '?@(a|b)*@(c)d'));
    assert(!isMatch('c', '?@(a|b)*@(c)d'));
    assert(!isMatch('foo', '?@(a|b)*@(c)d'));

    assert(!isMatch('aaac', '@(ab|a*@(b))*(c)d'));
    assert(!isMatch('aac', '@(ab|a*@(b))*(c)d'));
    assert(!isMatch('ac', '@(ab|a*@(b))*(c)d'));
    assert(isMatch('abbcd', '@(ab|a*@(b))*(c)d'));
    assert(isMatch('abcd', '@(ab|a*@(b))*(c)d'));
    assert(!isMatch('acd', '@(ab|a*@(b))*(c)d'));
    assert(!isMatch('baaac', '@(ab|a*@(b))*(c)d'));
    assert(!isMatch('c', '@(ab|a*@(b))*(c)d'));
    assert(!isMatch('foo', '@(ab|a*@(b))*(c)d'));

    assert(!isMatch('aac', '*(@(a))b@(c)'));
  });

  it('should backtrack in alternation matches', () => {
    assert(!isMatch('ffffffo', '*(fo|foo)'));
    assert(!isMatch('fffooofoooooffoofffooofff', '*(fo|foo)'));
    assert(!isMatch('ffo', '*(fo|foo)'));
    assert(isMatch('fofo', '*(fo|foo)'));
    assert(isMatch('fofoofoofofoo', '*(fo|foo)'));
    assert(isMatch('foo', '*(fo|foo)'));
    assert(!isMatch('foob', '*(fo|foo)'));
    assert(!isMatch('foobb', '*(fo|foo)'));
    assert(isMatch('foofoofo', '*(fo|foo)'));
    assert(!isMatch('fooofoofofooo', '*(fo|foo)'));
    assert(!isMatch('foooofo', '*(fo|foo)'));
    assert(!isMatch('foooofof', '*(fo|foo)'));
    assert(!isMatch('foooofofx', '*(fo|foo)'));
    assert(!isMatch('foooxfooxfoxfooox', '*(fo|foo)'));
    assert(!isMatch('foooxfooxfxfooox', '*(fo|foo)'));
    assert(!isMatch('foooxfooxofoxfooox', '*(fo|foo)'));
    assert(!isMatch('foot', '*(fo|foo)'));
    assert(!isMatch('foox', '*(fo|foo)'));
    assert(!isMatch('ofoofo', '*(fo|foo)'));
    assert(!isMatch('ofooofoofofooo', '*(fo|foo)'));
    assert(!isMatch('ofoooxoofxo', '*(fo|foo)'));
    assert(!isMatch('ofoooxoofxoofoooxoofxo', '*(fo|foo)'));
    assert(!isMatch('ofoooxoofxoofoooxoofxofo', '*(fo|foo)'));
    assert(!isMatch('ofoooxoofxoofoooxoofxoo', '*(fo|foo)'));
    assert(!isMatch('ofoooxoofxoofoooxoofxooofxofxo', '*(fo|foo)'));
    assert(!isMatch('ofxoofxo', '*(fo|foo)'));
    assert(!isMatch('oofooofo', '*(fo|foo)'));
    assert(!isMatch('ooo', '*(fo|foo)'));
    assert(!isMatch('oxfoxfox', '*(fo|foo)'));
    assert(!isMatch('oxfoxoxfox', '*(fo|foo)'));
    assert(!isMatch('xfoooofof', '*(fo|foo)'));
  });

  it('should support exclusions', () => {
    assert(!isMatch('foob', '!(foo)b*'));
    assert(!isMatch('foobb', '!(foo)b*'));
    assert(!isMatch('foo', '!(foo)b*'));
    assert(isMatch('bar', '!(foo)b*'));
    assert(isMatch('baz', '!(foo)b*'));
    assert(!isMatch('foobar', '!(foo)b*'));

    assert(!isMatch('foo', '*(!(foo))'));
    assert(isMatch('bar', '*(!(foo))'));
    assert(isMatch('baz', '*(!(foo))'));
    assert(isMatch('foobar', '*(!(foo))'));

    // Bash 4.3 says this should match `foo` and `foobar`, which makes no sense
    assert(!isMatch('foo', '!(foo)*'));
    assert(!isMatch('foobar', '!(foo)*'));
    assert(isMatch('bar', '!(foo)*'));
    assert(isMatch('baz', '!(foo)*'));

    assert(!isMatch('moo.cow', '!(*.*)'));
    assert(isMatch('moo', '!(*.*)'));
    assert(isMatch('cow', '!(*.*)'));

    assert(isMatch('moo.cow', '!(a*).!(b*)'));
    assert(!isMatch('moo.cow', '!(*).!(*)'));
    assert(!isMatch('moo.cow.moo.cow', '!(*.*).!(*.*)'));
    assert(!isMatch('mad.moo.cow', '!(*.*).!(*.*)'));

    assert(!isMatch('moo.cow', '!(*.*).'));
    assert(!isMatch('moo', '!(*.*).'));
    assert(!isMatch('cow', '!(*.*).'));

    assert(!isMatch('moo.cow', '.!(*.*)'));
    assert(!isMatch('moo', '.!(*.*)'));
    assert(!isMatch('cow', '.!(*.*)'));

    assert(!isMatch('mucca.pazza', 'mu!(*(c))?.pa!(*(z))?'));

    assert(isMatch('effgz', '@(b+(c)d|e*(f)g?|?(h)i@(j|k))'));
    assert(isMatch('efgz', '@(b+(c)d|e*(f)g?|?(h)i@(j|k))'));
    assert(isMatch('egz', '@(b+(c)d|e*(f)g?|?(h)i@(j|k))'));
    assert(!isMatch('egz', '@(b+(c)d|e+(f)g?|?(h)i@(j|k))'));
    assert(isMatch('egzefffgzbcdij', '*(b+(c)d|e*(f)g?|?(h)i@(j|k))'));
  });

  it('valid numbers', () => {
    assert(isMatch('/dev/udp/129.22.8.102/45', '/dev/@(tcp|udp)/*/*'));

    assert(!isMatch('0', '[1-6]([0-9])'));
    assert(isMatch('12', '[1-6]([0-9])'));
    assert(!isMatch('1', '[1-6]([0-9])'));
    assert(!isMatch('12abc', '[1-6]([0-9])'));
    assert(!isMatch('555', '[1-6]([0-9])'));

    assert(!isMatch('0', '[1-6]*([0-9])'));
    assert(isMatch('12', '[1-6]*([0-9])'));
    assert(isMatch('1', '[1-6]*([0-9])'));
    assert(!isMatch('12abc', '[1-6]*([0-9])'));
    assert(isMatch('555', '[1-6]*([0-9])'));

    assert(!isMatch('0', '[1-5]*([6-9])'));
    assert(!isMatch('12', '[1-5]*([6-9])'));
    assert(isMatch('1', '[1-5]*([6-9])'));
    assert(!isMatch('12abc', '[1-5]*([6-9])'));
    assert(!isMatch('555', '[1-5]*([6-9])'));

    assert(isMatch('0', '0|[1-6]*([0-9])'));
    assert(isMatch('12', '0|[1-6]*([0-9])'));
    assert(isMatch('1', '0|[1-6]*([0-9])'));
    assert(!isMatch('12abc', '0|[1-6]*([0-9])'));
    assert(isMatch('555', '0|[1-6]*([0-9])'));

    assert(isMatch('07', '+([0-7])'));
    assert(isMatch('0377', '+([0-7])'));
    assert(!isMatch('09', '+([0-7])'));
  });

  it('check extended globbing in pattern removal', () => {
    assert(isMatch('a', '+(a|abc)'));
    assert(isMatch('abc', '+(a|abc)'));

    assert(!isMatch('abcd', '+(a|abc)'));
    assert(!isMatch('abcde', '+(a|abc)'));
    assert(!isMatch('abcedf', '+(a|abc)'));

    assert(isMatch('f', '+(def|f)'));
    assert(isMatch('def', '+(f|def)'));

    assert(!isMatch('cdef', '+(f|def)'));
    assert(!isMatch('bcdef', '+(f|def)'));
    assert(!isMatch('abcedf', '+(f|def)'));

    assert(isMatch('abcd', '*(a|b)cd'));

    assert(!isMatch('a', '*(a|b)cd'));
    assert(!isMatch('ab', '*(a|b)cd'));
    assert(!isMatch('abc', '*(a|b)cd'));

    assert(!isMatch('a', '"*(a|b)cd"'));
    assert(!isMatch('ab', '"*(a|b)cd"'));
    assert(!isMatch('abc', '"*(a|b)cd"'));
    assert(!isMatch('abcde', '"*(a|b)cd"'));
    assert(!isMatch('abcdef', '"*(a|b)cd"'));
  });

  it('More tests derived from a bug report (in bash) concerning extended glob patterns following a *', () => {
    assert(isMatch('/dev/udp/129.22.8.102/45', '/dev\\/@(tcp|udp)\\/*\\/*'));
    assert(!isMatch('123abc', '(a+|b)*'));
    assert(isMatch('ab', '(a+|b)*'));
    assert(isMatch('abab', '(a+|b)*'));
    assert(isMatch('abcdef', '(a+|b)*'));
    assert(isMatch('accdef', '(a+|b)*'));
    assert(isMatch('abcfefg', '(a+|b)*'));
    assert(isMatch('abef', '(a+|b)*'));
    assert(isMatch('abcfef', '(a+|b)*'));
    assert(isMatch('abd', '(a+|b)*'));
    assert(isMatch('acd', '(a+|b)*'));

    assert(!isMatch('123abc', '(a+|b)+'));
    assert(isMatch('ab', '(a+|b)+'));
    assert(isMatch('abab', '(a+|b)+'));
    assert(!isMatch('abcdef', '(a+|b)+'));
    assert(!isMatch('accdef', '(a+|b)+'));
    assert(!isMatch('abcfefg', '(a+|b)+'));
    assert(!isMatch('abef', '(a+|b)+'));
    assert(!isMatch('abcfef', '(a+|b)+'));
    assert(!isMatch('abd', '(a+|b)+'));
    assert(!isMatch('acd', '(a+|b)+'));

    assert(!isMatch('123abc', 'a(b*(foo|bar))d'));
    assert(!isMatch('ab', 'a(b*(foo|bar))d'));
    assert(!isMatch('abab', 'a(b*(foo|bar))d'));
    assert(!isMatch('abcdef', 'a(b*(foo|bar))d'));
    assert(!isMatch('accdef', 'a(b*(foo|bar))d'));
    assert(!isMatch('abcfefg', 'a(b*(foo|bar))d'));
    assert(!isMatch('abef', 'a(b*(foo|bar))d'));
    assert(!isMatch('abcfef', 'a(b*(foo|bar))d'));
    assert(isMatch('abd', 'a(b*(foo|bar))d'));
    assert(!isMatch('acd', 'a(b*(foo|bar))d'));

    assert(!isMatch('123abc', 'ab*(e|f)'));
    assert(isMatch('ab', 'ab*(e|f)'));
    assert(!isMatch('abab', 'ab*(e|f)'));
    assert(!isMatch('abcdef', 'ab*(e|f)'));
    assert(!isMatch('accdef', 'ab*(e|f)'));
    assert(!isMatch('abcfefg', 'ab*(e|f)'));
    assert(isMatch('abef', 'ab*(e|f)'));
    assert(!isMatch('abcfef', 'ab*(e|f)'));
    assert(!isMatch('abd', 'ab*(e|f)'));
    assert(!isMatch('acd', 'ab*(e|f)'));

    assert(!isMatch('123abc', 'ab**(e|f)'));
    assert(isMatch('ab', 'ab**(e|f)'));
    assert(isMatch('abab', 'ab**(e|f)'));
    assert(isMatch('abcdef', 'ab**(e|f)'));
    assert(!isMatch('accdef', 'ab**(e|f)'));
    assert(isMatch('abcfefg', 'ab**(e|f)'));
    assert(isMatch('abef', 'ab**(e|f)'));
    assert(isMatch('abcfef', 'ab**(e|f)'));
    assert(isMatch('abd', 'ab**(e|f)'));
    assert(!isMatch('acd', 'ab**(e|f)'));

    assert(!isMatch('123abc', 'ab**(e|f)g'));
    assert(!isMatch('ab', 'ab**(e|f)g'));
    assert(!isMatch('abab', 'ab**(e|f)g'));
    assert(!isMatch('abcdef', 'ab**(e|f)g'));
    assert(!isMatch('accdef', 'ab**(e|f)g'));
    assert(isMatch('abcfefg', 'ab**(e|f)g'));
    assert(!isMatch('abef', 'ab**(e|f)g'));
    assert(!isMatch('abcfef', 'ab**(e|f)g'));
    assert(!isMatch('abd', 'ab**(e|f)g'));
    assert(!isMatch('acd', 'ab**(e|f)g'));

    assert(!isMatch('123abc', 'ab***ef'));
    assert(!isMatch('ab', 'ab***ef'));
    assert(!isMatch('abab', 'ab***ef'));
    assert(isMatch('abcdef', 'ab***ef'));
    assert(!isMatch('accdef', 'ab***ef'));
    assert(!isMatch('abcfefg', 'ab***ef'));
    assert(isMatch('abef', 'ab***ef'));
    assert(isMatch('abcfef', 'ab***ef'));
    assert(!isMatch('abd', 'ab***ef'));
    assert(!isMatch('acd', 'ab***ef'));

    assert(!isMatch('123abc', 'ab*+(e|f)'));
    assert(!isMatch('ab', 'ab*+(e|f)'));
    assert(!isMatch('abab', 'ab*+(e|f)'));
    assert(isMatch('abcdef', 'ab*+(e|f)'));
    assert(!isMatch('accdef', 'ab*+(e|f)'));
    assert(!isMatch('abcfefg', 'ab*+(e|f)'));
    assert(isMatch('abef', 'ab*+(e|f)'));
    assert(isMatch('abcfef', 'ab*+(e|f)'));
    assert(!isMatch('abd', 'ab*+(e|f)'));
    assert(!isMatch('acd', 'ab*+(e|f)'));

    assert(!isMatch('123abc', 'ab*d*(e|f)'));
    assert(!isMatch('ab', 'ab*d*(e|f)'));
    assert(!isMatch('abab', 'ab*d*(e|f)'));
    assert(isMatch('abcdef', 'ab*d*(e|f)'));
    assert(!isMatch('accdef', 'ab*d*(e|f)'));
    assert(!isMatch('abcfefg', 'ab*d*(e|f)'));
    assert(!isMatch('abef', 'ab*d*(e|f)'));
    assert(!isMatch('abcfef', 'ab*d*(e|f)'));
    assert(isMatch('abd', 'ab*d*(e|f)'));
    assert(!isMatch('acd', 'ab*d*(e|f)'));

    assert(!isMatch('123abc', 'ab*d+(e|f)'));
    assert(!isMatch('ab', 'ab*d+(e|f)'));
    assert(!isMatch('abab', 'ab*d+(e|f)'));
    assert(isMatch('abcdef', 'ab*d+(e|f)'));
    assert(!isMatch('accdef', 'ab*d+(e|f)'));
    assert(!isMatch('abcfefg', 'ab*d+(e|f)'));
    assert(!isMatch('abef', 'ab*d+(e|f)'));
    assert(!isMatch('abcfef', 'ab*d+(e|f)'));
    assert(!isMatch('abd', 'ab*d+(e|f)'));
    assert(!isMatch('acd', 'ab*d+(e|f)'));

    assert(!isMatch('123abc', 'ab?*(e|f)'));
    assert(!isMatch('ab', 'ab?*(e|f)'));
    assert(!isMatch('abab', 'ab?*(e|f)'));
    assert(!isMatch('abcdef', 'ab?*(e|f)'));
    assert(!isMatch('accdef', 'ab?*(e|f)'));
    assert(!isMatch('abcfefg', 'ab?*(e|f)'));
    assert(isMatch('abef', 'ab?*(e|f)'));
    assert(isMatch('abcfef', 'ab?*(e|f)'));
    assert(isMatch('abd', 'ab?*(e|f)'));
    assert(!isMatch('acd', 'ab?*(e|f)'));
  });

  it('bug in all versions up to and including bash-2.05b', () => {
    assert(isMatch('123abc', '*?(a)bc'));
  });

  it('should work with character classes', () => {
    let opts = { posix: true };
    assert(isMatch('a.b', 'a[^[:alnum:]]b', opts));
    assert(isMatch('a,b', 'a[^[:alnum:]]b', opts));
    assert(isMatch('a:b', 'a[^[:alnum:]]b', opts));
    assert(isMatch('a-b', 'a[^[:alnum:]]b', opts));
    assert(isMatch('a;b', 'a[^[:alnum:]]b', opts));
    assert(isMatch('a b', 'a[^[:alnum:]]b', opts));
    assert(isMatch('a_b', 'a[^[:alnum:]]b', opts));

    assert(isMatch('a.b', 'a[-.,:\\;\\ _]b'));
    assert(isMatch('a,b', 'a[-.,:\\;\\ _]b'));
    assert(isMatch('a:b', 'a[-.,:\\;\\ _]b'));
    assert(isMatch('a-b', 'a[-.,:\\;\\ _]b'));
    assert(isMatch('a;b', 'a[-.,:\\;\\ _]b'));
    assert(isMatch('a b', 'a[-.,:\\;\\ _]b'));
    assert(isMatch('a_b', 'a[-.,:\\;\\ _]b'));

    assert(isMatch('a.b', 'a@([^[:alnum:]])b', opts));
    assert(isMatch('a,b', 'a@([^[:alnum:]])b', opts));
    assert(isMatch('a:b', 'a@([^[:alnum:]])b', opts));
    assert(isMatch('a-b', 'a@([^[:alnum:]])b', opts));
    assert(isMatch('a;b', 'a@([^[:alnum:]])b', opts));
    assert(isMatch('a b', 'a@([^[:alnum:]])b', opts));
    assert(isMatch('a_b', 'a@([^[:alnum:]])b', opts));

    assert(isMatch('a.b', 'a@([-.,:; _])b'));
    assert(isMatch('a,b', 'a@([-.,:; _])b'));
    assert(isMatch('a:b', 'a@([-.,:; _])b'));
    assert(isMatch('a-b', 'a@([-.,:; _])b'));
    assert(isMatch('a;b', 'a@([-.,:; _])b'));
    assert(isMatch('a b', 'a@([-.,:; _])b'));
    assert(isMatch('a_b', 'a@([-.,:; _])b'));

    assert(isMatch('a.b', 'a@([.])b'));
    assert(!isMatch('a,b', 'a@([.])b'));
    assert(!isMatch('a:b', 'a@([.])b'));
    assert(!isMatch('a-b', 'a@([.])b'));
    assert(!isMatch('a;b', 'a@([.])b'));
    assert(!isMatch('a b', 'a@([.])b'));
    assert(!isMatch('a_b', 'a@([.])b'));

    assert(!isMatch('a.b', 'a@([^.])b'));
    assert(isMatch('a,b', 'a@([^.])b'));
    assert(isMatch('a:b', 'a@([^.])b'));
    assert(isMatch('a-b', 'a@([^.])b'));
    assert(isMatch('a;b', 'a@([^.])b'));
    assert(isMatch('a b', 'a@([^.])b'));
    assert(isMatch('a_b', 'a@([^.])b'));

    assert(isMatch('a.b', 'a@([^x])b'));
    assert(isMatch('a,b', 'a@([^x])b'));
    assert(isMatch('a:b', 'a@([^x])b'));
    assert(isMatch('a-b', 'a@([^x])b'));
    assert(isMatch('a;b', 'a@([^x])b'));
    assert(isMatch('a b', 'a@([^x])b'));
    assert(isMatch('a_b', 'a@([^x])b'));

    assert(isMatch('a.b', 'a+([^[:alnum:]])b', opts));
    assert(isMatch('a,b', 'a+([^[:alnum:]])b', opts));
    assert(isMatch('a:b', 'a+([^[:alnum:]])b', opts));
    assert(isMatch('a-b', 'a+([^[:alnum:]])b', opts));
    assert(isMatch('a;b', 'a+([^[:alnum:]])b', opts));
    assert(isMatch('a b', 'a+([^[:alnum:]])b', opts));
    assert(isMatch('a_b', 'a+([^[:alnum:]])b', opts));

    assert(isMatch('a.b', 'a@(.|[^[:alnum:]])b', opts));
    assert(isMatch('a,b', 'a@(.|[^[:alnum:]])b', opts));
    assert(isMatch('a:b', 'a@(.|[^[:alnum:]])b', opts));
    assert(isMatch('a-b', 'a@(.|[^[:alnum:]])b', opts));
    assert(isMatch('a;b', 'a@(.|[^[:alnum:]])b', opts));
    assert(isMatch('a b', 'a@(.|[^[:alnum:]])b', opts));
    assert(isMatch('a_b', 'a@(.|[^[:alnum:]])b', opts));
  });

  it('should support POSIX character classes in extglobs', () => {
    let opts = { posix: true };
    assert(isMatch('a.c', '+([[:alpha:].])', opts));
    assert(isMatch('a.c', '+([[:alpha:].])+([[:alpha:].])', opts));
    assert(isMatch('a.c', '*([[:alpha:].])', opts));
    assert(isMatch('a.c', '*([[:alpha:].])*([[:alpha:].])', opts));
    assert(isMatch('a.c', '?([[:alpha:].])?([[:alpha:].])?([[:alpha:].])', opts));
    assert(isMatch('a.c', '@([[:alpha:].])@([[:alpha:].])@([[:alpha:].])', opts));
    assert(!isMatch('.', '!(\\.)', opts));
    assert(!isMatch('.', '!([[:alpha:].])', opts));
    assert(isMatch('.', '?([[:alpha:].])', opts));
    assert(isMatch('.', '@([[:alpha:].])', opts));
  });

  // ported from http://www.bashcookbook.com/bashinfo/source/bash-4.3/tests/extglob2.tests
  it('should pass extglob2 tests', () => {
    assert(!isMatch('baaac', '*(@(a))a@(c)'));
    assert(!isMatch('c', '*(@(a))a@(c)'));
    assert(!isMatch('egz', '@(b+(c)d|e+(f)g?|?(h)i@(j|k))'));
    assert(!isMatch('foooofof', '*(f+(o))'));
    assert(!isMatch('foooofofx', '*(f*(o))'));
    assert(!isMatch('foooxfooxofoxfooox', '*(f*(o)x)'));
    assert(!isMatch('ofooofoofofooo', '*(f*(o))'));
    assert(!isMatch('ofoooxoofxoofoooxoofxofo', '*(*(of*(o)x)o)'));
    assert(!isMatch('oxfoxfox', '*(oxf+(ox))'));
    assert(!isMatch('xfoooofof', '*(f*(o))'));
    assert(isMatch('aaac', '*(@(a))a@(c)'));
    assert(isMatch('aac', '*(@(a))a@(c)'));
    assert(isMatch('abbcd', '@(ab|a*(b))*(c)d'));
    assert(isMatch('abcd', '?@(a|b)*@(c)d'));
    assert(isMatch('abcd', '@(ab|a*@(b))*(c)d'));
    assert(isMatch('ac', '*(@(a))a@(c)'));
    assert(isMatch('acd', '@(ab|a*(b))*(c)d'));
    assert(isMatch('effgz', '@(b+(c)d|e*(f)g?|?(h)i@(j|k))'));
    assert(isMatch('efgz', '@(b+(c)d|e*(f)g?|?(h)i@(j|k))'));
    assert(isMatch('egz', '@(b+(c)d|e*(f)g?|?(h)i@(j|k))'));
    assert(isMatch('egzefffgzbcdij', '*(b+(c)d|e*(f)g?|?(h)i@(j|k))'));
    assert(isMatch('fffooofoooooffoofffooofff', '*(*(f)*(o))'));
    assert(isMatch('ffo', '*(f*(o))'));
    assert(isMatch('fofo', '*(f*(o))'));
    assert(isMatch('foofoofo', '@(foo|f|fo)*(f|of+(o))'));
    assert(isMatch('fooofoofofooo', '*(f*(o))'));
    assert(isMatch('foooofo', '*(f*(o))'));
    assert(isMatch('foooofof', '*(f*(o))'));
    assert(isMatch('foooxfooxfoxfooox', '*(f*(o)x)'));
    assert(isMatch('foooxfooxfxfooox', '*(f*(o)x)'));
    assert(isMatch('ofoofo', '*(of+(o))'));
    assert(isMatch('ofoofo', '*(of+(o)|f)'));
    assert(isMatch('ofoooxoofxo', '*(*(of*(o)x)o)'));
    assert(isMatch('ofoooxoofxoofoooxoofxo', '*(*(of*(o)x)o)'));
    assert(isMatch('ofoooxoofxoofoooxoofxoo', '*(*(of*(o)x)o)'));
    assert(isMatch('ofoooxoofxoofoooxoofxooofxofxo', '*(*(of*(o)x)o)'));
    assert(isMatch('ofxoofxo', '*(*(of*(o)x)o)'));
    assert(isMatch('oofooofo', '*(of|oof+(o))'));
    assert(isMatch('oxfoxoxfox', '*(oxf+(ox))'));
  });

  it('should support backtracking in alternation matches', () => {
    assert(isMatch('fofoofoofofoo', '*(fo|foo)'));
  });

  it('should support exclusions', () => {
    assert(!isMatch('f', '!(f)'));
    assert(!isMatch('f', '*(!(f))'));
    assert(!isMatch('f', '+(!(f))'));
    assert(!isMatch('foo', '!(foo)'));
    assert(!isMatch('foob', '!(foo)b*'));
    assert(!isMatch('mad.moo.cow', '!(*.*).!(*.*)'));
    assert(!isMatch('mucca.pazza', 'mu!(*(c))?.pa!(*(z))?'));
    assert(!isMatch('zoot', '@(!(z*)|*x)'));
    assert(isMatch('fff', '!(f)'));
    assert(isMatch('fff', '*(!(f))'));
    assert(isMatch('fff', '+(!(f))'));
    assert(isMatch('foo', '!(f)'));
    assert(isMatch('foo', '!(x)'));
    assert(isMatch('foo', '!(x)*'));
    assert(isMatch('foo', '*(!(f))'));
    assert(isMatch('foo', '+(!(f))'));
    assert(isMatch('foobar', '!(foo)'));
    assert(isMatch('foot', '@(!(z*)|*x)'));
    assert(isMatch('foox', '@(!(z*)|*x)'));
    assert(isMatch('ooo', '!(f)'));
    assert(isMatch('ooo', '*(!(f))'));
    assert(isMatch('ooo', '+(!(f))'));
    assert(isMatch('zoox', '@(!(z*)|*x)'));
  });
});
