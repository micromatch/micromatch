'use strict';

const fs = require('fs');
const repeat = require('repeat-string');
const longest = require('longest');

function render(filepath) {
  const benchmarks = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  const res = [];

  for (let i = 0; i < benchmarks.length; i++) {
    const target = benchmarks[i];
    const vals = values(target.results, 'hz');
    const max = +Math.max.apply(Math, vals).toFixed();

    const keys = values(target.results, 'name');
    const len = longest(keys).length;
    const names = {};
    keys.forEach(function(key) {
      names[key] = key + repeat(' ', len - key.length);
    });

    let b = `# ${target.name} ${target.file.bytes}\n`;

    for (let i = 0; i < target.results.length; i++) {
      const stats = target.results[i];
      const name = names[stats.name];
      b += `  ${name} ${bar(stats.hz, max)} (${stats.ops} ops/sec ±${stats.rme}%)`;
      b += '\n';
    }

    b += `\n  ${target.fastest.join(', ')} is faster by an avg. of ${diff(target)}`;
    b += '\n';
    res.push(b);
  }
  return res.join('\n').trim();
};

function diff(target) {
  let len = target.results.length;
  let fastest = 0;
  let rest = 0;

  for (let i = 0; i < len; i++) {
    let stats = target.results[i];

    if (target.fastest.indexOf(stats.name) !== -1) {
      fastest = +stats.hz;
    } else {
      rest += +stats.hz;
    }
  }
  var avg = (fastest / (+rest / (len - 1)) * 100);
  return formatNumber(avg) + '%';
}

function formatNumber(num) {
  num = String(num.toFixed(num < 100 ? 2 : 0)).split('.');
  return num[0].replace(/(?=(?:\d{3})+$)(?!\b)/g, ',')
    + (num[1] ? '.' + num[1] : '');
}

function values(results, prop) {
  const res = [];
  for (let val of results) {
    res.push(val[prop]);
  }
  return res;
}

function bar(len, longest, max) {
  return repeat('█', (len / longest) * (max || 50));
}

/**
 * Expose `.bench` helper
 */

module.exports.benchmarks = render;
