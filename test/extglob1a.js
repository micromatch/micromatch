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
    mm.match(['ba'], 'a!(x)', {extglob: true}).should.eql([]);
    mm.match(['ba', 'ab'], 'a!(x)', {extglob: true}).should.eql(['ab']);
    mm.match(['ba'], 'a*(?(x))', {extglob: true}).should.eql([]);
    mm.match(['ba', 'ax', 'a'], 'a*(?(x))', {extglob: true}).should.eql(['ax', 'a']);
    mm.match(['a', 'ab'], 'a*!(x)/b/?(y)/c', {extglob: true}).should.eql([]);
    mm.match(['ab', 'ba'], 'a?(x)', {extglob: true}).should.eql([]);
    mm.match(['ba'], 'a*!(x)', {extglob: true}).should.eql([]);
  });

  it('pending:', function () {
    mm.match(['a', 'ab', 'x'], 'a!(x)', {extglob: true}).should.eql(['a', 'ab']);
    mm.match(['a'], 'a?(x)', {extglob: true}).should.eql(['a']);
    mm.match(['a.js', 'a.md', 'a.js.js', 'c.js', 'a.', 'd.js.d'], '*.!(js)', {extglob: true}).should.eql(['a.md', 'a.', 'd.js.d']);
    // mm.match(['a', 'ab'], 'a*(?(x))', {extglob: true}).should.eql(['a', 'ab']);
    mm.match(['a', 'ab'], 'a*(!(x))', {extglob: true}).should.eql(['a', 'ab']);
    mm.match(['a', 'x'], 'a*(!(x))', {extglob: true}).should.eql(['a']);
    mm.match(['a', 'x', 'ab', 'ax'], 'a*(!(x))', {extglob: true}).should.eql(['a', 'ab']);
  });
})
