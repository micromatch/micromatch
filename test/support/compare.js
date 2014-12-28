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

describe('.makeRe()', function () {
  patterns.forEach(function (fixture, i) {
    it('micromatch should match minimatch: ' + i, function () {
      micro.makeRe(fixture).should.eql(mini.makeRe(fixture));
    });

    // it('micromatch should match minimatch: ' + i, function () {
    //   micro.makeRe(fixture, {dot: true}).should.eql(mini.makeRe(fixture, {dot: true}));
    // });
  });
});
