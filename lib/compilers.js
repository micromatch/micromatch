'use strict';

var nanomatch = require('nanomatch');
var extglob = require('extglob');

module.exports = function(micromatch) {
  var compilers = micromatch.compiler.compilers;

  micromatch.state = micromatch.state || {};
  micromatch.use(nanomatch.compilers);

  // store nanomatch compilers to override extglob compilers
  var escape = compilers.escape;
  var qmark = compilers.qmark;
  var slash = compilers.slash;
  var star = compilers.star;
  var plus = compilers.plus;
  var text = compilers.text;
  var dot = compilers.dot;

  micromatch.use(extglob.compilers);
  micromatch.compiler
    .set('dot', dot)
    .set('escape', escape)
    .set('plus', plus)
    .set('slash', slash)
    .set('qmark', qmark)
    .set('star', star)
    .set('text', text)
    .set('eos', function(node) {
      var suffix = '\\/?';
      var len = suffix.length;
      if (micromatch.state.metachar && this.output.slice(-len) !== suffix) {
        this.output += suffix;
      }
      return this.emit(node.val, node);
    });
};
