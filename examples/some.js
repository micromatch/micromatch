var mm = require('..');

console.log(mm.some('foo.js', ['foo.js']));
// true

console.log(mm.some(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
// true

console.log(mm.some(['foo.js'], ['*.js', '!foo.js']));
// false
