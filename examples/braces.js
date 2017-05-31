var mm = require('../');

/**
 * Brace optimization
 */

// console.log(mm.braces('{a,b,c}/{001..100}'));
// => [ '{a,b,c}/{1..100}' ]

/**
 * Brace expansion
 */

// console.log(mm.braceExpand('{a,b,c}/{001..100}'));
//=>  ['a/a', 'a/b', 'a/c', 'a/d', 'a/e', 'b/a', 'b/b', 'b/c', 'b/d', 'b/e', 'c/a', 'c/b', 'c/c', 'c/d', 'c/e']

// console.log(mm.braces('{a,b,c}/{001..100}', {expand: true}));
//=> [ 'foo/a/bar', 'foo/b/bar' ]


console.log(mm.makeRe('foo*{/*,}'));
console.log(mm.makeRe('foo*{/*,*}'));
console.log(mm.makeRe('foo*{!([B-C]),!([x-z])}'));
console.log(mm.makeRe('{!(a|b),!(c|d)}'));
