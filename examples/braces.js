console.time('total');
process.on('exit', () => console.timeEnd('total'));

const mm = require('..');

/**
 * Brace expansion
 */

console.log(mm.braceExpand('{a,b,c}/{a..e}'));
//=>  ['a/a', 'a/b', 'a/c', 'a/d', 'a/e', 'b/a', 'b/b', 'b/c', 'b/d', 'b/e', 'c/a', 'c/b', 'c/c', 'c/d', 'c/e']


console.log(mm.braces('foo/{a,b}/bar', { expand: true }));
//=> [ 'foo/a/bar', 'foo/b/bar' ]

// console.log(mm.braceExpand('{a,b,c}/{001..10}'));
// console.log(mm.braces('{a,b,c}/{001..10}', { expand: true }));

/**
 * Brace optimization
 */

console.log(mm.braces('{a,b,c}/{001..10}'));
//=> [ '{a,b,c}/{1..100}' ]

console.log(mm.makeRe('foo*{/*,}'));
console.log(mm.makeRe('foo*{/*,*}'));
console.log(mm.makeRe('foo*{!([B-C]),!([x-z])}'));
console.log(mm.makeRe('{!(a|b),!(c|d)}'));
