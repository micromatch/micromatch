'use strict';

var path = require('path');
var assert = require('assert');
var forOwn = require('for-own');
var parse = require('./support/parse');
var nm = require('./support/matcher');
var fixtures = parse('*.txt', {cwd: path.join(__dirname, 'fixtures')});

forOwn(fixtures, function(lines, filename) {
  describe(filename + ':', function() {
    lines.forEach(function(line) {
      if (typeof line === 'string') {
        console.log(line);
        return;
      }

      var fixture = line[0];
      var pattern = line[1];
      var expected = line[2];

      var title = '"' + fixture
        + '" should' + (expected ? '' : ' not')
        + ' match "' + pattern + '"';

      it(title, function() {
        var msg = fixture + (expected ? ' === ' : ' !== ') + pattern;
        // assert.equal(nm.isMatch(fixture, pattern), nm.mm.isMatch(fixture, pattern), msg);
        assert.equal(nm.isMatch(fixture, pattern), expected, msg);
      });
    });
  });
});
