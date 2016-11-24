var mm = require('../');

console.log(mm.braces('{a,b}'));
//=> [ '(a|b)' ]

console.log(mm.braces('{a,b}', {expand: true}));
//=> [ 'a', 'b' ]

console.log(mm.braces('foo/{a,b}/bar'));
//=> [ 'foo/(a|b)/bar' ]

console.log(mm.braces('foo/{a,b}/bar', {expand: true}));
//=> [ 'foo/a/bar', 'foo/b/bar' ]
