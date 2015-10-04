/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

require('should');
var assert = require('assert');
var argv = require('minimist')(process.argv.slice(2));
var ref = require('./support/reference');
var mm = require('..');

if ('minimatch' in argv) {
  mm = ref.minimatch;
}

/**
 * minimatch and micromatch fail on all of these
 */

describe.skip('character classes in extglobs', function () {
  it('should match using POSIX character classes in extglobs:', function () {
    assert.equal(mm.isMatch('a.c', '+([[:alpha:].])'), true);
    assert.equal(mm.isMatch('a.c', '+([[:alpha:].])+([[:alpha:].])'), true);
    assert.equal(mm.isMatch('a.c', '*([[:alpha:].])'), true);
    assert.equal(mm.isMatch('a.c', '*([[:alpha:].])*([[:alpha:].])'), true);

    assert.equal(mm.isMatch('a.c', '?([[:alpha:].])?([[:alpha:].])?([[:alpha:].])'), true);
    assert.equal(mm.isMatch('a.c', '@([[:alpha:].])@([[:alpha:].])@([[:alpha:].])'), true);

    assert.equal(mm.isMatch('.', '!([[:alpha:].])'), false);
    assert.equal(mm.isMatch('.', '?([[:alpha:].])'), true);
    assert.equal(mm.isMatch('.', '@([[:alpha:].])'), true);
  });
});
