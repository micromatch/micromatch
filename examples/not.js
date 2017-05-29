var mm = require('..');

console.log(mm.not('foo.js', ['foo.js']));
// []

console.log(mm.not(['foo.js', 'bar.js'], ['*.js']));
// []

console.log(mm.not(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
// ['foo.js']

console.log(mm.not(['foo.js', 'bar.js', 'baz.js', 'foo.md'], ['!*.js'], {ignore: 'baz.js'}));
// ['foo.js', 'bar.js']

console.log(mm.not(['foo.js'], ['*.js', '!foo.js']));
// ['foo.js']
