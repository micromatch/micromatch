'use strict';

var argv = require('yargs-parser')(process.argv.slice(2));
var mm = require('multimatch');
var bash = require('bash-match');
var minimatch = require('minimatch');
var utils = require('../../lib/utils');
var nm = require('../..');

// use multimatch for the array/array scenario
function mi() {
  return mm.apply(null, arguments);
}

// label for debugging
mm.multimatch = true;
mi.minimatch = true;
nm.nanomatch = true;
bash.bash = true;

/**
 * Decorate methods onto bash for parity with nanomatch
 */

bash.makeRe = function() {};

/**
 * Decorate methods onto multimatch for parity with nanomatch
 */

mm.isMatch = function(files, patterns, options) {
  return mm(utils.arrayify(files), patterns, options).length > 0;
};

mm.match = function(files, patterns, options) {
  return mm(utils.arrayify(files), patterns, options);
};

mm.makeRe = function(pattern, options) {
  return mi.makeRe(pattern, options);
};

mm.braces = function(pattern, options) {
  return mi.braceExpand(pattern, options);
};

/**
 * Decorate methods onto minimatch for parity with nanomatch
 */

mi.isMatch = function(file, pattern, options) {
  return minimatch(file, pattern, options);
};

mi.match = function(files, pattern, options) {
  return minimatch.match(utils.arrayify(files), pattern, options);
};

mi.makeRe = function(pattern, options) {
  return minimatch.makeRe(pattern, options);
};

mi.braces = function(pattern, options) {
  return minimatch.braceExpand(pattern, options);
};

/**
 * Detect matcher based on argv, with nanomatch as default
 */

var matcher = argv.mm ? mm : (argv.mi ? mi : nm);
if (argv.bash) {
  matcher = bash;
}

/**
 * Expose matcher
 */

module.exports = matcher;
module.exports.bash = bash;
module.exports.nm = nm;
module.exports.mm = mm;
module.exports.mi = mi;
