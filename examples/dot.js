var mm = require('..');

console.log(mm.makeRe('.a/{,*/}xyz.md'))
console.log(mm.isMatch('.a/xyz.md', '.a/{,*/}xyz.md'));

console.log(mm.makeRe('.a/**/xyz.md'))
console.log(mm.isMatch('.a/xyz.md', '.a/**/xyz.md'));
