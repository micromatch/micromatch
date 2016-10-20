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
var patterns = [
  '[!@*?+]?\\(',
  '\\)',
  '\\[:?(?=.*?:?\\])',
  ':?\\]',
  '[*+?!^$.\\\\/]'
];

var NOT_REGEX = '(' + patterns.join('|') + ')+';
var not = textRegex(NOT_REGEX);

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
      this.notRegex = /^\!+(?!\()/;
    })
    .capture('escape', escape)
    .capture('slash', slash)
    .capture('qmark', qmark)
    .capture('star', star)
    .capture('plus', plus)
    .capture('dot', dot)

   /**
     * Text
     */

    .capture('text', function() {
      if (this.isInside('bracket')) return;
      var pos = this.position();
      var m = this.match(not);
      if (!m || !m[0]) return;

      var val = m[0].replace(/([\[\]^$])/g, '\\$1');
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
  var re = toRegex('^(?:[\\^]|\\\\|' + not + ')', opts);
  return (cached = re);
}
