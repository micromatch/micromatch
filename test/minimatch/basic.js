var path = require('path');
var should = require('should');
var argv = require('minimist')(process.argv.slice(2));
var mm = require('../..');

if ('minimatch' in argv) {
  mm = require('minimatch');
}

it('minimatch tests:', function () {
  // http://www.bashcookbook.com/bashinfo/source/bash-1.14.7/tests/glob-test
  mm.makeRe('a*').should.eql(/^(?:(?=.)a[^/]*?)$/);
  mm.makeRe('X*', {nonull: true}).should.eql(/^(?:(?=.)X[^/]*?)$/);
  mm.makeRe('X*').should.eql(/^(?:(?=.)X[^/]*?)$/);
  mm.makeRe('\\*', {nonull: true}).should.eql(/^(?:\*)$/);
  mm.makeRe('\\**', {nonull: true}).should.eql(/^(?:(?=.)\*[^/]*?)$/);
  mm.makeRe('\\*\\*', {nonull: true}).should.eql(/^(?:\*\*)$/);
  mm.makeRe('b*/').should.eql(/^(?:(?=.)b[^/]*?\/)$/);
  mm.makeRe('c*').should.eql(/^(?:(?=.)c[^/]*?)$/);
  mm.makeRe('**').should.eql(/^(?:(?:(?!(?:\/|^)\.).)*?)$/);
  mm.makeRe('\\.\\./*/').should.eql(/^(?:\.\.\/(?!\.)(?=.)[^/]*?\/)$/);
  mm.makeRe('s/\\..*//').should.eql(/^(?:s\/(?=.)\.\.[^/]*?\/)$/);

  // legendary larry crashes bashes
  mm.makeRe('/^root:/{s/^[^:]*:[^:]*:([^:]*).*$/\\1/').should.eql(/^(?:\/\^root:\/\{s\/(?=.)\^[^:][^/]*?:[^:][^/]*?:\([^:]\)[^/]*?\.[^/]*?\$\/1\/)$/);
  mm.makeRe('/^root:/{s/^[^:]*:[^:]*:([^:]*).*$/\\1/').should.eql(/^(?:\/\^root:\/\{s\/(?=.)\^[^:][^/]*?:[^:][^/]*?:\([^:]\)[^/]*?\.[^/]*?\$\/1\/)$/);

  // character classes
  mm.makeRe('[a-c]b*').should.eql(/^(?:(?!\.)(?=.)[a-c]b[^/]*?)$/);
  mm.makeRe('[a-y]*[^c]').should.eql(/^(?:(?!\.)(?=.)[a-y][^/]*?[^c])$/);
  mm.makeRe('a*[^c]').should.eql(/^(?:(?=.)a[^/]*?[^c])$/);
  mm.makeRe('a[X-]b').should.eql(/^(?:(?=.)a[X-]b)$/);
  mm.makeRe('[^a-c]*').should.eql(/^(?:(?!\.)(?=.)[^a-c][^/]*?)$/);
  mm.makeRe('a\\*b/*').should.eql(/^(?:a\*b\/(?!\.)(?=.)[^/]*?)$/);
  mm.makeRe('a\\*?/*').should.eql(/^(?:(?=.)a\*[^/]\/(?!\.)(?=.)[^/]*?)$/);
  mm.makeRe('*\\\\!*').should.eql(/^(?:(?!\.)(?=.)[^/]*?\\\![^/]*?)$/);
  mm.makeRe('*\\!*').should.eql(/^(?:(?!\.)(?=.)[^/]*?\![^/]*?)$/);
  mm.makeRe('*.\\*').should.eql(/^(?:(?!\.)(?=.)[^/]*?\.\*)$/);
  mm.makeRe('a[b]c').should.eql(/^(?:(?=.)a[b]c)$/);
  mm.makeRe('a[\\b]c').should.eql(/^(?:(?=.)a[b]c)$/);
  mm.makeRe('a?c').should.eql(/^(?:(?=.)a[^/]c)$/);
  mm.makeRe('a\\*c').should.eql(/^(?:a\*c)$/);
  mm.makeRe('').should.be.false;

  // http://www.opensource.apple.com/source/bash/bash-23/bash/tests/glob-test
  mm.makeRe('*/man*/bash.*').should.eql(/^(?:(?!\.)(?=.)[^/]*?\/(?=.)man[^/]*?\/(?=.)bash\.[^/]*?)$/);
  mm.makeRe('man/man1/bash.1').should.eql(/^(?:man\/man1\/bash\.1)$/);
  mm.makeRe('a***c').should.eql(/^(?:(?=.)a[^/]*?[^/]*?[^/]*?c)$/);
  mm.makeRe('a*****?c').should.eql(/^(?:(?=.)a[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]c)$/);
  mm.makeRe('?*****??').should.eql(/^(?:(?!\.)(?=.)[^/][^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/][^/])$/);
  mm.makeRe('*****??').should.eql(/^(?:(?!\.)(?=.)[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/][^/])$/);
  mm.makeRe('?*****?c').should.eql(/^(?:(?!\.)(?=.)[^/][^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]c)$/);
  mm.makeRe('?***?****c').should.eql(/^(?:(?!\.)(?=.)[^/][^/]*?[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/]*?[^/]*?c)$/);
  mm.makeRe('?***?****?').should.eql(/^(?:(?!\.)(?=.)[^/][^/]*?[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/]*?[^/]*?[^/])$/);
  mm.makeRe('?***?****').should.eql(/^(?:(?!\.)(?=.)[^/][^/]*?[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/]*?[^/]*?)$/);
  mm.makeRe('*******c').should.eql(/^(?:(?!\.)(?=.)[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?c)$/);
  mm.makeRe('*******?').should.eql(/^(?:(?!\.)(?=.)[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/])$/);
  mm.makeRe('a*cd**?**??k').should.eql(/^(?:(?=.)a[^/]*?cd[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/][^/]k)$/);
  mm.makeRe('a**?**cd**?**??k').should.eql(/^(?:(?=.)a[^/]*?[^/]*?[^/][^/]*?[^/]*?cd[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/][^/]k)$/);
  mm.makeRe('a**?**cd**?**??k***').should.eql(/^(?:(?=.)a[^/]*?[^/]*?[^/][^/]*?[^/]*?cd[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/][^/]k[^/]*?[^/]*?[^/]*?)$/);
  mm.makeRe('a**?**cd**?**??***k').should.eql(/^(?:(?=.)a[^/]*?[^/]*?[^/][^/]*?[^/]*?cd[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/][^/][^/]*?[^/]*?[^/]*?k)$/);
  mm.makeRe('a**?**cd**?**??***k**').should.eql(/^(?:(?=.)a[^/]*?[^/]*?[^/][^/]*?[^/]*?cd[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/][^/][^/]*?[^/]*?[^/]*?k[^/]*?[^/]*?)$/);
  mm.makeRe('a****c**?**??*****').should.eql(/^(?:(?=.)a[^/]*?[^/]*?[^/]*?[^/]*?c[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/][^/][^/]*?[^/]*?[^/]*?[^/]*?[^/]*?)$/);
  mm.makeRe('[-abc]').should.eql(/^(?:(?!\.)(?=.)[-abc])$/);
  mm.makeRe('[abc-]').should.eql(/^(?:(?!\.)(?=.)[abc-])$/);
  mm.makeRe('\\').should.eql(/^(?:\\)$/);
  mm.makeRe('[\\\\]').should.eql(/^(?:(?!\.)(?=.)[\\])$/);
  mm.makeRe('[[]').should.eql(/^(?:(?!\.)(?=.)[\[])$/);
  mm.makeRe('[').should.eql(/^(?:\[)$/);
  mm.makeRe('[*').should.eql(/^(?:(?=.)\[(?!\.)(?=.)[^/]*?)$/);

  // a right bracket shall lose its special meaning and
  // represent itself in a bracket expression if it occurs
  // first in the list.  -- POSIX.2 2.8.3.2
  mm.makeRe('[]]').should.eql(/^(?:(?!\.)(?=.)[\]])$/);
  mm.makeRe('[]-]').should.eql(/^(?:(?!\.)(?=.)[\]-])$/);
  mm.makeRe('[a-z]').should.eql(/^(?:(?!\.)(?=.)[a-z])$/);
  mm.makeRe('??**********?****?').should.eql(/^(?:(?!\.)(?=.)[^/][^/][^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/]*?[^/]*?[^/])$/);
  mm.makeRe('??**********?****c').should.eql(/^(?:(?!\.)(?=.)[^/][^/][^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/]*?[^/]*?c)$/);
  mm.makeRe('?************c****?****').should.eql(/^(?:(?!\.)(?=.)[^/][^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?c[^/]*?[^/]*?[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/]*?[^/]*?)$/);
  mm.makeRe('*c*?**').should.eql(/^(?:(?!\.)(?=.)[^/]*?c[^/]*?[^/][^/]*?[^/]*?)$/);
  mm.makeRe('a*****c*?**').should.eql(/^(?:(?=.)a[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?c[^/]*?[^/][^/]*?[^/]*?)$/);
  mm.makeRe('a********???*******').should.eql(/^(?:(?=.)a[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/][^/][^/][^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?)$/);
  mm.makeRe('[]').should.eql(/^(?:\[\])$/);
  mm.makeRe('[abc').should.eql(/^(?:\[abc)$/);

  // nocase tests
  mm.makeRe('XYZ', { nocase: true, null: true }).should.eql(/^(?:(?=.)XYZ)$/i);
  mm.makeRe('ab*').should.eql(/^(?:(?=.)ab[^/]*?)$/);
  mm.makeRe('ab*', { nocase: true, null: true }).should.eql(/^(?:(?=.)ab[^/]*?)$/i);
  mm.makeRe('[ia]?[ck]').should.eql(/^(?:(?!\.)(?=.)[ia][^/][ck])$/);

  // onestar/twostar
  mm.makeRe('{/*,*}').should.eql(/^(?:\/(?!\.)(?=.)[^/]*?|(?!\.)(?=.)[^/]*?)$/);
  mm.makeRe('{/?,*}').should.eql(/^(?:\/(?!\.)(?=.)[^/]|(?!\.)(?=.)[^/]*?)$/);

  // dots should not match unless requested
  mm.makeRe('**').should.eql(/^(?:(?:(?!(?:\/|^)\.).)*?)$/);
  mm.makeRe('a/*/b').should.eql(/^(?:a\/(?!\.)(?=.)[^/]*?\/b)$/);
  mm.makeRe('a/*/b', {dot: true}).should.eql(/^(?:a\/(?!(?:^|\/)\.{1,2}(?:$|\/))(?=.)[^/]*?\/b)$/);
  mm.makeRe('a/.*/b').should.eql(/^(?:a\/(?=.)\.[^/]*?\/b)$/);
  mm.makeRe('a/.*/b', {dot: true}).should.eql(/^(?:a\/(?=.)\.[^/]*?\/b)$/);
  mm.makeRe('a/*/b').should.eql(/^(?:a\/(?!\.)(?=.)[^/]*?\/b)$/);
  mm.makeRe('a/*/b', {dot: true}).should.eql(/^(?:a\/(?!(?:^|\/)\.{1,2}(?:$|\/))(?=.)[^/]*?\/b)$/);
  mm.makeRe('a/.*/b').should.eql(/^(?:a\/(?=.)\.[^/]*?\/b)$/);
  mm.makeRe('a/.*/b', {dot: true}).should.eql(/^(?:a\/(?=.)\.[^/]*?\/b)$/);
  mm.makeRe('**').should.eql(/^(?:(?:(?!(?:\/|^)\.).)*?)$/);
  mm.makeRe('**', {dot: true}).should.eql(/^(?:(?:(?!(?:\/|^)(?:\.{1,2})($|\/)).)*?)$/);

  // paren sets cannot contain slashes
  mm.makeRe('*(a/b)').should.eql(/^(?:(?!\.)(?=.)[^/]*?\(a\/b\))$/);
  mm.makeRe('*(a|{b),c)}').should.eql(/^(?:(?!\.)(?=.)(?:a|b)*|(?!\.)(?=.)(?:a|c)*)$/);
  mm.makeRe('[!a*').should.eql(/^(?:(?=.)\[(?=.)\!a[^/]*?)$/);
  mm.makeRe('[#a*').should.eql(/^(?:(?=.)\[(?=.)#a[^/]*?)$/);
  mm.makeRe('+(a|*\\|c\\\\|d\\\\\\|e\\\\\\\\|f\\\\\\\\\\|g').should.eql(/^(?:(?=.)\+\(a\|[^/]*?\|c\\\\\|d\\\\\|e\\\\\\\\\|f\\\\\\\\\|g)$/);
  mm.makeRe('*(a|{b,c})').should.eql(/^(?:(?!\.)(?=.)(?:a|b)*|(?!\.)(?=.)(?:a|c)*)$/);
  mm.makeRe('{a,*(b|c,d)}').should.eql(/^(?:a|(?!\.)(?=.)[^/]*?\(b\|c|d\))$/);
  mm.makeRe('{a,*(b|{c,d})}').should.eql(/^(?:a|(?!\.)(?=.)(?:b|c)*|(?!\.)(?=.)(?:b|d)*)$/);
  mm.makeRe('*(a|{b|c,c})').should.eql(/^(?:(?!\.)(?=.)(?:a|b|c)*|(?!\.)(?=.)(?:a|c)*)$/);
  mm.makeRe('*(a|{b|c,c})').should.eql(/^(?:(?!\.)(?=.)(?:a|b|c)*|(?!\.)(?=.)(?:a|c)*)$/);
  mm.makeRe('a?b').should.eql(/^(?:(?=.)a[^/]b)$/);
  mm.makeRe('a?b', {nonull: true}).should.eql(/^(?:(?=.)a[^/]b)$/);

  // negation tests
  mm.makeRe('!a*').should.eql(/^(?!^(?:(?=.)a[^/]*?)$).*$/);
  mm.makeRe('!a*', {nonegate: true}).should.eql(/^(?:(?=.)\!a[^/]*?)$/);
  mm.makeRe('!!a*').should.eql(/^(?:(?=.)a[^/]*?)$/);
  mm.makeRe('!\\!a*').should.eql(/^(?!^(?:(?=.)\!a[^/]*?)$).*$/);
  mm.makeRe('*.!(js)').should.eql(/^(?:(?!\.)(?=.)[^/]*?\.(?:(?!js)[^/]*?))$/);
  mm.makeRe('**/.x/**').should.eql(/^(?:(?:(?!(?:\/|^)\.).)*?\/\.x\/(?:(?!(?:\/|^)\.).)*?)$/);
});