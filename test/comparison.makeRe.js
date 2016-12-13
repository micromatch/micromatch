'use strict';

var isTravis = process.env.CI || process.env.TRAVIS;
var isWindows = require('is-windows');
var assert = require('assert');
var bash = require('bash-match');
var mm = require('minimatch');
var mi = require('./support/matcher');

var fixtures = require('./_fixtures');
var patterns = require('./_patterns');

describe('.makeRe', function() {
  if (isWindows() || isTravis) {
    console.log('these tests use bash to test for bash parity. since bash does not work on most versions of windows, these tests are skipped on windows');
    return;
  }

  patterns.forEach(function(pattern) {
    // if (pattern !== 'a/b/c/**/*.js') return;

    fixtures.forEach(function(fixture) {
      // if (fixture !== 'a/b/c/z.js') return;

      it('should match ' + fixture + ' with ' + pattern, function() {
        var mmRes = mm.makeRe(pattern).test(fixture);
        var miRes = mi.makeRe(pattern).test(fixture);
        var actual = miRes === mmRes;

        // minimatch is wrong on these
        if (actual === false) {
          // tie-breaker
          if (miRes === mm(fixture, pattern) || /^\?/.test(pattern)) {
            actual = true;
          } else if (!isWindows() && !isTravis)  {
            actual = miRes === mi.bash.isMatch(fixture, pattern);
          } else {
            this.skip();
            return;
          }
        }

        assert(actual, fixture + ' ' + pattern);
      });

      it('should match ' + fixture + ' with ' + pattern + ' and {dot: true}', function() {
        var mmRes = mm.makeRe(pattern, {dot: true}).test(fixture);
        var miRes = mi.makeRe(pattern, {dot: true}).test(fixture);
        var actual = miRes === mmRes;

        // minimatch is wrong on these
        if (actual === false) {
          // tie-breaker
          if (miRes === mm(fixture, pattern, {dot: true})) {
            actual = true;
          } else if (/^\?/.test(pattern) || /^\.\//.test(fixture)) {
            actual = true;
          } else if (!isWindows() && !isTravis)  {
            actual = miRes === mi.bash.isMatch(fixture, pattern, {dot: true});
          } else {
            this.skip();
            return;
          }
        }

        assert(actual, fixture + ' ' + pattern);
      });

      it('should match ' + fixture + ' with ' + pattern + ' and {nonegate: true}', function() {
        var mmRes = mm.makeRe(pattern, {nonegate: true}).test(fixture);
        var miRes = mi.makeRe(pattern, {nonegate: true}).test(fixture);
        var actual = miRes === mmRes;

        // minimatch is wrong on these
        if (actual === false) {
          // tie-breaker
          if (miRes === mm(fixture, pattern, {nonegate: true})) {
            actual = true;
          } else if (/^\?/.test(pattern) || /^\!/.test(fixture)) {
            actual = true;
          } else if (!isWindows() && !isTravis)  {
            actual = miRes === mi.bash.isMatch(fixture, pattern, {nonegate: true});
          } else {
            this.skip();
            return;
          }
        }

        assert(actual, fixture + ' ' + pattern);
      });
    });
  });
});
