'use strict';

var exists = require('fs-exists-sync');
var bashPath;

exports.getBashPath = function() {
  if (bashPath) return bashPath;
  if (exists('/usr/local/bin/bash')) {
    bashPath = '/usr/local/bin/bash';
  } else if (exports.exists('/bin/bash')) {
    bashPath = '/bin/bash';
  } else {
    bashPath = 'bash';
  }
  return bashPath;
};
