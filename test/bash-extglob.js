/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

/* deps: mocha */
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var ref = require('./support/reference');
var mm = require('..');
require('should');

if ('minimatch' in argv) {
  mm = ref.minimatch;
}

var i = 0;
function match(a, pattern, b) {
  mm(a.sort(), pattern).should.eql(b.sort());
  console.log('    ' + i++);
}

describe('bash', function() {
  it('should match extended globs:', function() {
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
    match(['fffooofoooooffoofffooofff'], '*(*(f)*(o))', ['fffooofoooooffoofffooofff']);
    match(['ffo'], '*(f*(o))', ['ffo']);
    match(['fofo'], '*(f*(o))', ['fofo']);
    match(['fofoofoofofoo'], '*(fo|foo)', ['fofoofoofofoo']);
    match(['foo', 'bar'], '!(foo)', ['bar']);
    match(['foo', 'bar'], '!(foo)*', ['bar']);
    match(['foo'], '!(foo)', []);
    match(['foo'], '!(x)', ['foo']);
    match(['foo'], '!(x)*', ['foo']);
    match(['foo/bar'], 'foo/!(foo)', ['foo/bar']);
    match(['foob'], '!(foo)b*', []);
    match(['foobar', 'baz'], '!(foo)*', ['baz']);
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
    match(['moo.cow', 'a.b'], '!(*.*).!(*.*)', ['a.b', 'moo.cow']);
    match(['moo.cow', 'a.b'], '!(*\\.*).!(*\\.*)', ['a.b', 'moo.cow']);
    match(['moo.cow'], '!(*.*).!(*.*)', ['moo.cow']);
    match(['mucca.pazza'], 'mu!(*(c))?.pa!(*(z))?', []);
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
});
