/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License
 */

'use strict';

var should = require('should');
var argv = require('minimist')(process.argv.slice(2));
var ref = require('./support/reference');
var mm = require('..');

if ('minimatch' in argv) {
  mm = ref.minimatch;
}
if ('wildmatch' in argv) {
  mm = ref.wildmatch;
}

describe('micromatch', function () {
  it('should create a filter function to filter files', function () {
    mm.filter('*').should.be.a.function;
  });

  it('should filter files', function () {
    mm.filter('*')(['a', 'b', 'c']).should.eql(['a', 'b', 'c']);
    mm.filter('a/*')(['a/a', 'b/a', 'a/c']).should.eql(['a/a', 'a/c']);

    (['a', 'b', 'c'].filter(mm.filter('*'))).should.eql(['a', 'b', 'c']);
    (['a/b', 'a/c', 'b/c'].filter(mm.filter('a/*'))).should.eql(['a/b', 'a/c']);
  });
});
