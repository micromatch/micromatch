'use strict';

var debug = require('debug')('micromatch');
var Snapdragon = require('snapdragon');
var compilers = require('./compilers');
var parsers = require('./parsers');
var utils = require('./utils');

/**
 * Customize Snapdragon parser and renderer
 */

function Micromatch(options) {
  debug('initializing from <%s>', __filename);
  this.options = utils.extend({source: 'micromatch'}, options);
  this.snapdragon = this.options.snapdragon || new Snapdragon(this.options);

  /**
   * Override Snapdragon `.parse` method
   */

  utils.define(this.snapdragon, 'parse', function(str, options) {
    var parsed = Snapdragon.prototype.parse.apply(this, arguments);

    // escape ummatched brace/bracket/parens
    var last = this.parser.stack.pop();
    if (last) {
      var node = last.nodes[0];

      if (last.type !== 'bracket') {
        node.val = '\\' + node.val;
      }

      var sibling = node.parent.nodes[1];
      if (sibling.type === 'star') {
        sibling.loose = true;
      }
    }

    // add non-enumerable parser reference
    utils.define(parsed, 'parser', this.parser);
    return parsed;
  });

  /**
   * Decorate `.parse` method
   */

  utils.define(this, 'parse', function(ast, options) {
    return this.snapdragon.parse.apply(this.snapdragon, arguments);
  });

  /**
   * Decorate `.compile` method
   */

  utils.define(this, 'compile', function(ast, options) {
    return this.snapdragon.compile.apply(this.snapdragon, arguments);
  });

  /**
   * Create a regular expression from the given glob `pattern`.
   *
   * ```js
   * var mm = require('micromatch');
   * var re = mm.makeRe('*.!(*a)');
   * console.log(re);
   * //=> /^[^\/]*?\.(?![^\/]*?a)[^\/]*?$/
   * ```
   * @param {String} `pattern` The glob pattern to convert
   * @param {Object} `options`
   * @return {RegExp}
   * @api public
   */

  utils.define(this, 'makeRe', function() {
    return this.snapdragon.makeRe.apply(this.snapdragon, arguments);
  });

  /**
   * Create a regex from the given `string` and `options`
   */

  utils.define(this, 'toRegex', function() {
    return this.snapdragon.toRegex.apply(this.snapdragon, arguments);
  });

  this.compiler = this.snapdragon.compiler;
  this.parser = this.snapdragon.parser;

  compilers(this.snapdragon);
  parsers(this.snapdragon);
}

/**
 * Expose `Micromatch`
 */

module.exports = Micromatch;
