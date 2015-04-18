/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

require('should');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var ref = require('./support/reference');
var mm = require('..');

if ('minimatch' in argv) {
  mm = ref;
}

describe('POSIX bracket expressions', function () {

  it('character classes', function() {
    // mm.isMatch('ab', '[[:digit]ab]', {brackets: true}).should.be.true;
    mm.isMatch('A', '[[:lower:]]', {brackets: true}).should.be.false;
    mm.isMatch('A', '[![:lower:]]', {brackets: true}).should.be.true;
    mm.isMatch('a', '[![:lower:]]', {brackets: true}).should.be.false;
    mm.isMatch('a', '[[:lower:]]', {brackets: true}).should.be.true;
    mm.isMatch('a', '[[:upper:]]', {brackets: true}).should.be.false;
    mm.isMatch('A', '[[:upper:]]', {brackets: true}).should.be.true;
    mm.isMatch('a', '[[:digit:][:upper:][:space:]]', {brackets: true}).should.be.false;
    mm.isMatch('A', '[[:digit:][:upper:][:space:]]', {brackets: true}).should.be.true;
    mm.isMatch('1', '[[:digit:][:upper:][:space:]]', {brackets: true}).should.be.true;
    mm.isMatch(' ', '[[:digit:][:upper:][:space:]]', {brackets: true}).should.be.true;
    mm.isMatch('.', '[[:digit:][:upper:][:space:]]', {brackets: true}).should.be.false;
    mm.isMatch('5', '[[:xdigit:]]', {brackets: true}).should.be.true;
    mm.isMatch('f', '[[:xdigit:]]', {brackets: true}).should.be.true;
    mm.isMatch('D', '[[:xdigit:]]', {brackets: true}).should.be.true;
    mm.isMatch('.', '[^[:alnum:][:alpha:][:blank:][:cntrl:][:digit:][:lower:][:space:][:upper:][:xdigit:]]', {brackets: true}).should.be.true;
    mm.isMatch('.', '[[:alnum:][:alpha:][:blank:][:cntrl:][:digit:][:lower:][:space:][:upper:][:xdigit:]]', {brackets: true}).should.be.false;
    mm.isMatch('5', '[a-c[:digit:]x-z]', {brackets: true}).should.be.true;
    mm.isMatch('b', '[a-c[:digit:]x-z]', {brackets: true}).should.be.true;
    mm.isMatch('y', '[a-c[:digit:]x-z]', {brackets: true}).should.be.true;
    mm.isMatch('q', '[a-c[:digit:]x-z]', {brackets: true}).should.be.false;
  });

  it('Case-sensitivy features (posix bracket expressions)', function() {
    mm.isMatch('A', '[[:lower:]]', {brackets: true}).should.be.false;
    mm.isMatch('a', '[[:lower:]]', {brackets: true}).should.be.true;
    mm.isMatch('a', '[[:upper:]]', {brackets: true}).should.be.false;
    mm.isMatch('A', '[[:upper:]]', {brackets: true}).should.be.true;
  });
});

