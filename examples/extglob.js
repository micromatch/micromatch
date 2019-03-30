const minimatch = require('minimatch');
const mm = require('..');

console.log(minimatch.makeRe('foo/!(z*)'));
console.log(mm.makeRe('foo/!(z*)'));


// console.log(minimatch('foo/bar/baz', 'foo/!(z*)'));
// console.log(mm.isMatch('foo/bar/baz', 'foo/!(z*)'));


// console.log(mm(['a/b.js', 'a/b.md'], 'a/*.!(js)'));
