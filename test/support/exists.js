'use strict';

var path = require('path');
var exists = require('fs-exists-sync');

module.exports = function(files, cwd) {
  files = Array.isArray(files) ? files : [files];
  var len = files.length;
  var idx = -1;
  while (++idx < len) {
    var file = files[idx];
    if (typeof cwd === 'string') {
      file = path.join(cwd, file);
    }
    if (!exists(file)) {
      return false;
    }
  }
  return true;
};
