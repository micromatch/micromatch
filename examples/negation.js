var mm = require('..');

console.log(mm(['bar/bar'], ['foo/**', '!foo/baz']));
console.log(mm(['bar/bar'], ['!foo/baz', 'foo/**']));
console.log(mm(['bar/bar'], ['!**', '!foo/baz', 'foo/**']));
console.log(mm(['bar/bar'], ['**', '!foo/baz', 'foo/**']));
console.log(mm(['bar/bar'], ['!foo/baz', 'foo/**']));
