'use strict';

var Suite = require('benchmarked');
var suite = new Suite({
  cwd: __dirname,
  fixtures: 'fixtures/*.js',
  code: 'code/*.js'
});

suite.run();
