'use strict';

var assert = require('assert');
var argv = require('yargs-parser')(process.argv.slice(2));
var minimatch = require('minimatch');
var micromatch = require('..');
var extglob = require('extglob');
var nm = require('nanomatch');

var matcher = argv.mm ? minimatch : micromatch;
var isMatch = argv.mm ? minimatch : micromatch.isMatch;

function match(arr, pattern, expected, options) {
  var actual = matcher.match(arr, pattern, options).sort();
  expected.sort();
  assert.deepEqual(actual, expected, micromatch.makeRe(pattern));
}

/**
 * These tests were converted directly from bash 4.3 and 4.4 unit tests.
 */

describe('extglobs', function() {
  it('should export a function', function() {
    assert.equal(typeof matcher, 'function');
  });

  it('should throw on imbalanced sets when `options.strictErrors` is true', function() {
    assert.throws(function() {
      isMatch('a((b', 'a(b', {strictErrors: true});
    }, 'row:1 col:2 missing opening parens: "a(b"');

    assert.throws(function() {
      isMatch('a((b', 'a(*b', {strictErrors: true});
    }, 'row:1 col:2 missing opening parens: "a(*b"');
  });

  it('should match extglobs ending with statechar', function() {
    // from minimatch tests
    assert(!isMatch('ax', 'a?(b*)'));
    assert(isMatch('ax', '?(a*|b)'));
  });

  it('should match extended globs:', function() {
    match(['a.js.js', 'a.md.js'], '*.*(js).js', ['a.js.js']);
    match(['a/z', 'a/b'], 'a/!(z)', ['a/b']);
    match(['c/z/v'], 'c/z/v', ['c/z/v']);
    match(['c/a/v'], 'c/!(z)/v', ['c/a/v']);
    match(['c/z/v', 'c/a/v'], 'c/!(z)/v', ['c/a/v']);
    match(['c/z/v', 'c/a/v'], 'c/@(z)/v', ['c/z/v']);
    match(['c/z/v', 'c/a/v'], 'c/+(z)/v', ['c/z/v']);
    match(['c/z/v', 'c/a/v'], 'c/*(z)/v', ['c/z/v']);
    match(['c/z/v', 'z', 'zf', 'fz'], '?(z)', ['z']);
    match(['c/z/v', 'z', 'zf', 'fz'], '+(z)', ['z']);
    match(['c/z/v', 'z', 'zf', 'fz'], '*(z)', ['z']);
    match(['cz', 'abz', 'az'], 'a@(z)', ['az']);
    match(['cz', 'abz', 'az'], 'a*@(z)', ['az', 'abz']);
    match(['cz', 'abz', 'az'], 'a!(z)', ['abz']);
    match(['cz', 'abz', 'az'], 'a?(z)', ['az']);
    match(['cz', 'abz', 'az'], 'a+(z)', ['az']);
    match(['az', 'bz', 'axz'], 'a+(z)', ['az']);
    match(['cz', 'abz', 'az'], 'a*(z)', ['az']);
    match(['cz', 'abz', 'az'], 'a**(z)', ['az', 'abz']);
    match(['cz', 'abz', 'az'], 'a*!(z)', ['az', 'abz']);
  });

  it('should support negation', function() {
    var arr = ['a', 'b', 'aa', 'ab', 'bb', 'ac', 'aaa', 'aab', 'abb', 'ccc'];
    match(arr, '!(a)*', ['b', 'bb', 'ccc']);
    match(arr, 'a!(b)*', ['a', 'aa', 'aaa', 'aab', 'ac']);
  });

  it('should support qmark matching', function() {
    var arr = ['a', 'aa', 'ab', 'aaa', 'abcdefg'];
    match(arr, '?', ['a']);
    match(arr, '??', ['aa', 'ab']);
    match(arr, '???', ['aaa']);
  });

  it('should match exactly one of the given pattern:', function() {
    var arr = ['aa.aa', 'a.bb', 'a.aa.a', 'cc.a', 'a.a', 'c.a', 'dd.aa.d', 'b.a'];
    match(arr, '(b|a).(a)', ['a.a', 'b.a']);
    match(arr, '@(b|a).@(a)', ['a.a', 'b.a']);
  });

  it('should work with globs', function() {
    var arr = ['123abc', 'ab', 'abab', 'abcdef', 'accdef', 'abcfefg', 'abef', 'abcfef', 'abd', 'acd'];
    match(arr, 'ab*(e|f)', ['ab', 'abef']);
    match(arr, 'ab?*(e|f)', ['abd', 'abef', 'abcfef']);
    match(arr, 'ab*d+(e|f)', ['abcdef']);
    match(arr, 'ab**(e|f)', ['ab', 'abab', 'abcdef', 'abcfefg', 'abcfef', 'abef', 'abd']);
    match(arr, 'ab*+(e|f)', ['abcdef', 'abcfef', 'abef']);
    match(arr, 'ab**(e|f)g', ['abcfefg']);
    match(arr, 'ab***ef', ['abcdef', 'abcfef', 'abef']);
    match(arr, 'ab**', ['ab', 'abab', 'abcdef', 'abcfef', 'abcfefg', 'abd', 'abef']);
    match(arr, '*?(a)bc', ['123abc']);
    match(arr, 'a(b*(foo|bar))d', ['abd']);
    match(arr, '(a+|b)+', ['ab', 'abab']);
    match(arr, '(a+|b)*', ['ab', 'abab', 'accdef', 'abcdef', 'abcfefg', 'abef', 'abcfef', 'abd', 'acd']);
    match(['/dev/udp/129.22.8.102/45'], '/dev\\/@(tcp|udp)\\/*\\/*', ['/dev/udp/129.22.8.102/45']);
    match(['12', '1', '12abc'], '0|[1-9]*([0-9])', ['1', '12'], 'Should match valid numbers');
    match(['07', '0377', '09'], '+([0-7])', ['0377', '07'], 'Should match octal numbers');
  });

  it('stuff from korn\'s book', function() {
    assert(isMatch('paragraph', 'para@(chute|graph)'));
    assert(!isMatch('paramour', 'para@(chute|graph)'));
    assert(isMatch('para991', 'para?([345]|99)1'));
    assert(!isMatch('para381', 'para?([345]|99)1'));
    assert(!isMatch('paragraph', 'para*([0-9])'));
    assert(isMatch('para', 'para*([0-9])'));
    assert(isMatch('para13829383746592', 'para*([0-9])'));
    assert(!isMatch('paragraph', 'para*([0-9])'));
    assert(!isMatch('para', 'para+([0-9])'));
    assert(isMatch('para987346523', 'para+([0-9])'));
    assert(isMatch('paragraph', 'para!(*.[0-9])'));
    assert(isMatch('para.38', 'para!(*.[00-09])'));
    assert(isMatch('para.graph', 'para!(*.[0-9])'));
    assert(isMatch('para39', 'para!(*.[0-9])'));
  });

  it('tests derived from those in rosenblatt\'s korn shell book', function() {
    match(['', '137577991', '2468'], '*(0|1|3|5|7|9)', ['', '137577991']);
    match(['file.c', 'file.C', 'file.cc', 'file.ccc'], '*.c?(c)', ['file.c', 'file.cc']);
    match(['parse.y', 'shell.c', 'Makefile', 'Makefile.in'], '!(*.c|*.h|Makefile.in|config*|README)', ['parse.y', 'Makefile']);
    match(['VMS.FILE;', 'VMS.FILE;0', 'VMS.FILE;1', 'VMS.FILE;139', 'VMS.FILE;1N'], '*\\;[1-9]*([0-9])', ['VMS.FILE;1', 'VMS.FILE;139']);
  });

  it('tests derived from the pd-ksh test suite', function() {
    match(['abcx', 'abcz', 'bbc'], '!([[*])*', ['abcx', 'abcz', 'bbc']);
    match(['abcx', 'abcz', 'bbc'], '+(a|b\\[)*', ['abcx', 'abcz']);
    match(['abd', 'acd'], 'a+(b|c)d', ['abd', 'acd']);
    match(['abd', 'acd', 'ac', 'ab'], 'a!(@(b|B))', ['acd', 'abd', 'ac']);
    match(['abd', 'acd'], 'a!(@(b|B))d', ['acd']);
    match(['abd', 'acd'], 'a[b*(foo|bar)]d', ['abd']);
    match(['abcx', 'abcz', 'bbc', 'aaz', 'aaaz'], '[a*(]*z', ['aaz', 'aaaz', 'abcz']);
  });

  it('simple kleene star tests', function() {
    assert(!isMatch('foo', '*(a|b\\[)'));
    assert(isMatch('foo', '*(a|b\\[)|f*'));
  });

  it('this doesn\'t work in bash either (per bash micromatch.tests notes)', function() {
    assert(!isMatch('*(a|b[)', '*(a|b\\[)'));
    assert(isMatch('*(a|b[)', '\\*\\(a\\|b\\[\\)'));
  });

  it('should support multiple exclusion patterns in one extglob:', function() {
    var arr = ['a.a', 'a.b', 'a.c', 'a.c.d', 'c.c', 'a.', 'd.d', 'e.e', 'f.f', 'a.abcd'];
    match(arr, '*.(a|b|@(ab|a*@(b))*(c)d)', ['a.a', 'a.b', 'a.abcd']);
    match(arr, '!(*.a|*.b|*.c)', ['a.', 'a.c.d', 'd.d', 'e.e', 'f.f']);
    match(arr, '*!(.a|.b|.c)', arr);
    match(arr, '*.!(a|b|c)', ['a.c.d', 'a.', 'd.d', 'e.e', 'f.f']);
  });

  it('should correctly match empty parens', function() {
    match(['def', 'ef'], '()ef', ['ef']);
  });

  it('should match escaped parens', function() {
    var arr = ['a(b', 'a\\(b', 'a((b', 'a((((b', 'ab'];
    match(arr, 'a(b', ['a(b']);
    match(arr, 'a\\(b', ['a(b', 'a\\(b']);
    match(arr, 'a(*b', ['a(b', 'a((b', 'a((((b']);
  });

  it('should match escaped backslashes', function() {
    match(['a(b', 'a\\(b', 'a((b', 'a((((b', 'ab'], 'a\\\\(b', ['a\\(b']);
    match(['a\\b', 'a/b', 'ab'], 'a/b', ['a/b']);
    match(['a\\z', 'a/z', 'az'], 'a\\z', ['a/z']);
  });
});

describe('bash', function() {
  it('should match extended globs from the bash spec:', function() {
    assert(isMatch('fofo', '*(f*(o))'));
    assert(isMatch('ffo', '*(f*(o))'));
    assert(isMatch('foooofo', '*(f*(o))'));
    assert(isMatch('foooofof', '*(f*(o))'));
    assert(isMatch('fooofoofofooo', '*(f*(o))'));
    assert(!isMatch('foooofof', '*(f+(o))'));
    assert(!isMatch('xfoooofof', '*(f*(o))'));
    assert(!isMatch('foooofofx', '*(f*(o))'));
    assert(isMatch('ofxoofxo', '*(*(of*(o)x)o)'));
    assert(!isMatch('ofooofoofofooo', '*(f*(o))'));
    assert(isMatch('foooxfooxfoxfooox', '*(f*(o)x)'));
    assert(!isMatch('foooxfooxofoxfooox', '*(f*(o)x)'));
    assert(isMatch('foooxfooxfxfooox', '*(f*(o)x)'));
    assert(isMatch('ofxoofxo', '*(*(of*(o)x)o)'));
    assert(isMatch('ofoooxoofxo', '*(*(of*(o)x)o)'));
    assert(isMatch('ofoooxoofxoofoooxoofxo', '*(*(of*(o)x)o)'));
    assert(isMatch('ofoooxoofxoofoooxoofxoo', '*(*(of*(o)x)o)'));
    assert(!isMatch('ofoooxoofxoofoooxoofxofo', '*(*(of*(o)x)o)'));
    assert(isMatch('ofoooxoofxoofoooxoofxooofxofxo', '*(*(of*(o)x)o)'));
    assert(isMatch('aac', '*(@(a))a@(c)'));
    assert(isMatch('ac', '*(@(a))a@(c)'));
    assert(!isMatch('c', '*(@(a))a@(c)'));
    assert(isMatch('aaac', '*(@(a))a@(c)'));
    assert(!isMatch('baaac', '*(@(a))a@(c)'));
    assert(isMatch('abcd', '?@(a|b)*@(c)d'));
    assert(isMatch('abcd', '@(ab|a*@(b))*(c)d'));
    assert(isMatch('acd', '@(ab|a*(b))*(c)d'));
    assert(isMatch('abbcd', '@(ab|a*(b))*(c)d'));
    assert(isMatch('effgz', '@(b+(c)d|e*(f)g?|?(h)i@(j|k))'));
    assert(isMatch('efgz', '@(b+(c)d|e*(f)g?|?(h)i@(j|k))'));
    assert(isMatch('egz', '@(b+(c)d|e*(f)g?|?(h)i@(j|k))'));
    assert(isMatch('egzefffgzbcdij', '*(b+(c)d|e*(f)g?|?(h)i@(j|k))'));
    assert(!isMatch('egz', '@(b+(c)d|e+(f)g?|?(h)i@(j|k))'));
    assert(isMatch('ofoofo', '*(of+(o))'));
    assert(isMatch('oxfoxoxfox', '*(oxf+(ox))'));
    assert(!isMatch('oxfoxfox', '*(oxf+(ox))'));
    assert(isMatch('ofoofo', '*(of+(o)|f)'));
    assert(isMatch('foofoofo', '@(foo|f|fo)*(f|of+(o))'), 'Should match as fo+ofo+ofo');
    assert(isMatch('oofooofo', '*(of|oof+(o))'));
    assert(isMatch('fffooofoooooffoofffooofff', '*(*(f)*(o))'));
    assert(isMatch('fofoofoofofoo', '*(fo|foo)'), 'Should backtrack in alternation matches');
  });

  it('should support exclusions', function() {
    match(['foob', 'foobb', 'foo', 'bar', 'baz', 'foobar'], '!(foo)b*', ['bar', 'baz']);
    // Bash 4.3 says this should match `foo` too. Probably a bug in Bash since this is correct.
    match(['foo', 'bar', 'baz', 'foobar'], '*(!(foo))', ['bar', 'baz', 'foobar']);
    // Bash 4.3 says this should match `foo` and `foobar` too, probably a bug in Bash since this is correct.
    match(['foo', 'bar', 'baz', 'foobar'], '!(foo)*', ['bar', 'baz']);

    match(['moo.cow', 'moo', 'cow'], '!(*.*)', ['moo', 'cow']);
    match(['moo.cow', 'moo', 'cow'], '!(*.*).', []);
    assert(!isMatch('f', '!(f)'));
    assert(!isMatch('f', '+(!(f))'));
    assert(!isMatch('f', '*(!(f))'));
    assert(!isMatch('mad.moo.cow', '!(*.*).!(*.*)'));
    assert(!isMatch('mucca.pazza', 'mu!(*(c))?.pa!(*(z))?'));
    assert(!isMatch('zoot', '@(!(z*)|*x)'));
    assert(isMatch('foo', '!(x)'));
    assert(isMatch('foo', '!(x)*'));
    assert(isMatch('foot', '@(!(z*)|*x)'));
    assert(isMatch('foox', '@(!(z*)|*x)'));
    assert(isMatch('ooo', '!(f)'));
    assert(isMatch('ooo', '*(!(f))'));
    assert(isMatch('ooo', '+(!(f))'));
    assert(isMatch('zoox', '@(!(z*)|*x)'));
    match(['aaac', 'foo'], '*(@(a))a@(c)', ['aaac']);
    match(['aaac'], '*(@(a))a@(c)', ['aaac']);
    match(['aac'], '*(@(a))a@(c)', ['aac']);
    match(['aac'], '*(@(a))b@(c)', []);
    match(['abbcd'], '@(ab|a*(b))*(c)d', ['abbcd']);
    match(['abcd'], '?@(a|b)*@(c)d', ['abcd']);
    match(['abcd'], '@(ab|a*@(b))*(c)d', ['abcd']);
    match(['ac'], '*(@(a))a@(c)', ['ac']);
    match(['acd'], '@(ab|a*(b))*(c)d', ['acd']);
    match(['baaac'], '*(@(a))a@(c)', []);
    match(['c'], '*(@(a))a@(c)', []);
    match(['effgz'], '@(b+(c)d|e*(f)g?|?(h)i@(j|k))', ['effgz']);
    match(['efgz'], '@(b+(c)d|e*(f)g?|?(h)i@(j|k))', ['efgz']);
    match(['egz'], '@(b+(c)d|e*(f)g?|?(h)i@(j|k))', ['egz']);
    match(['egz'], '@(b+(c)d|e+(f)g?|?(h)i@(j|k))', []);
    match(['egzefffgzbcdij'], '*(b+(c)d|e*(f)g?|?(h)i@(j|k))', ['egzefffgzbcdij']);
    match(['f'], '!(f)', []);
    match(['f'], '*(!(f))', []);
    match(['f'], '+(!(f))', []);
    match(['fa', 'fb', 'f', 'fo'], '!(f!(o))', ['fo']);
    match(['fa', 'fb', 'f', 'fo'], '!(f(o))', ['f', 'fb', 'fa']);
    match(['fff', 'foo', 'ooo', 'f'], '*(!(f))', ['fff', 'ooo', 'foo']);
    match(['fff'], '!(f)', ['fff']);
    match(['fff'], '*(!(f))', ['fff']);
    match(['fff'], '+(!(f))', ['fff']);
    match(['fffooofoooooffoofffooofff'], '*(*(f)*(o))', ['fffooofoooooffoofffooofff']);
    match(['ffo'], '*(f*(o))', ['ffo']);
    match(['fofo'], '*(f*(o))', ['fofo']);
    match(['fofoofoofofoo'], '*(fo|foo)', ['fofoofoofofoo']);
    match(['foo', 'bar'], '!(foo)', ['bar']);
    match(['foo'], '!(!(foo))', ['foo']);
    match(['foo'], '!(f)', ['foo']);
    match(['foo'], '!(x)', ['foo']);
    match(['foo'], '!(x)*', ['foo']);
    match(['foo'], '*(!(f))', ['foo']);
    match(['foo'], '*((foo))', ['foo']);
    match(['foo'], '+(!(f))', ['foo']);
    match(['foo/bar'], 'foo/!(foo)', ['foo/bar']);
    match(['foob', 'foobb'], '(foo)bb', ['foobb']);
    match(['foobar'], '!(foo)', ['foobar']);
    match(['foofoofo'], '@(foo|f|fo)*(f|of+(o))', ['foofoofo']);
    match(['fooofoofofooo'], '*(f*(o))', ['fooofoofofooo']);
    match(['foooofo'], '*(f*(o))', ['foooofo']);
    match(['foooofof'], '*(f*(o))', ['foooofof']);
    match(['foooofof'], '*(f+(o))', []);
    match(['foooofofx'], '*(f*(o))', []);
    match(['foooxfooxfoxfooox'], '*(f*(o)x)', ['foooxfooxfoxfooox']);
    match(['foooxfooxfxfooox'], '*(f*(o)x)', ['foooxfooxfxfooox']);
    match(['foooxfooxofoxfooox'], '*(f*(o)x)', []);
    match(['foot'], '@(!(z*)|*x)', ['foot']);
    match(['foox'], '@(!(z*)|*x)', ['foox']);
    match(['mad.moo.cow'], '!(*.*).!(*.*)', []);
    match(['moo.cow', 'moo', 'cow'], '.!(*.*)', []);
    match(['ofoofo'], '*(of+(o))', ['ofoofo']);
    match(['ofoofo'], '*(of+(o)|f)', ['ofoofo']);
    match(['ofooofoofofooo'], '*(f*(o))', []);
    match(['ofoooxoofxo'], '*(*(of*(o)x)o)', ['ofoooxoofxo']);
    match(['ofoooxoofxoofoooxoofxo'], '*(*(of*(o)x)o)', ['ofoooxoofxoofoooxoofxo']);
    match(['ofoooxoofxoofoooxoofxofo'], '*(*(of*(o)x)o)', []);
    match(['ofoooxoofxoofoooxoofxoo'], '*(*(of*(o)x)o)', ['ofoooxoofxoofoooxoofxoo']);
    match(['ofoooxoofxoofoooxoofxooofxofxo'], '*(*(of*(o)x)o)', ['ofoooxoofxoofoooxoofxooofxofxo']);
    match(['ofxoofxo'], '*(*(of*(o)x)o)', ['ofxoofxo']);
    match(['oofooofo'], '*(of|oof+(o))', ['oofooofo']);
    match(['ooo'], '!(f)', ['ooo']);
    match(['ooo'], '*(!(f))', ['ooo']);
    match(['ooo'], '+(!(f))', ['ooo']);
    match(['oxfoxfox'], '*(oxf+(ox))', []);
    match(['oxfoxoxfox'], '*(oxf+(ox))', ['oxfoxoxfox']);
    match(['xfoooofof'], '*(f*(o))', []);
    match(['zoot'], '@(!(z*)|*x)', []);
    match(['zoox'], '@(!(z*)|*x)', ['zoox']);
  });

  it('should support basic wildmatch features', function() {
    assert(!isMatch('foo', '*f'));
    assert(!isMatch('foo', '??'));
    assert(!isMatch('foo', 'bar'));
    assert(!isMatch('foobar', 'foo\\*bar'));
    assert(!isMatch('abc', '\\a\\b\\c'));
    assert(isMatch('', ''));
    assert(isMatch('?a?b', '\\??\\?b'));
    assert(isMatch('aaaaaaabababab', '*ab'));
    assert(isMatch('\\x\\y\\z', '\\x\\y\\z'));
    assert(isMatch('/x/y/z', '/x/y/z'));
    assert(isMatch('f\\oo', 'f\\oo'));
    assert(isMatch('foo', '*'));
    assert(isMatch('foo', '*foo*'));
    assert(isMatch('foo', '???'));
    assert(isMatch('foo', 'f*'));
    assert(isMatch('foo', 'foo'));
    assert(isMatch('foo*', 'foo\\*', {unixify: false}));
    assert(isMatch('foobar', '*ob*a*r*'));
  });

  it('Test recursion and the abort code', function() {
    assert(isMatch('-adobe-courier-bold-o-normal--12-120-75-75-m-70-iso8859-1', '-*-*-*-*-*-*-12-*-*-*-m-*-*-*'));
    assert(!isMatch('-adobe-courier-bold-o-normal--12-120-75-75-X-70-iso8859-1', '-*-*-*-*-*-*-12-*-*-*-m-*-*-*'));
    assert(!isMatch('-adobe-courier-bold-o-normal--12-120-75-75-/-70-iso8859-1', '-*-*-*-*-*-*-12-*-*-*-m-*-*-*'));
    assert(isMatch('XXX/adobe/courier/bold/o/normal//12/120/75/75/m/70/iso8859/1', 'XXX/*/*/*/*/*/*/12/*/*/*/m/*/*/*', {unixify: false}));
    assert(!isMatch('XXX/adobe/courier/bold/o/normal//12/120/75/75/X/70/iso8859/1', 'XXX/*/*/*/*/*/*/12/*/*/*/m/*/*/*'));
    assert(isMatch('abcd/abcdefg/abcdefghijk/abcdefghijklmnop.txt', '**/*a*b*g*n*t'));
    assert(!isMatch('abcd/abcdefg/abcdefghijk/abcdefghijklmnop.txtz', '**/*a*b*g*n*t'));
    assert(!isMatch('foo', '*/*/*'));
    assert(!isMatch('foo/bar', '*/*/*'));
    assert(isMatch('foo/bba/arr', '*/*/*'));
    assert(!isMatch('foo/bb/aa/rr', '*/*/*'));
    assert(isMatch('foo/bb/aa/rr', '**/**/**'));
    assert(isMatch('abcXdefXghi', '*X*i'));
    assert(!isMatch('ab/cXd/efXg/hi', '*X*i'));
    assert(isMatch('ab/cXd/efXg/hi', '*/*X*/*/*i'));
    assert(isMatch('ab/cXd/efXg/hi', '**/*X*/**/*i'));
  });

  it('Test pathName option', function() {
    assert(!isMatch('ab/cXd/efXg/hi', '*Xg*i'));
    assert(!isMatch('foo', '*/*/*'));
    assert(!isMatch('foo', 'fo'));
    assert(!isMatch('foo/bar', '*/*/*'));
    assert(!isMatch('foo/bar', 'foo?bar'));
    assert(!isMatch('foo/bb/aa/rr', '*/*/*'));
    assert(!isMatch('foo/bba/arr', 'foo*'));
    assert(!isMatch('foo/bba/arr', 'foo**'));
    assert(!isMatch('foo/bba/arr', 'foo/*'));
    assert(!isMatch('foo/bba/arr', 'foo/**arr'));
    assert(!isMatch('foo/bba/arr', 'foo/**z'));
    assert(!isMatch('foo/bba/arr', 'foo/*arr'));
    assert(!isMatch('foo/bba/arr', 'foo/*z'));
    assert(isMatch('ab/cXd/efXg/hi', '*/*X*/*/*i'));
    assert(isMatch('abcXdefXghi', '*X*i'));
    assert(isMatch('foo', 'foo'));
    assert(isMatch('foo/bar', 'foo/*'));
    assert(isMatch('foo/bar', 'foo/bar'));
    assert(isMatch('foo/bar', 'foo[/]bar'));
    assert(isMatch('foo/bba/arr', '*/*/*'));
    assert(isMatch('foo/bba/arr', 'foo/**'));
  });
});
