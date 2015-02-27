/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var ref = require('./support/reference');
var mm = require('..');
require('should');

if ('minimatch' in argv) {
  mm = ref.minimatch;
}

describe('bash', function () {
  it.skip('should match extended globs:', function () {
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
    mm.match(['ac'], '*(@(a))a@(c)').should.eql(['ac']);
    mm.match(['c'], '*(@(a))a@(c)').should.eql([]);
    mm.match(['aaac'], '*(@(a))a@(c)').should.eql(['aaac']);
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
    mm.match(['foo'], '!(foo)').should.eql([]);
    mm.match(['foo'], '!(foo)*').should.eql(['foo']);
    mm.match(['foobar'], '!(foo)').should.eql(['foobar']);
    mm.match(['foobar'], '!(foo)*').should.eql(['foobar']);
    mm.match(['moo.cow'], '!(*.*).!(*.*)').should.eql(['moo.cow']);
    mm.match(['mad.moo.cow'], '!(*.*).!(*.*)').should.eql([]);
    mm.match(['mucca.pazza'], 'mu!(*(c))?.pa!(*(z))?').should.eql([]);
    mm.match(['fff'], '!(f)').should.eql(['fff']);
    mm.match(['fff'], '*(!(f))').should.eql(['fff']);
    mm.match(['fff'], '+(!(f))').should.eql(['fff']);
    mm.match(['ooo'], '!(f)').should.eql(['ooo']);
    mm.match(['ooo'], '*(!(f))').should.eql(['ooo']);
    mm.match(['ooo'], '+(!(f))').should.eql(['ooo']);
    mm.match(['foo'], '!(f)').should.eql(['foo']);
    mm.match(['foo'], '*(!(f))').should.eql(['foo']);
    mm.match(['foo'], '+(!(f))').should.eql(['foo']);
    mm.match(['f'], '!(f)').should.eql([]);
    mm.match(['f'], '*(!(f))').should.eql([]);
    mm.match(['f'], '+(!(f))').should.eql([]);
    mm.match(['foot'], '@(!(z*)|*x)').should.eql(['foot']);
    mm.match(['zoot'], '@(!(z*)|*x)').should.eql([]);
    mm.match(['foox'], '@(!(z*)|*x)').should.eql(['foox']);
    mm.match(['zoox'], '@(!(z*)|*x)').should.eql(['zoox']);
    mm.match(['foo'], '*(!(foo))').should.eql(['foo']);
    mm.match(['foob'], '!(foo)b*').should.eql([]);
    mm.match(['foobb'], '!(foo)b*').should.eql(['foobb']);
  });
});
