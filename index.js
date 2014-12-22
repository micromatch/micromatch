/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var braces = require('braces');

var dotfile = '[^\\/]*?';
var matchBase = '[\\s\\S]+';

var tokens = [
  ['\\\\', {re: /\\{2}/g, to: '\\/'}],
  ['/',    {re: /\//g, to: '\\/'}],
  ['.',    {re: /[.]/g,  to: '\\.'}],
  ['?',    {re: /\?/g, to: '.'}],
  ['**',   {re: /[*]{2}/g,  to: '[\\s\\S]+'}],
  ['*',    {re: /[*]/g,  to: '[^\\/]*?', matchBase: matchBase, dot: dotfile}],
];

module.exports.makeRe = function makeRe(str, options) {
  var opts = options || {};
  var len = tokens.length;
  var i = 0;
  var f = '';

  if (/\{/.test(str)) {
    str = braces(str).join('|');
  }

  while (i < len) {
    var group = tokens[i++];
    var token = group[0];
    var re = group[1].re;
    var to = group[1].to;

    for (var key in opts) {
      if (group[1].hasOwnProperty(key)) {
        to += group[1][key];
      }
    }

    str = str.replace(re, to);
  }

  if (opts.nocase) f += 'i';

  var res = /^!/.test(str)
    ? '^(?!((?!\\.)' + str.slice(1) + ')$)'
    : '^' + str + '$';

  return new RegExp(res, f);
};
