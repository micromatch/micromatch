'use strict';

var path = require('path');
var write = require('write');
var braces = require('braces');

function writeFixture(dest, glob, bracePattern) {
  dest = path.join(__dirname, 'fixtures', dest);
  var fixture = braces(bracePattern);
  var str = 'module.exports = ' + (JSON.stringify([fixture, glob], null, 2)) + ';';
  // console.log(str)
  write.sync(dest, str);
}

writeFixture('short.js', '**/*.txt', 'a/{b,{c,d},e/d}.{js,md,txt}');
writeFixture('basename.js', '*a{0..3}.txt', '{a..z}{0..10}.{js,md,txt}');
writeFixture('shallow.js', '**/*.js', 'a/{b,{c,d}{a..j},e/d}.{js,md}');
writeFixture('mid.js', '**/*.{js,md}', 'a/{b,{c,d}{a..j},e/d}/f/g/h/i/j/klmnop/foo.{js,md,txt,hbs}');
writeFixture('deep.js', '**/*.{js,md}', 'a/{b,{{c,d}{a..j},e/d}/f/g}/foo/bar-baz-quux/{h,i,j}/fez/bang/klmnop/foo{a..c}{1..10}.{js,md,txt,hbs}');
writeFixture('long.js', '**/*.{js,md}', 'a/{b,{{c,d}{a..j},e/d}/f/g}/{h,i,j}/klmnop/foo{1..10}.{js,md,txt,hbs}');
