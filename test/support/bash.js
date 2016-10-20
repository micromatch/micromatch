'use strict';

var spawn = require('cross-spawn');
var utils = require('./utils');

function bash(str, pattern, options) {
  var cmd = pattern;

  if (!/echo/.test(cmd)) {
    cmd = `shopt -s extglob && shopt -s globstar && if [[ ${str} == ${pattern} ]]; then echo true; fi`;
  }

  var res = spawn.sync(utils.getBashPath(), ['-c', cmd], options);
  var err = toString(res.stderr);
  if (err) {
    console.error(cmd);
    throw new Error(err);
  }

  return !!toString(res.stdout);
}

bash.isMatch = function(fixture, pattern, options) {
  return bash(fixture, pattern, options);
};

bash.match = function(fixtures, pattern) {
  var matches = [];
  var len = fixtures.length;
  var idx = -1;
  while (++idx < len) {
    var fixture = fixtures[idx];
    if (bash.isMatch(fixture, pattern)) {
      matches.push(fixture);
    }
  }
  return matches;
};

/**
 * Stringify `buf`
 */

function toString(buf) {
  return buf ? buf.toString().trim() : null;
}

/**
 * Expose `bash`
 */

module.exports = bash;
