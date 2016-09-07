'use strict';

var path = require('path');
var util = require('util');
var cyan = require('ansi-cyan');
var argv = require('yargs-parser')(process.argv.slice(2));
var Suite = require('benchmarked');

function run(type) {
  var suite = new Suite({
    cwd: __dirname,
    fixtures: path.join('fixtures', type, '*.js'),
    code: path.join('code', type, '*.js')
  });

  if (argv.dry) {
    suite.dryRun(function(code, fixture) {
      console.log(cyan('%s > %s'), code.key, fixture.key);
      var args = require(fixture.path);
      console.log(util.inspect(code.run(args), null, 10));
      console.log();
    });
  } else {
    suite.run();
  }
}

run(argv._[0] || 'match');
