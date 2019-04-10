'use strict';

const { braces } = require('..');

console.log(braces('foo/{a,b,c}/bar'));
//=> [ 'foo/(a|b|c)/bar' ]

console.log(braces('foo/{a,b,c}/bar', { expand: true }));
//=> [ 'foo/a/bar', 'foo/b/bar', 'foo/c/bar' ]
