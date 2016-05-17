'use strict';

var minimatch = require('minimatch').match;
var multimatch = require('multimatch');

module.exports = function (files, patterns, options) {
  if (!Array.isArray(patterns)) {
    return minimatch.apply(null, arguments);
  }
  return multimatch(files, patterns, options);
};
