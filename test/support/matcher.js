'use strict';

var utils = require('../../lib/utils');
var argv = require('minimist')(process.argv.slice(2));
var bash = require('bash-match');
var minimatch = require('minimatch');
var mu = require('multimatch');
var mi = require('../..');

// use multimatch for the array/array scenario
function mm() {
  return mu.apply(null, arguments);
}

// label for debugging
mi.micromatch = true;
mu.multimatch = true;
mm.minimatch = true;
bash.bash = true;

/**
 * Decorate methods onto bash for parity with micromatch
 */

bash.makeRe = function() {};

/**
 * Decorate methods onto multimatch for parity with micromatch
 */

mu.isMatch = function(files, patterns, options) {
  return mu(utils.arrayify(files), patterns, options).length > 0;
};

mu.match = function(files, patterns, options) {
  return mu(utils.arrayify(files), patterns, options);
};

mu.makeRe = function(pattern, options) {
  return mm.makeRe(pattern, options);
};

mu.braces = function(pattern, options) {
  return mm.braceExpand(pattern, options);
};

/**
 * Decorate methods onto minimatch for parity with micromatch
 */

mm.isMatch = function(file, pattern, options) {
  return minimatch(file, pattern, options);
};

mm.match = function(files, pattern, options) {
  return minimatch.match(utils.arrayify(files), pattern, options);
};

mm.makeRe = function(pattern, options) {
  return minimatch.makeRe(pattern, options);
};

mm.braces = function(pattern, options) {
  return minimatch.braceExpand(pattern, options);
};

/**
 * Detect matcher based on argv, with micromatch as default
 */

var matcher = mi;
if (argv.bash) {
  matcher = bash;
} else if (argv.mu) {
  matcher = mu;
} else if (argv.mm) {
  matcher = mm;
}

/**
 * Expose matcher
 */

module.exports = matcher;
module.exports.bash = bash;
module.exports.mi = mi;
module.exports.mu = mu;
module.exports.mm = mm;
