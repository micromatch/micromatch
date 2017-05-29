var mm = require('..');

console.log(mm.every('foo.js', ['foo.js']));
// true

console.log(mm.every(['foo.js', 'bar.js'], ['*.js']));
// true

console.log(mm.every(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
// false

console.log(mm.every(['foo.js'], ['*.js', '!foo.js']));
// false
