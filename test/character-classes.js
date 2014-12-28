/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
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
  it('should match character classes:', function () {
    mm.match(['abc', 'abd', 'abe', 'ab', 'ac'], '[a-c]b*').should.eql(['abc', 'abd', 'abe', 'ab']);
    mm.match(['abc', 'abd', 'abe', 'aa', 'ab', 'ac'], '[a-j]*[^c]').should.eql(['abd', 'abe', 'aa', 'ab']);
    mm.match(['abc', 'abd', 'abe'], 'a*[^c]').should.eql(['abd', 'abe']);
  });
});