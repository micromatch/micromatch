/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

require('should');
var argv = require('minimist')(process.argv.slice(2));
var ref = require('./support/reference');
var mm = require('..');

if ('minimatch' in argv) {
  mm = ref.minimatch;
}

var arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

describe('.filter()', function () {
  it('should throw on undefined args:', function () {
    (function () {
      mm.filter();
    }).should.throw('micromatch.filter(): patterns should be a string or array.');
  });

  it('should throw on bad args:', function () {
    (function () {
      mm.filter({});
    }).should.throw('micromatch.filter(): patterns should be a string or array.');
  });

  it('should create a filter function to filter files', function () {
    mm.filter('*').should.be.a.function;
  });

  it('should filter files', function () {
    ['a', 'b', 'c'].filter(mm.filter('*')).should.eql(['a', 'b', 'c']);
    ['a/a', 'b/a', 'a/c'].filter(mm.filter('a/*')).should.eql(['a/a', 'a/c']);
  });

  it('should filter using multiple patterns', function () {
    var actual_A = arr.filter(mm.filter(['{1..10}', '![7-9]', '!{3..4}']));
    actual_A.should.eql([1, 2, 5, 6, 10]);
    actual_A.should.not.eql([1, 2, 3, 4, 5, 6, 10]);

    // see https://github.com/jonschlinkert/micromatch/issues/7
    var actual_B = [
      'fs-readdir-callback-api.js',
      'fs-readdir-stream-api.js',
      'glob-stream.js',
      'readdirp-callback-api.js',
      'readdirp-stream-api.js',
      'recursive-readdir.js'
    ].filter(mm.filter(['*', '!*api*']));
    actual_B.should.eql(['glob-stream.js', 'recursive-readdir.js']);
  });
});

