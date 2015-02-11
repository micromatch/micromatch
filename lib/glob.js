'use strict';

var brackets = require('expand-brackets');
var extglob = require('extglob');
var braces = require('braces');
var parse = require('parse-glob');
var chars = require('./chars');

module.exports = Glob;

function Glob(pattern, options) {
  this.options = options || {};
  this.pattern = pattern;
  this.history = [];
  this.init(pattern);
}

Glob.prototype.init = function(pattern) {
  this.orig = pattern;
  this.options.makeRe = true;
  this.negated = this.isNegated();
  this.tokens = {};

  this.or('extglob', 'noextglob');
  this.or('braces', 'nobraces');
  this.or('dot', 'dotfiles');
};

Glob.prototype.option = function(key, value) {
  if (arguments.length === 1 && typeof key === 'string') {
    return this.options[key];
  }
  this.options[key] = value;
  return this;
};

Glob.prototype.or = function(a, b) {
  if (b.indexOf('no') === 0) {
    this.options[a] = this.options[a] || !this.options[b];
  } else {
    this.options[a] = this.options[a] || this.options[b];
  }
  return this;
};

Glob.prototype.track = function(msg, args) {
  if (this.options.track) {
    this.history.push({
      msg: msg,
      pattern: this.pattern,
      args: args || []
    });
  }
};

Glob.prototype.has = function(pattern, ch) {
  return pattern.indexOf(ch) !== -1;
};

Glob.prototype.isNegated = function() {
  if (this.pattern.charCodeAt(0) === 33 /* '!' */) {
    this.pattern = this.pattern.slice(1);
    return true;
  }
  return false;
};

Glob.prototype.hasBraces = function(pattern) {
  return (pattern || this.pattern).indexOf('{') !== -1;
};

Glob.prototype.hasBrackets = function(pattern) {
  return (pattern || this.pattern).indexOf('[:') !== -1;
};

/**
 * Expand braces in the given glob pattern.
 *
 * We only need to use the [braces] lib when
 * patterns are nested.
 *
 * @param  {String} `glob`
 * @return {String}
 */

Glob.prototype.braces = function() {
  if (this.hasBraces() && this.options.nobraces !== true) {
    var a = this.pattern.match(/[\{\(\[]/g);
    var b = this.pattern.match(/[\}\)\]]/g);
    if (a && b && (a.length !== b.length)) {
      this.options.makeRe = false;
    }
    var expanded = braces(this.pattern, this.options);
    this.pattern = expanded.join('|');
  }
};

Glob.prototype.brackets = function() {
  if (this.hasBrackets() && this.options.nobrackets !== true) {
    this.pattern = brackets(this.pattern);
  }
};

Glob.prototype.extglob = function() {
  if (this.hasExtglob() && this.options.noextglob !== true) {
    this.pattern = extglob(this.pattern);
  }
};

Glob.prototype.parse = function(pattern) {
  this.tokens = parse(pattern || this.pattern);
  return this.tokens;
};

Glob.prototype.repl = function(a, b) {
  this.track('before repl: ');
  if (a && b && typeof a === 'string') {
    this.pattern = this.pattern.split(a).join(b);
  } else {
    this.pattern = this.pattern.replace(a, b);
  }
  this.track('after repl: ');
};

Glob.prototype.escape = function(str) {
  this.track('before escape: ');

  var re = /["\\](['"]?[^"'\\]['"]?)/g;
  this.pattern = str.replace(re, function($0, $1) {
    var o = chars.ESC;
    var ch = o && o[$1];
    if (ch) {
      return ch;
    }
    if (/[a-z]/i.test($0)) {
      return $0.split('\\').join('');
    }
    return $0;
  });

  this.track('after escape: ');
};

Glob.prototype.unescape = function(str) {
  var re = /__([A-Z]+)_([A-Z]+)__/g;
  this.pattern = str.replace(re, function($0, $1) {
    return chars[$1][$0];
  });
};
