/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

require('should');
var mm = require('..');

describe('regex matching', function () {
  it('should support matching with regex', function () {
    mm(['.'], /\./).should.eql(['.']);
    mm(['ab'], /ab/).should.eql(['ab']);
    mm(['ab', 'a'], /a$/).should.eql(['a']);
    mm(['ab', 'a'], /\/a/).should.eql([]);
    mm(['ab', 'a'], /aa/).should.eql([]);
    mm(['/ab', '/a'], /\/a$/).should.eql(['/a']);
  });

  it('should support matching with regex', function () {
    mm.match(['.'], /\./).should.eql(['.']);
    mm.match(['ab'], /ab/).should.eql(['ab']);
    mm.match(['ab', 'a'], /a$/).should.eql(['a']);
    mm.match(['ab', 'a'], /\/a/).should.eql([]);
    mm.match(['ab', 'a'], /aa/).should.eql([]);
    mm.match(['/ab', '/a'], /\/a$/).should.eql(['/a']);
  });
});
