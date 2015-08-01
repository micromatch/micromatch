/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
require('should');
var argv = require('minimist')(process.argv.slice(2));
var ref = require('./support/reference');
var mm = require('..');

if ('minimatch' in argv) {
  mm = ref.minimatch;
}

describe('extglob1a', function () {
  it('should match extglobs:', function () {
    mm.match(['ba'], 'a!(x)').should.eql([]);
    mm.match(['ba', 'ab'], 'a!(x)').should.eql(['ab']);
    mm.match(['ba'], 'a*(?(x))').should.eql([]);
    mm.match(['ba', 'ax', 'a'], 'a*(?(x))').should.eql(['ax', 'a']);
    mm.match(['a', 'ab'], 'a*!(x)/b/?(y)/c').should.eql([]);
    mm.match(['ab', 'ba'], 'a?(x)').should.eql([]);
    mm.match(['ba'], 'a*!(x)').should.eql([]);
  });

  it('pending:', function () {
    mm.match(['a', 'ab', 'x'], 'a!(x)').should.eql(['a', 'ab']);
    mm.match(['a'], 'a?(x)').should.eql(['a']);
    mm.match(['a.js', 'a.md', 'a.js.js', 'c.js', 'a.', 'd.js.d'], '*.!(js)').should.eql(['a.md', 'a.', 'd.js.d']);
    // mm.match(['a', 'ab'], 'a*(?(x))').should.eql(['a', 'ab']);
    mm.match(['a', 'ab'], 'a*(!(x))').should.eql(['a', 'ab']);
    mm.match(['a', 'x'], 'a*(!(x))').should.eql(['a']);
    mm.match(['a', 'x', 'ab', 'ax'], 'a*(!(x))').should.eql(['a', 'ab']);
  });
})

describe('extglobs', function () {
  it('should match extended globs:', function () {
    mm.match(['a/z', 'a/b'], 'a/!(z)').should.eql(['a/b']);
    mm.match(['c/z/v'], 'c/z/v').should.eql(['c/z/v']);
    mm.match(['c/a/v'], 'c/!(z)/v').should.eql(['c/a/v']);
    mm.match(['c/z/v','c/a/v'], 'c/!(z)/v').should.eql(['c/a/v']);
    mm.match(['c/z/v','c/a/v'], 'c/@(z)/v').should.eql(['c/z/v']);
    mm.match(['c/z/v','c/a/v'], 'c/+(z)/v').should.eql(['c/z/v']);
    mm.match(['c/z/v','c/a/v'], 'c/*(z)/v').should.eql(['c/z/v']);
    mm.match(['c/z/v','z','zf','fz'], '?(z)').should.eql(['z']);
    mm.match(['c/z/v','z','zf','fz'], '+(z)').should.eql(['z']);
    mm.match(['c/z/v','z','zf','fz'], '*(z)').should.eql(['z']);
    mm.match(['cz','abz','az'], 'a@(z)').should.eql(['az']);
    mm.match(['cz','abz','az'], 'a*@(z)').should.eql(['abz', 'az']);
    mm.match(['cz','abz','az'], 'a!(z)').should.eql(['abz']);
    mm.match(['cz','abz','az'], 'a?(z)').should.eql(['az']);
    mm.match(['cz','abz','az'], 'a+(z)').should.eql(['az']);
    mm.match(['az','bz','axz'], 'a+(z)').should.eql(['az']);
    mm.match(['cz','abz','az'], 'a*(z)').should.eql(['az']);
    mm.match(['cz','abz','az'], 'a**(z)').should.eql(['abz', 'az']);
    mm.match(['cz','abz','az'], 'a*!(z)').should.eql(['abz', 'az']);
  });

  it('should match extglobs in file paths:', function () {
    mm.match(['a.js', 'a.md', 'a.js.js', 'c.js', 'a.', 'd.js.d'], '*.!(js)').should.eql(['a.md', 'a.', 'd.js.d']);
    mm.match(['a.js', 'a.md', 'a.js.js', 'c.js', 'a.', 'd.js.d'], '*!(.js)').should.eql(['a.md', 'a.', 'd.js.d']);
  });

  it('should support exclusion patterns:', function () {
    var arr = ['a.a', 'a.b', 'a.a.a', 'c.a', 'a.', 'd.a.d'];
    mm.match(arr, '*.+(b|d)').should.eql(['a.b', 'd.a.d']);
    mm.match(arr, '*.!(a)').should.eql(['a.b', 'a.', 'd.a.d']);
    mm.match(arr, '*.!(*a)').should.eql(['a.b', 'a.', 'd.a.d']);
  });

  it('should match exactly one of the given pattern:', function () {
    var arr = ['aa.aa', 'a.bb', 'a.aa.a', 'cc.a', 'a.a', 'c.a', 'dd.aa.d', 'b.a'];
    mm.match(arr, '@(b|a)\.@(a)').should.eql(['a.a', 'b.a']);
  });

  it.skip('should support multiple exclusion patterns in one extglob:', function () {
    var arr = ['a.a', 'a.b', 'a.c.d', 'c.c', 'a.', 'd.d', 'e.e', 'f.f'];
    mm.match(arr, '!(*.a|*.b|*.c)').should.eql(['a.c.d', 'a.', 'd.d', 'e.e', 'f.f']);
  });
});

describe('bash', function () {
  it('should match extended globs from the bash spec:', function () {
    mm.match(['fofo'], '*(f*(o))').should.eql(['fofo']);
    mm.match(['ffo'], '*(f*(o))').should.eql(['ffo']);
    mm.match(['foooofo'], '*(f*(o))').should.eql(['foooofo']);
    mm.match(['foooofof'], '*(f*(o))').should.eql(['foooofof']);
    mm.match(['fooofoofofooo'], '*(f*(o))').should.eql(['fooofoofofooo']);
    mm.match(['foooofof'], '*(f+(o))').should.eql([]);
    mm.match(['xfoooofof'], '*(f*(o))').should.eql([]);
    mm.match(['foooofofx'], '*(f*(o))').should.eql([]);
    mm.match(['ofxoofxo'], '*(*(of*(o)x)o)').should.eql(['ofxoofxo']);
    mm.match(['ofooofoofofooo'], '*(f*(o))').should.eql([]);
    mm.match(['foooxfooxfoxfooox'], '*(f*(o)x)').should.eql(['foooxfooxfoxfooox']);
    mm.match(['foooxfooxofoxfooox'], '*(f*(o)x)').should.eql([]);
    mm.match(['foooxfooxfxfooox'], '*(f*(o)x)').should.eql(['foooxfooxfxfooox']);
    mm.match(['ofxoofxo'], '*(*(of*(o)x)o)').should.eql(['ofxoofxo']);
    mm.match(['ofoooxoofxo'], '*(*(of*(o)x)o)').should.eql(['ofoooxoofxo']);
    mm.match(['ofoooxoofxoofoooxoofxo'], '*(*(of*(o)x)o)').should.eql(['ofoooxoofxoofoooxoofxo']);
    mm.match(['ofoooxoofxoofoooxoofxoo'], '*(*(of*(o)x)o)').should.eql(['ofoooxoofxoofoooxoofxoo']);
    mm.match(['ofoooxoofxoofoooxoofxofo'], '*(*(of*(o)x)o)').should.eql([]);
    mm.match(['ofoooxoofxoofoooxoofxooofxofxo'], '*(*(of*(o)x)o)').should.eql(['ofoooxoofxoofoooxoofxooofxofxo']);
    mm.match(['aac'], '*(@(a))a@(c)').should.eql(['aac']);
    mm.match(['aac'], '*(@(a))b@(c)').should.eql([]);
    mm.match(['ac'], '*(@(a))a@(c)').should.eql(['ac']);
    mm.match(['c'], '*(@(a))a@(c)').should.eql([]);
    mm.match(['aaac', 'foo'], '*(@(a))a@(c)').should.eql(['aaac']);
    mm.match(['baaac'], '*(@(a))a@(c)').should.eql([]);
    mm.match(['abcd'], '?@(a|b)*@(c)d').should.eql(['abcd']);
    mm.match(['abcd'], '@(ab|a*@(b))*(c)d').should.eql(['abcd']);
    mm.match(['acd'], '@(ab|a*(b))*(c)d').should.eql(['acd']);
    mm.match(['abbcd'], '@(ab|a*(b))*(c)d').should.eql(['abbcd']);
    mm.match(['effgz'], '@(b+(c)d|e*(f)g?|?(h)i@(j|k))').should.eql(['effgz']);
    mm.match(['efgz'], '@(b+(c)d|e*(f)g?|?(h)i@(j|k))').should.eql(['efgz']);
    mm.match(['egz'], '@(b+(c)d|e*(f)g?|?(h)i@(j|k))').should.eql(['egz']);
    mm.match(['egzefffgzbcdij'], '*(b+(c)d|e*(f)g?|?(h)i@(j|k))').should.eql(['egzefffgzbcdij']);
    mm.match(['egz'], '@(b+(c)d|e+(f)g?|?(h)i@(j|k))').should.eql([]);
    mm.match(['ofoofo'], '*(of+(o))').should.eql(['ofoofo']);
    mm.match(['oxfoxoxfox'], '*(oxf+(ox))').should.eql(['oxfoxoxfox']);
    mm.match(['oxfoxfox'], '*(oxf+(ox))').should.eql([]);
    mm.match(['ofoofo'], '*(of+(o)|f)').should.eql(['ofoofo']);
    mm.match(['foofoofo'], '@(foo|f|fo)*(f|of+(o))').should.eql(['foofoofo']);
    mm.match(['oofooofo'], '*(of|oof+(o))').should.eql(['oofooofo']);
    mm.match(['fffooofoooooffoofffooofff'], '*(*(f)*(o))').should.eql(['fffooofoooooffoofffooofff']);
    mm.match(['fofoofoofofoo'], '*(fo|foo)').should.eql(['fofoofoofofoo']);
    mm.match(['foo'], '!(x)').should.eql(['foo']);
    mm.match(['foo'], '!(x)*').should.eql(['foo']);
    mm.match(['foo', 'bar'], '!(foo)').should.eql(['bar']);
    mm.match(['foo', 'bar'], '!(foo)*').should.eql(['bar']);
    mm.match(['foo/bar'], 'foo/!(foo)').should.eql(['foo/bar']);
    mm.match(['foobar', 'baz'], '!(foo)*').should.eql(['baz']);
    mm.match(['moo.cow', 'a.b'], '!(*\\.*).!(*\\.*)').should.eql(['moo.cow', 'a.b']);
    mm.match(['moo.cow', 'a.b'], '!(*.*).!(*.*)').should.eql(['moo.cow', 'a.b']);
    // mm.match(['mad.moo.cow'], '^!(*.*).!(*.*)').should.eql([]);
    mm.match(['mucca.pazza'], 'mu!(*(c))?.pa!(*(z))?').should.eql([]);
    mm.match(['ooo'], '!(f)').should.eql(['ooo']);
    mm.match(['ooo'], '*(!(f))').should.eql(['ooo']);
    mm.match(['ooo'], '+(!(f))').should.eql(['ooo']);
    mm.match(['f'], '!(f)').should.eql([]);
    mm.match(['f'], '*(!(f))').should.eql([]);
    mm.match(['f'], '+(!(f))').should.eql([]);
    mm.match(['foot'], '@(!(z*)|*x)').should.eql(['foot']);
    mm.match(['zoot'], '@(!(z*)|*x)').should.eql([]);
    mm.match(['foox'], '@(!(z*)|*x)').should.eql(['foox']);
    mm.match(['zoox'], '@(!(z*)|*x)').should.eql(['zoox']);
    mm.match(['foob'], '!(foo)b*').should.eql([]);
    mm.match(['fa', 'fb', 'f', 'fo'], '!(f(o))').should.eql(['fa', 'fb', 'f']);
    mm.match(['fa', 'fb', 'f', 'fo'], '!(f!(o))').should.eql(['fo']);
    // mm.match(['fff'], '!(f)').should.eql(['fff']);
    // mm.match(['foobb'], '!(foo)b*').should.eql(['foobb']);
    // mm.match(['foo'], '*(!(foo))').should.eql(['foo']);
    // mm.match(['foo'], '+(!(f))').should.eql(['foo']);
    // mm.match(['foo'], '*(!(f))').should.eql(['foo']);
    // mm.match(['foo'], '!(f)').should.eql(['foo']);
    // mm.match(['fff'], '+(!(f))').should.eql(['fff']);
    // mm.match(['fff'], '*(!(f))').should.eql(['fff']);
  });
});
