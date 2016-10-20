'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');
var nm = require('../..');

function parseFiles(pattern, options) {
  var opts = Object.assign({cwd: process.cwd()}, options);
  var cwd = opts.cwd;

  var files = nm(fs.readdirSync(cwd), pattern);
  var tests = {};

  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var name = path.basename(file, path.extname(file));
    tests[name] = parse(path.join(cwd, file));
  }
  return tests;
}

function parse(fp) {
  var str = fs.readFileSync(fp, 'utf8');
  var lines = str.split('\n');
  var len = lines.length;
  var idx = -1;
  var tests = [];

  while (++idx < len) {
    var line = lines[idx].trim();

    if (!line) continue;
    if (/^#\s\w/.test(line)) {
      tests.push(line.replace(/^[#\s]+/, '').toLowerCase());
      continue;
    }
    if (!/^[tf] /.test(line)) continue;

    var segs = line.split(/\s+/).filter(Boolean);
    if (segs.length !== 3) continue;
    tests.push([segs[1], segs[2], segs[0] === 't']);
  }
  return tests.filter(Boolean);
}

module.exports = parseFiles;
