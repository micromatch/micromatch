/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License
 */

'use strict';

var path = require('path');
var should = require('should');
var argv = require('minimist')(process.argv.slice(2));
var mm = require('..');

if ('minimatch' in argv) {
  mm = require('minimatch');
}

describe('brace expansion', function () {
  it('should optimize regex when `optimize` is true:', function () {
    mm.makeRe('{{c,d}..{d,f}}').should.eql(/^(?:c|d|e|f)$/);
    mm.makeRe('{c,d}/**/{d,f}').should.eql(/^(?:(?:c|d)\/(.*\/)*(?:d|f))$/);
  });
});
