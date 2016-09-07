'use strict';

var assert = require('assert');
var argv = require('yargs-parser')(process.argv.slice(2));
var matcher = argv.mm ? require('minimatch') : require('..');

function match(arr, pattern, expected, options) {
  var actual = matcher.match(arr, pattern, options);
  assert.deepEqual(actual.sort(), expected.sort());
}

describe('qmarks and stars', function() {
  it('should match with qmarks in globs:', function() {
    match(['abc', 'abb', 'acc'], 'a***c', ['abc', 'acc']);
    match(['abc'], 'a*****?c', ['abc']);
    match(['abc', 'zzz', 'bbb'], '?*****??', ['abc', 'zzz', 'bbb']);
    match(['abc', 'zzz', 'bbb'], '*****??', ['abc', 'zzz', 'bbb']);
    match(['abc', 'abb', 'zzz'], '?*****?c', ['abc']);
    match(['abc', 'bbb', 'zzz'], '?***?****c', ['abc']);
    match(['abc', 'bbb', 'zzz'], '?***?****?', ['abc', 'bbb', 'zzz']);
    match(['abc'], '?***?****', ['abc']);
    match(['abc'], '*******c', ['abc']);
    match(['abc'], '*******?', ['abc']);
    match(['abcdecdhjk'], 'a*cd**?**??k', ['abcdecdhjk']);
    match(['abcdecdhjk'], 'a**?**cd**?**??k', ['abcdecdhjk']);
    match(['abcdecdhjk'], 'a**?**cd**?**??k***', ['abcdecdhjk']);
    match(['abcdecdhjk'], 'a**?**cd**?**??***k', ['abcdecdhjk']);
    match(['abcdecdhjk'], 'a**?**cd**?**??***k**', ['abcdecdhjk']);
    match(['abcdecdhjk'], 'a****c**?**??*****', ['abcdecdhjk']);
  });
});
