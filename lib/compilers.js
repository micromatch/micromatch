'use strict';

var nanomatch = require('nanomatch');
var brackets = require('expand-brackets');
var extglob = require('extglob');

module.exports = function(micromatch) {

  /**
   * Compiler plugins
   */

  micromatch.use(nanomatch.compilers);
  if (micromatch.options.brackets !== false) {
    micromatch.use(brackets.compilers);
  }
  if (micromatch.options.extglob !== false) {
    micromatch.use(extglob.compilers);
  }

  /**
   * Micromatch compilers
   */

  // micromatch.compiler

};
