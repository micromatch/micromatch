'use strict';

/**
 * Module dependencies
 */

var debug = require('debug')('micromatch');
var Snapdragon = require('snapdragon');
var define = require('define-property');
var extend = require('extend-shallow');

/**
 * Local dependencies
 */

var compilers = require('./compilers');
var parsers = require('./parsers');

/**
 * Customize Snapdragon parser and renderer
 */

function Micromatch(options) {
  debug('initializing from <%s>', __filename);
  this.options = extend({}, options);
  this.snapdragon = this.options.snapdragon || new Snapdragon(this.options);
  this.compiler = this.snapdragon.compiler;
  this.parser = this.snapdragon.parser;

  /**
   * Override Snapdragon `.parse` method
   */

  define(this.snapdragon, 'parse', function(str, options) {
    var parsed = Snapdragon.prototype.parse.apply(this, arguments);
    parsed.input = str;

    // escape unmatched brace/bracket/parens
    var last = this.parser.stack.pop();
    if (last && this.options.strictErrors !== true) {
      var open = last.nodes[0];
      var inner = last.nodes[1];
      if (last.type === 'bracket') {
        if (inner.val.charAt(0) === '[') {
          inner.val = '\\' + inner.val;
        }

      } else {
        open.val = '\\' + open.val;
        var sibling = open.parent.nodes[1];
        if (sibling.type === 'star') {
          sibling.loose = true;
        }
      }
    }

    // add non-enumerable parser reference
    define(parsed, 'parser', this.parser);
    return parsed;
  });
}

/**
 * Initialize defaults
 */

Micromatch.prototype.init = function() {
  if (!this.isInitialized) {
    this.isInitialized = true;
    compilers(this.snapdragon);
    parsers(this.snapdragon);
  }
};

/**
* Decorate `.parse` method
*/

Micromatch.prototype.parse = function(ast, options) {
  this.init();
  return this.snapdragon.parse.apply(this.snapdragon, arguments);
};

/**
* Decorate `.compile` method
*/

Micromatch.prototype.compile = function(ast, options) {
  this.init();
  return this.snapdragon.compile.apply(this.snapdragon, arguments);
};

/**
 * Expose `Micromatch`
 */

module.exports = Micromatch;
