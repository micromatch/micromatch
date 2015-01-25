var path = require('path');
var should = require('should');
var argv = require('minimist')(process.argv.slice(2));
var mm = require('../..');

if ('minimatch' in argv) {
  mm = require('minimatch');
}

it('minimatch tests:', function () {
  // http://www.bashcookbook.com/bashinfo/source/bash-1.14.7/tests/glob-test
  mm.makeRe('a*').should.equal(/^(?:(?=.)a[^/]*?)$/);
  mm.makeRe('X*').should.equal(/^(?:(?=.)X[^/]*?)$/);
  mm.makeRe('X*').should.equal(/^(?:(?=.)X[^/]*?)$/);
  mm.makeRe('\\*').should.equal(/^(?:\\*)$/);
  mm.makeRe('\\**').should.equal(/^(?:(?=.)\\*[^/]*?)$/);
  mm.makeRe('\\*\\*').should.equal(/^(?:\\*\\*)$/);
  mm.makeRe('b*/').should.equal(/^(?:(?=.)b[^/]*?\\/)$/);
  mm.makeRe('c*').should.equal(/^(?:(?=.)c[^/]*?)$/);
  mm.makeRe('**').should.equal(/^(?:(?:(?!(?:\\/|^)\\.).)*?)$/);
  mm.makeRe('\\.\\./*/').should.equal(/^(?:\\.\\.\\/(?!\\.)(?=.)[^/]*?\\/)$/);
  mm.makeRe('s/\\..*//').should.equal(/^(?:s\\/(?=.)\\.\\.[^/]*?\\/)$/);

  // legendary larry crashes bashes
  mm.makeRe('/^root:/{s/^[^:]*:[^:]*:\\([^:]*).*$/\\1/').should.equal(/^(?:\\/\\^root:\\/\\{s\\/(?=.)\\^[^:][^/]*?:[^:][^/]*?:\\([^:]\\)[^/]*?\\.[^/]*?\\$\\/1\\/)$/);
  mm.makeRe('/^root:/{s/^[^:]*:[^:]*:\\([^:]*).*$/\\1/').should.equal(/^(?:\\/\\^root:\\/\\{s\\/(?=.)\\^[^:][^/]*?:[^:][^/]*?:\\([^:]\\)[^/]*?\\.[^/]*?\\$\\/\u0001\\/)$/);

  // character classes
  mm.makeRe('[a-c]b*').should.equal(/^(?:(?!\\.)(?=.)[a-c]b[^/]*?)$/);
  mm.makeRe('[a-y]*[^c]').should.equal(/^(?:(?!\\.)(?=.)[a-y][^/]*?[^c])$/);
  mm.makeRe('a*[^c]').should.equal(/^(?:(?=.)a[^/]*?[^c])$/);
  mm.makeRe('a[X-]b').should.equal(/^(?:(?=.)a[X-]b)$/);
  mm.makeRe('[^a-c]*').should.equal(/^(?:(?!\\.)(?=.)[^a-c][^/]*?)$/);
  mm.makeRe('a\\*b/*').should.equal(/^(?:a\\*b\\/(?!\\.)(?=.)[^/]*?)$/);
  mm.makeRe('a\\*?/*').should.equal(/^(?:(?=.)a\\*[^/]\\/(?!\\.)(?=.)[^/]*?)$/);
  mm.makeRe('*\\\\!*').should.equal(/^(?:(?!\\.)(?=.)[^/]*?\\\\\\![^/]*?)$/);
  mm.makeRe('*\\!*').should.equal(/^(?:(?!\\.)(?=.)[^/]*?\\![^/]*?)$/);
  mm.makeRe('*.\\*').should.equal(/^(?:(?!\\.)(?=.)[^/]*?\\.\\*)$/);
  mm.makeRe('a[b]c').should.equal(/^(?:(?=.)a[b]c)$/);
  mm.makeRe('a[\\b]c').should.equal(/^(?:(?=.)a[b]c)$/);
  mm.makeRe('a?c').should.equal(/^(?:(?=.)a[^/]c)$/);
  mm.makeRe('a\\*c').should.equal(/^(?:a\\*c)$/);
  mm.makeRe('').should.equal('false');

  // http://www.opensource.apple.com/source/bash/bash-23/bash/tests/glob-test
  mm.makeRe('*/man*/bash.*').should.equal(/^(?:(?!\\.)(?=.)[^/]*?\\/(?=.)man[^/]*?\\/(?=.)bash\\.[^/]*?)$/);
  mm.makeRe('man/man1/bash.1').should.equal(/^(?:man\\/man1\\/bash\\.1)$/);
  mm.makeRe('a***c').should.equal(/^(?:(?=.)a[^/]*?[^/]*?[^/]*?c)$/);
  mm.makeRe('a*****?c').should.equal(/^(?:(?=.)a[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]c)$/);
  mm.makeRe('?*****??').should.equal(/^(?:(?!\\.)(?=.)[^/][^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/][^/])$/);
  mm.makeRe('*****??').should.equal(/^(?:(?!\\.)(?=.)[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/][^/])$/);
  mm.makeRe('?*****?c').should.equal(/^(?:(?!\\.)(?=.)[^/][^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]c)$/);
  mm.makeRe('?***?****c').should.equal(/^(?:(?!\\.)(?=.)[^/][^/]*?[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/]*?[^/]*?c)$/);
  mm.makeRe('?***?****?').should.equal(/^(?:(?!\\.)(?=.)[^/][^/]*?[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/]*?[^/]*?[^/])$/);
  mm.makeRe('?***?****').should.equal(/^(?:(?!\\.)(?=.)[^/][^/]*?[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/]*?[^/]*?)$/);
  mm.makeRe('*******c').should.equal(/^(?:(?!\\.)(?=.)[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?c)$/);
  mm.makeRe('*******?').should.equal(/^(?:(?!\\.)(?=.)[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/])$/);
  mm.makeRe('a*cd**?**??k').should.equal(/^(?:(?=.)a[^/]*?cd[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/][^/]k)$/);
  mm.makeRe('a**?**cd**?**??k').should.equal(/^(?:(?=.)a[^/]*?[^/]*?[^/][^/]*?[^/]*?cd[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/][^/]k)$/);
  mm.makeRe('a**?**cd**?**??k***').should.equal(/^(?:(?=.)a[^/]*?[^/]*?[^/][^/]*?[^/]*?cd[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/][^/]k[^/]*?[^/]*?[^/]*?)$/);
  mm.makeRe('a**?**cd**?**??***k').should.equal(/^(?:(?=.)a[^/]*?[^/]*?[^/][^/]*?[^/]*?cd[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/][^/][^/]*?[^/]*?[^/]*?k)$/);
  mm.makeRe('a**?**cd**?**??***k**').should.equal(/^(?:(?=.)a[^/]*?[^/]*?[^/][^/]*?[^/]*?cd[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/][^/][^/]*?[^/]*?[^/]*?k[^/]*?[^/]*?)$/);
  mm.makeRe('a****c**?**??*****').should.equal(/^(?:(?=.)a[^/]*?[^/]*?[^/]*?[^/]*?c[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/][^/][^/]*?[^/]*?[^/]*?[^/]*?[^/]*?)$/);
  mm.makeRe('[-abc]').should.equal(/^(?:(?!\\.)(?=.)[-abc])$/);
  mm.makeRe('[abc-]').should.equal(/^(?:(?!\\.)(?=.)[abc-])$/);
  mm.makeRe('\\').should.equal(/^(?:\\\\)$/);
  mm.makeRe('[\\\\]').should.equal(/^(?:(?!\\.)(?=.)[\\\\])$/);
  mm.makeRe('[[]').should.equal(/^(?:(?!\\.)(?=.)[\\[])$/);
  mm.makeRe('[').should.equal(/^(?:\\[)$/);
  mm.makeRe('[*').should.equal(/^(?:(?=.)\\[(?!\\.)(?=.)[^/]*?)$/);

  // a right bracket shall lose its special meaning and
  // represent itself in a bracket expression if it occurs
  // first in the list.  -- POSIX.2 2.8.3.2
  mm.makeRe('[]]').should.equal(/^(?:(?!\\.)(?=.)[\\]])$/);
  mm.makeRe('[]-]').should.equal(/^(?:(?!\\.)(?=.)[\\]-])$/);
  mm.makeRe('[a-z]').should.equal(/^(?:(?!\\.)(?=.)[a-z])$/);
  mm.makeRe('??**********?****?').should.equal(/^(?:(?!\\.)(?=.)[^/][^/][^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/]*?[^/]*?[^/])$/);
  mm.makeRe('??**********?****c').should.equal(/^(?:(?!\\.)(?=.)[^/][^/][^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/]*?[^/]*?c)$/);
  mm.makeRe('?************c****?****').should.equal(/^(?:(?!\\.)(?=.)[^/][^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?c[^/]*?[^/]*?[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/]*?[^/]*?)$/);
  mm.makeRe('*c*?**').should.equal(/^(?:(?!\\.)(?=.)[^/]*?c[^/]*?[^/][^/]*?[^/]*?)$/);
  mm.makeRe('a*****c*?**').should.equal(/^(?:(?=.)a[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?c[^/]*?[^/][^/]*?[^/]*?)$/);
  mm.makeRe('a********???*******').should.equal(/^(?:(?=.)a[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/][^/][^/][^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?)$/);
  mm.makeRe('[]').should.equal(/^(?:\\[\\])$/);
  mm.makeRe('[abc').should.equal(/^(?:\\[abc)$/);

  // nocase tests
  mm.makeRe('XYZ').should.equal(/^(?:(?=.)XYZ)$/i);
  mm.makeRe('ab*').should.equal(/^(?:(?=.)ab[^/]*?)$/i);
  mm.makeRe('[ia]?[ck]').should.equal(/^(?:(?!\\.)(?=.)[ia][^/][ck])$/i);

  // onestar/twostar
  mm.makeRe('{/*,*}').should.equal(/^(?:\\/(?!\\.)(?=.)[^/]*?|(?!\\.)(?=.)[^/]*?)$/);
  mm.makeRe('{/?,*}').should.equal(/^(?:\\/(?!\\.)(?=.)[^/]|(?!\\.)(?=.)[^/]*?)$/);

  // dots should not match unless requested
  mm.makeRe('**').should.equal(/^(?:(?:(?!(?:\\/|^)\\.).)*?)$/);
  mm.makeRe('a/*/b').should.equal(/^(?:a\\/(?!(?:^|\\/)\\.{1,2}(?:$|\\/))(?=.)[^/]*?\\/b)$/);
  mm.makeRe('a/.*/b').should.equal(/^(?:a\\/(?=.)\\.[^/]*?\\/b)$/);
  mm.makeRe('a/*/b').should.equal(/^(?:a\\/(?!\\.)(?=.)[^/]*?\\/b)$/);
  mm.makeRe('a/.*/b').should.equal(/^(?:a\\/(?=.)\\.[^/]*?\\/b)$/);
  mm.makeRe('**').should.equal(/^(?:(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?)$/);

  // paren sets cannot contain slashes
  mm.makeRe('*(a/b)').should.equal(/^(?:(?!\\.)(?=.)[^/]*?\\(a\\/b\\))$/);
  mm.makeRe('*(a|{b),c)}').should.equal(/^(?:(?!\\.)(?=.)(?:a|b)*|(?!\\.)(?=.)(?:a|c)*)$/);
  mm.makeRe('[!a*').should.equal(/^(?:(?=.)\\[(?=.)\\!a[^/]*?)$/);
  mm.makeRe('[#a*').should.equal(/^(?:(?=.)\\[(?=.)#a[^/]*?)$/);
  mm.makeRe('+(a|*\\|c\\\\|d\\\\\\|e\\\\\\\\|f\\\\\\\\\\|g').should.equal(/^(?:(?=.)\\+\\(a\\|[^/]*?\\|c\\\\\\\\\\|d\\\\\\\\\\|e\\\\\\\\\\\\\\\\\\|f\\\\\\\\\\\\\\\\\\|g)$/);
  mm.makeRe('*(a|{b,c})').should.equal(/^(?:(?!\\.)(?=.)(?:a|b)*|(?!\\.)(?=.)(?:a|c)*)$/);
  mm.makeRe('{a,*(b|c,d)}').should.equal(/^(?:a|(?!\\.)(?=.)[^/]*?\\(b\\|c|d\\))$/);
  mm.makeRe('{a,*(b|{c,d})}').should.equal(/^(?:a|(?!\\.)(?=.)(?:b|c)*|(?!\\.)(?=.)(?:b|d)*)$/);
  mm.makeRe('*(a|{b|c,c})').should.equal(/^(?:(?!\\.)(?=.)(?:a|b|c)*|(?!\\.)(?=.)(?:a|c)*)$/);
  mm.makeRe('*(a|{b|c,c})').should.equal(/^(?:(?!\\.)(?=.)[^\/]*?\\(a\\|b\\|c\\)|(?!\\.)(?=.)[^/]*?\\(a\\|c\\))$/);
  mm.makeRe('a?b').should.equal(/^(?:(?=.)a[^/]b)$/);
  mm.makeRe('#*').should.equal(/^(?:(?=.)#[^/]*?)$/);

  // negation tests
  mm.makeRe('!a*').should.equal(/^(?!^(?:(?=.)a[^/]*?)$).*$/);
  mm.makeRe('!a*').should.equal(/^(?:(?=.)\\!a[^/]*?)$/);
  mm.makeRe('!!a*').should.equal(/^(?:(?=.)a[^/]*?)$/);
  mm.makeRe('!\\!a*').should.equal(/^(?!^(?:(?=.)\\!a[^/]*?)$).*$/);
  mm.makeRe('*.!(js)').should.equal(/^(?:(?!\\.)(?=.)[^/]*?\\.(?:(?!js)[^/]*?))$/);
  mm.makeRe('**/.x/**').should.equal(/^(?:(?:(?!(?:\\/|^)\\.).)*?\\/\\.x\\/(?:(?!(?:\\/|^)\\.).)*?)$/);
});
