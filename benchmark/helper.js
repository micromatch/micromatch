'use strict';

var fs = require('fs');
var path = require('path');
var size = require('window-size');
var repeat = require('repeat-string');

function bench() {
  var filepath = path.join(__dirname, 'last.md');
  var str = fs.readFileSync(filepath, 'utf8');
  var sections = str.split(/(?=\n?(?:# benchmark))/);
  sections.shift();

  var len = sections.length;
  var idx = -1;
  var res = [];

  while (++idx < len) {
    var section = sections[idx].trim();
    var tok = parseSection(section);
    if (tok) res.push(tok);
  }

  return res.join('\n');
}

function parseSection(str) {
  var lines = str.split('\n').filter(Boolean);
  if (!lines.length) return;
  var title = lines.shift().trim();
  var m = /^.*\/fixtures\/match\/([^(]+)/.exec(title);

  var tok = {title: (m ? m[1] : title).trim()};
  tok.title = tok.title.slice(0, tok.title.length - 3);

  tok.micromatch = parseStats(lines);
  tok['minimatch '] = parseStats(lines);
  tok.multimatch = parseStats(lines);
  var vals = values(tok);
  var max = Math.max.apply(Math, vals);

  var str = '';
  str += ['#', tok.title].join(' ') + '\n';
  str += format('micromatch', tok, max, 100);
  str += format('minimatch ', tok, max, 100);
  str += format('multimatch', tok, max, 100);
  // console.log(str)
  return str;
}

function parseStats(lines) {
  var str = lines.shift().trim();
  var m = /^([^\s]+)\s*x\s*([\d,.]+)/.exec(str);
  if (!m) return 0;
  var str = m[2];
  var num = String(str).split(',').join('');
  return {
    num: num,
    str: str
  };
}

function values(obj) {
  var vals = [];
  for (var key in obj) {
    if (key === 'title') continue;
    vals.push(obj[key].num);
  }
  return vals;
}

function bar(tok, longest, diff) {
  return repeat('█', (tok.num / longest) * (size.width - diff));
}

function format(name, tok, max, diff) {
  return [name, bar(tok[name], max, diff), '(' + tok[name].str + ' ops/sec)', '\n'].join(' ');
}

/**
 * Expose `.bench` helper
 */

module.exports.bench = bench;
