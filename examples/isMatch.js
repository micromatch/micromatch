const mm = require('minimatch');
const μm = require('..');

const glob1 = '/a/**';
const glob2 = '/a{,/**}';
const strA = '/a/whatever';
const strB = '/a/whatever/comes/next';

console.log(mm(strA, glob1));
console.log(mm(strA, glob2));
console.log(mm(strB, glob1));
console.log(mm(strB, glob2));

console.log(μm.isMatch(strA, glob1));
console.log(μm.isMatch(strA, glob2));
console.log(μm.isMatch(strB, glob1));
console.log(μm.isMatch(strB, glob2)); // FAILS

const glob3 = 'a/*/b'
const strC = 'a//b'
console.log(mm(strC, glob3)) // false
console.log(μm.isMatch(strC, glob3)) // true
