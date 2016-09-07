'use strict';

var nanomatch = require('nanomatch');
var brackets = require('expand-brackets');
var extglob = require('extglob');

module.exports = function(micromatch) {
  micromatch.use(nanomatch.compilers);
  micromatch.use(brackets.compilers);
  micromatch.use(extglob.compilers);
};
