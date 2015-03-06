/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var argv = require('minimist')(process.argv.slice(2));
var minimatch = require('./support/reference');
var mm = require('..');
require('should');

if ('minimatch' in argv) {
  mm = minimatch;
}


describe('.matcher() should return matcher functions', function () {
  it('when the pattern is regex:', function () {
    var isMatch = mm.matcher(/[a-c]\.md$/);
    isMatch('a.md').should.be.true;
    isMatch('b.md').should.be.true;
    isMatch('c.md').should.be.true;
    isMatch('e.md').should.be.false;
    isMatch('d.md').should.be.false;
    isMatch('a.js').should.be.false;
    isMatch('c.js').should.be.false;
  });

  it('when the pattern is a glob string:', function () {
    var isMatch = mm.matcher('**/*.js');
    isMatch('a/a.md').should.be.false;
    isMatch('a/b.md').should.be.false;
    isMatch('a/c.md').should.be.false;
    isMatch('a/e.md').should.be.false;
    isMatch('a/d.md').should.be.false;
    isMatch('a/a.js').should.be.true;
    isMatch('a/c.js').should.be.true;
  });

  it('when the pattern is a glob it should support `matchBase`:', function () {
    var matcherA = mm.matcher('*.js', {matchBase: false});
    matcherA('a/a.js').should.be.false;
    matcherA('a/c.js').should.be.false;

    var matcherB = mm.matcher('*.js', {matchBase: true});
    matcherB('a/a.js').should.be.true;
    matcherB('a/c.js').should.be.true;
  });

  it('when the pattern is a non-glob string:', function () {
    var isMatch = mm.matcher('b.md');
    isMatch('a.md').should.be.false;
    isMatch('b.md').should.be.true;
    isMatch('c.md').should.be.false;
    isMatch('e.md').should.be.false;
    isMatch('d.md').should.be.false;
    isMatch('a.js').should.be.false;
    isMatch('c.js').should.be.false;
  });

  it('when the pattern is a function:', function () {
    var isMatch = mm.matcher(function (fp) {
      return fp === 'a.md';
    });

    isMatch('a.md').should.be.true;
    isMatch('b.md').should.be.false;
    isMatch('c.md').should.be.false;
    isMatch('d.md').should.be.false;
    isMatch('e.md').should.be.false;
  });
});
