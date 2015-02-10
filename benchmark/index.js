'use strict';

var Suite = require('benchmarked');
var suite = new Suite({
  result: false,
  fixtures: 'fixtures/bas*.js',
  add: 'code/*.js',
  cwd: __dirname
});

suite.run();
