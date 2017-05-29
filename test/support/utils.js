'use strict';

var fs = require('fs');
var bashPath;

exports.getBashPath = function() {
  if (bashPath) return bashPath;
  if (fs.existsSync('/usr/local/bin/bash')) {
    bashPath = '/usr/local/bin/bash';
  } else if (fs.existsSync('/bin/bash')) {
    bashPath = '/bin/bash';
  } else {
    bashPath = 'bash';
  }
  return bashPath;
};
