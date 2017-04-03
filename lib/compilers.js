'use strict';

var nanomatch = require('nanomatch');
var extglob = require('extglob');

module.exports = function(snapdragon) {
  var compilers = snapdragon.compiler.compilers;

  snapdragon.state = snapdragon.state || {};

  // register nanomatch compilers
  snapdragon.use(nanomatch.compilers);

  // get references to some specific nanomatch compilers before they
  // are overridden by the extglob and/or custom compilers
  var escape = compilers.escape;
  var qmark = compilers.qmark;
  var slash = compilers.slash;
  var star = compilers.star;
  var text = compilers.text;
  var plus = compilers.plus;
  var dot = compilers.dot;
  var eos = compilers.eos;

  // register extglob compilers
  snapdragon.use(extglob.compilers);
  snapdragon.use(function() {
    this.options.star = this.options.star || function(/*node*/) {
      return '[^/]*?';
    };
  });

  // custom micromatch compilers
  snapdragon.compiler

    // reset referenced compiler
    .set('dot', dot)
    .set('escape', escape)
    .set('plus', plus)
    .set('slash', slash)
    .set('qmark', qmark)
    .set('star', star)
    .set('text', text)

    // customize end-of-string compiler
    .set('eos', function(node) {
      if (this.ast.input.slice(-1) !== '/' && this.output.slice(-1) !== '/') {
        var suffix = /(\w|\/\])$/.test(this.output) ? '\\/?' : '(\\/|$)';
        var len = suffix.length;
        if (snapdragon.state.metachar && this.output.slice(-len) !== suffix) {
          this.output += suffix;
        }
      }
      if (typeof eos === 'function') {
        return eos.apply(this, arguments);
      }
      return this.emit(node.val, node);
    });
};
