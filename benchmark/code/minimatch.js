'use strict';


var minimatch = require('minimatch').match;
var multimatch = require('multimatch');

module.exports = function (files, patterns, options) {
  if (Array.isArray(patterns)) {
    return multimatch(files, patterns, options);
  }
  return minimatch(files, patterns, options);
};