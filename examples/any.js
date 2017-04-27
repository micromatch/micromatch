var mm = require('..');

console.log(mm.any('foo.js', ['foo.js']));
// true

// the following is correct, because one of the patterns matches
console.log(mm.any('foo.js', ['*.js', '!foo.js']));
// true
