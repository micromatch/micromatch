'use strict';

var argv = require('yargs-parser')(process.argv.slice(2));
var mm = require('micromatch');

if ('mm' in argv) {
  mm = require('minimatch');
  mm.minimatch = true;
}

module.exports = mm;
