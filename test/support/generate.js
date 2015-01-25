/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var fs = require('fs');
var path = require('path');
var should = require('should');
var mini = require('minimatch');
var patterns = require('./patterns');
var micro = require('../..');

writeActual('mini', mini.makeRe);
writeActual('mini-negate', mini.makeRe, {negate: true});
writeActual('mini-dot', mini.makeRe, {dot: true});
writeActual('mini-matchBase', mini.makeRe, {matchBase: true});
writeActual('mini-dot-matchBase', mini.makeRe, {dot: true, matchBase: true});

writeActual('micro', micro.makeRe);
writeActual('micro-negate', micro.makeRe, {negate: true});
writeActual('micro-dot', micro.makeRe, {dot: true});
writeActual('micro-matchBase', micro.makeRe, {matchBase: true});
writeActual('micro-dot-matchBase', micro.makeRe, {dot: true, matchBase: true});

function unit(fixture, expected) {
  return 'var actual = fn("' + fixture + '");\nactual.should.eql(' + expected + ');\n';
}

function writeActual(dest, fn, options) {
  options = options || {};
  var res = patterns.reduce(function (acc, fixture) {
    if (options.negate) {
      fixture = '!' + fixture;
    }
    return acc.concat(unit(fixture, fn(fixture, options)));
  }, []).join('\n');

  fs.writeFileSync(__dirname + '/../actual/' + dest + '.js', res);
}
