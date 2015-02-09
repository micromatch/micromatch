'use strict';

var fs = require('fs');
var chalk = require('chalk');
var path = require('path');
var mm = require('..');

/**
 * Sanity check. run to ensure that all fns return a correct
 * result.
 */

fs.readdirSync(__dirname + '/code').forEach(function (fp) {
  if (mm.isMatch(fp, 'micromatch.js')) {
    var fn = require(path.resolve(__dirname, 'code', fp));
    var name = path.basename(fp, path.extname(fp));

    fs.readdirSync(__dirname + '/fixtures').forEach(function (fixture) {
      if (mm.isMatch(fixture, 'large.js')) {
        fixture = path.resolve(__dirname, 'fixtures', fixture);
        console.log(chalk.bold(name) + ':', fn.apply(null, require(fixture)));
      }
    });
  }
});
