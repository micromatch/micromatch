const mm = require('..');

console.log(mm.any('foo.js', ['foo.js']));
// true

console.log(mm.any('foo.js', ['!foo.js']));
// false

console.log(mm.any('foo.js', ['*.js', '!foo.js']));
// true

console.log(mm.any('foo.js', ['!foo.js', '*.js']));
// true
