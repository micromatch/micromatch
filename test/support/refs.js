'use strict';

var micromatch = require('../..');
var minimatch = require('minimatch');
var nanomatch = require('nanomatch');
var brackets = require('expand-brackets');
var extglob = require('extglob');
var braces = require('braces');

/**
 * Reference parsers
 */

module.exports = function(pattern, options) {
  console.log('micromatch:', micromatch.makeRe(pattern, options));
  console.log('minimatch:', minimatch.makeRe(pattern, options));
  console.log('nanomatch:', nanomatch.makeRe(pattern, options));
  console.log('brackets:', brackets.makeRe(pattern, options));
  console.log('extglob:', extglob.makeRe(pattern, options));
  console.log('braces:', braces.makeRe(pattern, options));
};

// temporary debuggin methods
module.exports.mc = micromatch;
module.exports.mi = minimatch;
module.exports.nm = nanomatch;
module.exports.bk = brackets;
module.exports.ex = extglob;
module.exports.br = braces;
