'use strict';

var nanomatch = require('nanomatch');
var brackets = require('expand-brackets');
var extglob = require('extglob');
var utils = require('./utils');

module.exports = function(micromatch) {

  /**
   * Parser plugins
   */

  micromatch.use(nanomatch.parsers);
  micromatch.use(brackets.parsers);
  micromatch.use(extglob.parsers);

  /**
   * Micromatch parsers
   */

  micromatch.parser
    .capture('star', /^(?:\*(?![(])|[*]{3,})/)
    .set('text', function() {
      var pos = this.position();
      var m = this.match(/^((?!(?:([!@*?+])?\(|[*.+?^\/\(\[\])\\]|\[\]\])).)*/);
      if (!m || !m[0]) return;

      return pos({
        type: 'text',
        val: m[0]
      });
    })
};
