'use strict';

var extglob = require('extglob');
var nanomatch = require('nanomatch');
var regexNot = require('regex-not');
var toRegex = require('to-regex');

/**
 * Characters to use in negation regex (we want to "not" match
 * characters that are matched by other parsers)
 */

var cached;
var TEXT = '([!@*?+]?\\(|\\)|\\[:?(?=.*?:?\\])|:?\\]|[*+?!^$.\\\\/])+';
var not = textRegex(TEXT);

module.exports = function(micromatch) {
  var parsers = micromatch.parser.parsers;

  micromatch.use(nanomatch.parsers);
  var escape = parsers.escape;
  var slash = parsers.slash;
  var qmark = parsers.qmark;
  var plus = parsers.plus;
  var star = parsers.star;
  var dot = parsers.dot;

  micromatch.use(extglob.parsers);
  micromatch.parser
    .use(function() {
      // override "notRegex" used in nanomatch
      this.notRegex = /^\!+(?!\()/;
    })
    .capture('escape', escape)
    .capture('slash', slash)
    .capture('qmark', qmark)
    .capture('star', star)
    .capture('plus', plus)
    .capture('dot', dot)

   /**
     * Override `text` parser
     */

    .capture('text', function() {
      if (this.isInside('bracket')) return;
      var pos = this.position();
      var m = this.match(not);
      if (!m || !m[0]) return;

      // escape brackets and regex boundary characters
      var val = m[0].replace(/([[\]^$])/g, '\\$1');
      return pos({
        type: 'text',
        val: val
      });
    });
};

/**
 * Create text regex
 */

function textRegex(pattern) {
  if (cached) return cached;
  var opts = {contains: true, strictClose: false};
  var not = regexNot.create(pattern, opts);
  var re = toRegex('(?:[\\^]|\\\\|' + not + ')', {strictClose: false});
  return (cached = re);
}
