'use strict';

const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const suite = require('benchmarked');
const write = require('write');
const type = argv._[0] || 'match';

suite.run({code: `code/${type}/*.js`, fixtures: `fixtures/${type}/*.js`})
  .then(function(stats) {
    write.sync(path.join(__dirname, 'stats.json'), JSON.stringify(stats, null, 2))
    write.sync(path.join(__dirname, 'stats.md'), suite.render(stats));
  })
  .catch(console.error);
