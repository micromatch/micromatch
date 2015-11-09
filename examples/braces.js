var mm = require('../');

console.log(mm.braces('{a,b}'));
//=> [ 'a', 'b' ]

console.log(mm.braces('foo/{a,b}/bar'));
//=> [ 'foo/a/bar', 'foo/b/bar' ]
