'use strict';

var assert = require('assert');
var Glob = require('../lib/glob');
var mm = require('..');

describe('Glob class', function () {
  describe('constructor', function () {
    it('should return an instance of Glob', function () {
      var glob = new Glob('foo');
      assert(glob instanceof Glob);
    });

    it('should instantiate without new', function () {
      var glob = Glob('foo');
      assert(glob instanceof Glob);
    });
  });

  describe('instance', function () {
    it('should expose `orig`', function () {
      var glob = new Glob('!foo');
      assert.equal(glob.orig, '!foo');
    });

    it('should expose `pattern`', function () {
      var glob = new Glob('!foo');
      assert.equal(glob.pattern, 'foo');
    });

    it('should expose `options`', function () {
      var glob = new Glob('!foo');
      assert(glob.options);
      assert(typeof glob.options === 'object');
    });
  });

  describe('tokens', function () {
    it('should parse a glob pattern and expose a tokens object', function () {
      var glob = new Glob('!foo');
      glob.parse();
      assert(glob.hasOwnProperty('tokens'));
      assert(glob.tokens.hasOwnProperty('is'));
    });

    it('should recognize extglob patterns', function () {
      var glob = new Glob('@(a|b)');
      glob.parse();
      assert(glob.tokens.is.extglob === true);
    });
  });

  describe('.extglob()', function () {
    it('should parse extglob patterns', function () {
      var glob = new Glob('@(a|b)');
      glob.parse();
      glob.extglob();
      assert.equal(glob.pattern, '(?:a|b)');
    });

    it('should ignore non-extglobs', function () {
      var glob = new Glob('foo/*.js');
      glob.parse();
      glob.extglob();
      assert.equal(glob.pattern, 'foo/*.js');
    });

    it('should parse extglob patterns', function () {
      var glob = new Glob('@(a|b)', {noextglob: true});
      glob.parse();
      glob.extglob();
      assert.equal(glob.pattern, '@(a|b)');
    });
  });

  describe('patterns', function () {
    it('should escape dots', function () {
      var actual = mm.expand('.');
      assert.deepEqual(actual.pattern, '\\.');
    });

    it('should strip leading !', function () {
      var glob = new Glob('!foo');
      assert.deepEqual(glob.pattern, 'foo');
    });
  });

  describe('options', function () {
    describe('options.track', function () {
      it('should track history for debugging:', function () {
        var actual = mm.expand('**/*.js', {track: true});
        assert(actual.hasOwnProperty('history'));
        assert(Array.isArray(actual.history));
        assert(actual.history.length > 1);
      });
    });

    describe('options.nonegate', function () {
      it('should ignore negation patterns when `nonegate` is true:', function () {
        var array = ['a.js', 'b.js', 'c.js'];
        var actual = mm(array, '!*.js', {nonegate: true});
        assert.deepEqual(array, actual);
      });
    });
  });

  describe('leading slash', function () {
    it('should match paths with leading slashes:', function () {
      var array = ['/a.js', '/b.js', '/c.js'];
      var actual = mm(array, '/*.js');
      assert.deepEqual(array, actual);
    });

    it('should match dotfiles with leading slashes:', function () {
      var array = ['/.a.js', '/.b.js', '/.c.js'];
      var actual = mm(array, '/.*.js');
      assert.deepEqual(array, actual);
    });
  });
});
