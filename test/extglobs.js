'use strict';

var path = require('path');
var assert = require('assert');
var mm = require('./support/match');
var sep = path.sep;

/**
 * These tests were converted directly from bash 4.3 and 4.4 unit tests.
 */

describe('extglobs', function() {
  beforeEach(function() {
    path.sep = '\\';
  });
  afterEach(function() {
    path.sep = sep;
  });

  it('should match extglobs ending with statechar', function() {
    // from minimatch tests
    assert(!mm.isMatch('ax', 'a?(b*)'));
    assert(mm.isMatch('ax', '?(a*|b)'));
  });

  it('should match extended globs:', function() {
    mm(['a.js.js', 'a.md.js'], '*.*(js).js', ['a.js.js']);
    mm(['a/z', 'a/b', 'a/!(z)'], 'a/!(z)', ['a/!(z)', 'a/b']);
    mm(['c/z/v'], 'c/z/v', ['c/z/v']);
    mm(['c/a/v'], 'c/!(z)/v', ['c/a/v']);
    mm(['c/z/v', 'c/a/v'], 'c/!(z)/v', ['c/a/v']);
    mm(['c/z/v', 'c/a/v'], 'c/@(z)/v', ['c/z/v']);
    mm(['c/z/v', 'c/a/v'], 'c/+(z)/v', ['c/z/v']);
    mm(['c/z/v', 'c/a/v'], 'c/*(z)/v', ['c/z/v']);
    mm(['c/z/v', 'z', 'zf', 'fz'], '?(z)', ['z']);
    mm(['c/z/v', 'z', 'zf', 'fz'], '+(z)', ['z']);
    mm(['c/z/v', 'z', 'zf', 'fz'], '*(z)', ['z']);
    mm(['cz', 'abz', 'az'], 'a@(z)', ['az']);
    mm(['cz', 'abz', 'az'], 'a*@(z)', ['az', 'abz']);
    mm(['cz', 'abz', 'az'], 'a!(z)', ['abz']);
    mm(['cz', 'abz', 'az'], 'a?(z)', ['az']);
    mm(['cz', 'abz', 'az'], 'a+(z)', ['az']);
    mm(['az', 'bz', 'axz'], 'a+(z)', ['az']);
    mm(['cz', 'abz', 'az'], 'a*(z)', ['az']);
    mm(['cz', 'abz', 'az'], 'a**(z)', ['az', 'abz']);
    mm(['cz', 'abz', 'az'], 'a*!(z)', ['az', 'abz']);
  });

  it('should support negation', function() {
    var arr = ['a', 'b', 'aa', 'ab', 'bb', 'ac', 'aaa', 'aab', 'abb', 'ccc'];
    mm(arr, '!(a)*', ['b', 'bb', 'ccc']);
    mm(arr, 'a!(b)*', ['a', 'aa', 'aaa', 'aab', 'ac']);
    mm(['foo'], '!(foo)', []);
    mm(['foo.js'], '!(foo).js', []);
  });

  it('should match exactly one of the given pattern:', function() {
    var arr = ['aa.aa', 'a.bb', 'a.aa.a', 'cc.a', 'a.a', 'c.a', 'dd.aa.d', 'b.a'];
    mm(arr, '(b|a).(a)', ['a.a', 'b.a']);
    mm(arr, '@(b|a).@(a)', ['a.a', 'b.a']);
  });

  it('should work with globs', function() {
    var arr = ['123abc', 'ab', 'abab', 'abcdef', 'accdef', 'abcfefg', 'abef', 'abcfef', 'abd', 'acd'];
    mm(arr, 'ab*(e|f)', ['ab', 'abef']);
    mm(arr, 'ab?*(e|f)', ['abd', 'abef', 'abcfef']);
    mm(arr, 'ab*d+(e|f)', ['abcdef']);
    mm(arr, 'ab**(e|f)', ['ab', 'abab', 'abcdef', 'abcfefg', 'abcfef', 'abef', 'abd']);
    mm(arr, 'ab*+(e|f)', ['abcdef', 'abcfef', 'abef']);
    mm(arr, 'ab**(e|f)g', ['abcfefg']);
    mm(arr, 'ab***ef', ['abcdef', 'abcfef', 'abef']);
    mm(arr, 'ab**', ['ab', 'abab', 'abcdef', 'abcfef', 'abcfefg', 'abd', 'abef']);
    mm(arr, '*?(a)bc', ['123abc']);
    mm(arr, 'a(b*(foo|bar))d', ['abd']);
    mm(arr, '(a+|b)+', ['ab', 'abab']);
    mm(arr, '(a+|b)*', ['ab', 'abab', 'accdef', 'abcdef', 'abcfefg', 'abef', 'abcfef', 'abd', 'acd']);
    mm(['/dev/udp/129.22.8.102/45'], '/dev\\/@(tcp|udp)\\/*\\/*', ['/dev/udp/129.22.8.102/45']);
    mm(['12', '1', '12abc'], '0|[1-9]*([0-9])', ['1', '12'], 'Should match valid numbers');
    mm(['07', '0377', '09'], '+([0-7])', ['0377', '07'], 'Should match octal numbers');
  });

  it('stuff from korn\'s book', function() {
    assert(mm.isMatch('paragraph', 'para@(chute|graph)'));
    assert(!mm.isMatch('paramour', 'para@(chute|graph)'));
    assert(mm.isMatch('para991', 'para?([345]|99)1'));
    assert(!mm.isMatch('para381', 'para?([345]|99)1'));
    assert(!mm.isMatch('paragraph', 'para*([0-9])'));
    assert(mm.isMatch('para', 'para*([0-9])'));
    assert(mm.isMatch('para13829383746592', 'para*([0-9])'));
    assert(!mm.isMatch('paragraph', 'para*([0-9])'));
    assert(!mm.isMatch('para', 'para+([0-9])'));
    assert(mm.isMatch('para987346523', 'para+([0-9])'));
    assert(mm.isMatch('paragraph', 'para!(*.[0-9])'));
    assert(mm.isMatch('para.38', 'para!(*.[00-09])'));
    assert(mm.isMatch('para.graph', 'para!(*.[0-9])'));
    assert(mm.isMatch('para39', 'para!(*.[0-9])'));
  });

  it('tests derived from those in rosenblatt\'s korn shell book', function() {
    mm(['', '137577991', '2468'], '*(0|1|3|5|7|9)', ['', '137577991']);
    mm(['file.c', 'file.C', 'file.cc', 'file.ccc'], '*.c?(c)', ['file.c', 'file.cc']);
    mm(['parse.y', 'shell.c', 'Makefile', 'Makefile.in'], '!(*.c|*.h|Makefile.in|config*|README)', ['parse.y', 'Makefile']);
    mm(['VMS.FILE;', 'VMS.FILE;0', 'VMS.FILE;1', 'VMS.FILE;139', 'VMS.FILE;1N'], '*\\;[1-9]*([0-9])', ['VMS.FILE;1', 'VMS.FILE;139']);
  });

  it('tests derived from the pd-ksh test suite', function() {
    mm(['abcx', 'abcz', 'bbc'], '!([[*])*', ['abcx', 'abcz', 'bbc']);
    mm(['abcx', 'abcz', 'bbc'], '+(a|b\\[)*', ['abcx', 'abcz']);
    mm(['abd', 'acd'], 'a+(b|c)d', ['abd', 'acd']);
    mm(['abd', 'acd', 'ac', 'ab'], 'a!(@(b|B))', ['acd', 'abd', 'ac']);
    mm(['abd', 'acd'], 'a!(@(b|B))d', ['acd']);
    mm(['abd', 'acd'], 'a[b*(foo|bar)]d', ['abd']);
    mm(['abcx', 'abcz', 'bbc', 'aaz', 'aaaz'], '[a*(]*z', ['aaz', 'aaaz'], {bash: false});
    mm(['abcx', 'abcz', 'bbc', 'aaz', 'aaaz'], '[a*(]*z', ['aaz', 'aaaz', 'abcz']);
  });

  it('simple kleene star tests', function() {
    assert(!mm.isMatch('foo', '*(a|b\\[)'));
    assert(mm.isMatch('foo', '*(a|b\\[)|f*'));
  });

  it('this doesn\'t work in bash either (per bash micromatch.tests notes)', function() {
    assert(!mm.isMatch('*(a|b[)', '*(a|b\\[)'));
    assert(mm.isMatch('*(a|b[)', '\\*\\(a\\|b\\[\\)'));
  });

  it('should support multiple exclusion patterns in one extglob:', function() {
    var arr = ['a.a', 'a.b', 'a.c', 'a.c.d', 'c.c', 'a.', 'd.d', 'e.e', 'f.f', 'a.abcd'];
    mm(arr, '*.(a|b|@(ab|a*@(b))*(c)d)', ['a.a', 'a.b', 'a.abcd']);
    mm(arr, '!(*.a|*.b|*.c)', ['a.', 'a.c.d', 'd.d', 'e.e', 'f.f']);
    mm(arr, '*!(.a|.b|.c)', arr);
    mm(arr, '*.!(a|b|c)', ['a.c.d', 'a.', 'd.d', 'e.e', 'f.f']);
  });

  it('should correctly match empty parens', function() {
    mm(['def', 'ef'], '()ef', ['ef']);
  });

  it('should match parens', function() {
    var arr = ['a(b', 'a\\(b', 'a((b', 'a((((b', 'ab'];
    mm(arr, 'a(b', ['a(b']);
    mm(arr, 'a(*b', ['a(b', 'a((b', 'a((((b']);
    mm(['a(b', 'a((b', 'a((((b', 'ab'], 'a\\(b', ['a(b']);
    mm(['a(b', 'a((b', 'a((((b', 'ab'], 'a(b', ['a(b']);
  });

  it('should match escaped backslashes', function() {
    mm(['a\\b', 'a/b', 'ab'], 'a\\b', ['a\\b'], {unixify: false});
    mm(['a\\\\z', 'a\\z', 'a\\z', 'az'], 'a\\\\z', ['a\\\\z'], {unixify: false});

    mm(['a\\b', 'a/b', 'ab'], 'a\\b', ['a/b']);
    mm(['a\\\\z', 'a\\z', 'a\\z', 'az'], 'a\\\\z', ['a/z']);
  });
});

describe('bash', function() {
  it('should match extended globs from the bash spec:', function() {
    assert(mm.isMatch('fofo', '*(f*(o))'));
    assert(mm.isMatch('ffo', '*(f*(o))'));
    assert(mm.isMatch('foooofo', '*(f*(o))'));
    assert(mm.isMatch('foooofof', '*(f*(o))'));
    assert(mm.isMatch('fooofoofofooo', '*(f*(o))'));
    assert(!mm.isMatch('foooofof', '*(f+(o))'));
    assert(!mm.isMatch('xfoooofof', '*(f*(o))'));
    assert(!mm.isMatch('foooofofx', '*(f*(o))'));
    assert(mm.isMatch('ofxoofxo', '*(*(of*(o)x)o)'));
    assert(!mm.isMatch('ofooofoofofooo', '*(f*(o))'));
    assert(mm.isMatch('foooxfooxfoxfooox', '*(f*(o)x)'));
    assert(!mm.isMatch('foooxfooxofoxfooox', '*(f*(o)x)'));
    assert(mm.isMatch('foooxfooxfxfooox', '*(f*(o)x)'));
    assert(mm.isMatch('ofxoofxo', '*(*(of*(o)x)o)'));
    assert(mm.isMatch('ofoooxoofxo', '*(*(of*(o)x)o)'));
    assert(mm.isMatch('ofoooxoofxoofoooxoofxo', '*(*(of*(o)x)o)'));
    assert(mm.isMatch('ofoooxoofxoofoooxoofxoo', '*(*(of*(o)x)o)'));
    assert(!mm.isMatch('ofoooxoofxoofoooxoofxofo', '*(*(of*(o)x)o)'));
    assert(mm.isMatch('ofoooxoofxoofoooxoofxooofxofxo', '*(*(of*(o)x)o)'));
    assert(mm.isMatch('aac', '*(@(a))a@(c)'));
    assert(mm.isMatch('ac', '*(@(a))a@(c)'));
    assert(!mm.isMatch('c', '*(@(a))a@(c)'));
    assert(mm.isMatch('aaac', '*(@(a))a@(c)'));
    assert(!mm.isMatch('baaac', '*(@(a))a@(c)'));
    assert(mm.isMatch('abcd', '?@(a|b)*@(c)d'));
    assert(mm.isMatch('abcd', '@(ab|a*@(b))*(c)d'));
    assert(mm.isMatch('acd', '@(ab|a*(b))*(c)d'));
    assert(mm.isMatch('abbcd', '@(ab|a*(b))*(c)d'));
    assert(mm.isMatch('effgz', '@(b+(c)d|e*(f)g?|?(h)i@(j|k))'));
    assert(mm.isMatch('efgz', '@(b+(c)d|e*(f)g?|?(h)i@(j|k))'));
    assert(mm.isMatch('egz', '@(b+(c)d|e*(f)g?|?(h)i@(j|k))'));
    assert(mm.isMatch('egzefffgzbcdij', '*(b+(c)d|e*(f)g?|?(h)i@(j|k))'));
    assert(!mm.isMatch('egz', '@(b+(c)d|e+(f)g?|?(h)i@(j|k))'));
    assert(mm.isMatch('ofoofo', '*(of+(o))'));
    assert(mm.isMatch('oxfoxoxfox', '*(oxf+(ox))'));
    assert(!mm.isMatch('oxfoxfox', '*(oxf+(ox))'));
    assert(mm.isMatch('ofoofo', '*(of+(o)|f)'));
    assert(mm.isMatch('foofoofo', '@(foo|f|fo)*(f|of+(o))'), 'Should match as fo+ofo+ofo');
    assert(mm.isMatch('oofooofo', '*(of|oof+(o))'));
    assert(mm.isMatch('fffooofoooooffoofffooofff', '*(*(f)*(o))'));
    assert(mm.isMatch('fofoofoofofoo', '*(fo|foo)'), 'Should backtrack in alternation matches');
  });

  it('should support exclusions', function() {
    mm(['foob', 'foobb', 'foo', 'bar', 'baz', 'foobar'], '!(foo)b*', ['bar', 'baz']);
    // Bash 4.3 says this should match `foo` too. Probably a bug in Bash since this is correct.
    mm(['foo', 'bar', 'baz', 'foobar'], '*(!(foo))', ['bar', 'baz', 'foobar']);
    // Bash 4.3 says this should match `foo` and `foobar` too, probably a bug in Bash since this is correct.
    mm(['foo', 'bar', 'baz', 'foobar'], '!(foo)*', ['bar', 'baz']);

    mm(['moo.cow', 'moo', 'cow'], '!(*.*)', ['moo', 'cow']);
    mm(['moo.cow', 'moo', 'cow'], '!(*.*).', []);
    assert(!mm.isMatch('f', '!(f)'));
    assert(!mm.isMatch('f', '+(!(f))'));
    assert(!mm.isMatch('f', '*(!(f))'));
    assert(!mm.isMatch('mad.moo.cow', '!(*.*).!(*.*)'));
    assert(!mm.isMatch('mucca.pazza', 'mu!(*(c))?.pa!(*(z))?'));
    assert(!mm.isMatch('zoot', '@(!(z*)|*x)'));
    assert(mm.isMatch('foo', '!(x)'));
    assert(mm.isMatch('foo', '!(x)*'));
    assert(mm.isMatch('foot', '@(!(z*)|*x)'));
    assert(mm.isMatch('foox', '@(!(z*)|*x)'));
    assert(mm.isMatch('ooo', '!(f)'));
    assert(mm.isMatch('ooo', '*(!(f))'));
    assert(mm.isMatch('ooo', '+(!(f))'));
    assert(mm.isMatch('zoox', '@(!(z*)|*x)'));
    mm(['aaac', 'foo'], '*(@(a))a@(c)', ['aaac']);
    mm(['aaac'], '*(@(a))a@(c)', ['aaac']);
    mm(['aac'], '*(@(a))a@(c)', ['aac']);
    mm(['aac'], '*(@(a))b@(c)', []);
    mm(['abbcd'], '@(ab|a*(b))*(c)d', ['abbcd']);
    mm(['abcd'], '?@(a|b)*@(c)d', ['abcd']);
    mm(['abcd'], '@(ab|a*@(b))*(c)d', ['abcd']);
    mm(['ac'], '*(@(a))a@(c)', ['ac']);
    mm(['acd'], '@(ab|a*(b))*(c)d', ['acd']);
    mm(['baaac'], '*(@(a))a@(c)', []);
    mm(['c'], '*(@(a))a@(c)', []);
    mm(['effgz'], '@(b+(c)d|e*(f)g?|?(h)i@(j|k))', ['effgz']);
    mm(['efgz'], '@(b+(c)d|e*(f)g?|?(h)i@(j|k))', ['efgz']);
    mm(['egz'], '@(b+(c)d|e*(f)g?|?(h)i@(j|k))', ['egz']);
    mm(['egz'], '@(b+(c)d|e+(f)g?|?(h)i@(j|k))', []);
    mm(['egzefffgzbcdij'], '*(b+(c)d|e*(f)g?|?(h)i@(j|k))', ['egzefffgzbcdij']);
    mm(['f'], '!(f)', []);
    mm(['f'], '*(!(f))', []);
    mm(['f'], '+(!(f))', []);
    mm(['fa', 'fb', 'f', 'fo'], '!(f!(o))', ['fo']);
    mm(['fa', 'fb', 'f', 'fo'], '!(f(o))', ['f', 'fb', 'fa']);
    mm(['fff', 'foo', 'ooo', 'f'], '*(!(f))', ['fff', 'ooo', 'foo']);
    mm(['fff'], '!(f)', ['fff']);
    mm(['fff'], '*(!(f))', ['fff']);
    mm(['fff'], '+(!(f))', ['fff']);
    mm(['fffooofoooooffoofffooofff'], '*(*(f)*(o))', ['fffooofoooooffoofffooofff']);
    mm(['ffo'], '*(f*(o))', ['ffo']);
    mm(['fofo'], '*(f*(o))', ['fofo']);
    mm(['fofoofoofofoo'], '*(fo|foo)', ['fofoofoofofoo']);
    mm(['foo', 'bar'], '!(foo)', ['bar']);
    mm(['foo'], '!(!(foo))', ['foo']);
    mm(['foo'], '!(f)', ['foo']);
    mm(['foo'], '!(x)', ['foo']);
    mm(['foo'], '!(x)*', ['foo']);
    mm(['foo'], '*(!(f))', ['foo']);
    mm(['foo'], '*((foo))', ['foo']);
    mm(['foo'], '+(!(f))', ['foo']);
    mm(['foo/bar'], 'foo/!(foo)', ['foo/bar']);
    mm(['foob', 'foobb'], '(foo)bb', ['foobb']);
    mm(['foobar'], '!(foo)', ['foobar']);
    mm(['foofoofo'], '@(foo|f|fo)*(f|of+(o))', ['foofoofo']);
    mm(['fooofoofofooo'], '*(f*(o))', ['fooofoofofooo']);
    mm(['foooofo'], '*(f*(o))', ['foooofo']);
    mm(['foooofof'], '*(f*(o))', ['foooofof']);
    mm(['foooofof'], '*(f+(o))', []);
    mm(['foooofofx'], '*(f*(o))', []);
    mm(['foooxfooxfoxfooox'], '*(f*(o)x)', ['foooxfooxfoxfooox']);
    mm(['foooxfooxfxfooox'], '*(f*(o)x)', ['foooxfooxfxfooox']);
    mm(['foooxfooxofoxfooox'], '*(f*(o)x)', []);
    mm(['foot'], '@(!(z*)|*x)', ['foot']);
    mm(['foox'], '@(!(z*)|*x)', ['foox']);
    mm(['mad.moo.cow'], '!(*.*).!(*.*)', []);
    mm(['moo.cow', 'moo', 'cow'], '.!(*.*)', []);
    mm(['ofoofo'], '*(of+(o))', ['ofoofo']);
    mm(['ofoofo'], '*(of+(o)|f)', ['ofoofo']);
    mm(['ofooofoofofooo'], '*(f*(o))', []);
    mm(['ofoooxoofxo'], '*(*(of*(o)x)o)', ['ofoooxoofxo']);
    mm(['ofoooxoofxoofoooxoofxo'], '*(*(of*(o)x)o)', ['ofoooxoofxoofoooxoofxo']);
    mm(['ofoooxoofxoofoooxoofxofo'], '*(*(of*(o)x)o)', []);
    mm(['ofoooxoofxoofoooxoofxoo'], '*(*(of*(o)x)o)', ['ofoooxoofxoofoooxoofxoo']);
    mm(['ofoooxoofxoofoooxoofxooofxofxo'], '*(*(of*(o)x)o)', ['ofoooxoofxoofoooxoofxooofxofxo']);
    mm(['ofxoofxo'], '*(*(of*(o)x)o)', ['ofxoofxo']);
    mm(['oofooofo'], '*(of|oof+(o))', ['oofooofo']);
    mm(['ooo'], '!(f)', ['ooo']);
    mm(['ooo'], '*(!(f))', ['ooo']);
    mm(['ooo'], '+(!(f))', ['ooo']);
    mm(['oxfoxfox'], '*(oxf+(ox))', []);
    mm(['oxfoxoxfox'], '*(oxf+(ox))', ['oxfoxoxfox']);
    mm(['xfoooofof'], '*(f*(o))', []);
    mm(['zoot'], '@(!(z*)|*x)', []);
    mm(['zoox'], '@(!(z*)|*x)', ['zoox']);
  });

  it('should support basic wildmatch features', function() {
    assert(!mm.isMatch('foo', '*f'));
    assert(!mm.isMatch('foo', '??'));
    assert(!mm.isMatch('foo', 'bar'));
    assert(!mm.isMatch('foobar', 'foo\\*bar'));
    assert(!mm.isMatch('abc', '\\a\\b\\c'));
    assert(mm.isMatch('', ''));
    assert(mm.isMatch('?a?b', '\\??\\?b'));
    assert(mm.isMatch('aaaaaaabababab', '*ab'));
    assert(mm.isMatch('\\x\\y\\z', '\\x\\y\\z'));
    assert(mm.isMatch('/x/y/z', '/x/y/z'));
    assert(mm.isMatch('f\\oo', 'f\\oo'));
    assert(mm.isMatch('foo', '*'));
    assert(mm.isMatch('foo', '*foo*'));
    assert(mm.isMatch('foo', '???'));
    assert(mm.isMatch('foo', 'f*'));
    assert(mm.isMatch('foo', 'foo'));
    assert(mm.isMatch('foo*', 'foo\\*', {unixify: false}));
    assert(mm.isMatch('foobar', '*ob*a*r*'));
  });

  it('Test recursion and the abort code', function() {
    assert(mm.isMatch('-adobe-courier-bold-o-normal--12-120-75-75-m-70-iso8859-1', '-*-*-*-*-*-*-12-*-*-*-m-*-*-*'));
    assert(!mm.isMatch('-adobe-courier-bold-o-normal--12-120-75-75-X-70-iso8859-1', '-*-*-*-*-*-*-12-*-*-*-m-*-*-*'));
    assert(!mm.isMatch('-adobe-courier-bold-o-normal--12-120-75-75-/-70-iso8859-1', '-*-*-*-*-*-*-12-*-*-*-m-*-*-*'));
    assert(mm.isMatch('XXX/adobe/courier/bold/o/normal//12/120/75/75/m/70/iso8859/1', 'XXX/*/*/*/*/*/*/12/*/*/*/m/*/*/*', {unixify: false}));
    assert(!mm.isMatch('XXX/adobe/courier/bold/o/normal//12/120/75/75/X/70/iso8859/1', 'XXX/*/*/*/*/*/*/12/*/*/*/m/*/*/*'));
    assert(mm.isMatch('abcd/abcdefg/abcdefghijk/abcdefghijklmnop.txt', '**/*a*b*g*n*t'));
    assert(!mm.isMatch('abcd/abcdefg/abcdefghijk/abcdefghijklmnop.txtz', '**/*a*b*g*n*t'));
    assert(!mm.isMatch('foo', '*/*/*'));
    assert(!mm.isMatch('foo/bar', '*/*/*'));
    assert(mm.isMatch('foo/bba/arr', '*/*/*'));
    assert(!mm.isMatch('foo/bb/aa/rr', '*/*/*'));
    assert(mm.isMatch('foo/bb/aa/rr', '**/**/**'));
    assert(mm.isMatch('abcXdefXghi', '*X*i'));
    assert(!mm.isMatch('ab/cXd/efXg/hi', '*X*i'));
    assert(mm.isMatch('ab/cXd/efXg/hi', '*/*X*/*/*i'));
    assert(mm.isMatch('ab/cXd/efXg/hi', '**/*X*/**/*i'));
  });

  it('Test pathName option', function() {
    assert(!mm.isMatch('ab/cXd/efXg/hi', '*Xg*i'));
    assert(!mm.isMatch('foo', '*/*/*'));
    assert(!mm.isMatch('foo', 'fo'));
    assert(!mm.isMatch('foo/bar', '*/*/*'));
    assert(!mm.isMatch('foo/bar', 'foo?bar'));
    assert(!mm.isMatch('foo/bb/aa/rr', '*/*/*'));
    assert(!mm.isMatch('foo/bba/arr', 'foo*'));
    assert(!mm.isMatch('foo/bba/arr', 'foo**'));
    assert(!mm.isMatch('foo/bba/arr', 'foo/*'));
    assert(!mm.isMatch('foo/bba/arr', 'foo/**arr'));
    assert(!mm.isMatch('foo/bba/arr', 'foo/**z'));
    assert(!mm.isMatch('foo/bba/arr', 'foo/*arr'));
    assert(!mm.isMatch('foo/bba/arr', 'foo/*z'));
    assert(mm.isMatch('ab/cXd/efXg/hi', '*/*X*/*/*i'));
    assert(mm.isMatch('abcXdefXghi', '*X*i'));
    assert(mm.isMatch('foo', 'foo'));
    assert(mm.isMatch('foo/bar', 'foo/*'));
    assert(mm.isMatch('foo/bar', 'foo/bar'));
    assert(mm.isMatch('foo/bar', 'foo[/]bar'));
    assert(mm.isMatch('foo/bba/arr', '*/*/*'));
    assert(mm.isMatch('foo/bba/arr', 'foo/**'));
  });
});
