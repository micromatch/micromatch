'use strict';

var reference = module.exports;

reference.minimatch = require('minimatch');

reference.wildmatch = require('wildmatch');

reference.wildmatch.match = function(files, pattern) {
  return files.filter(function (fp) {
    return reference.wildmatch(fp, pattern);
  });
};