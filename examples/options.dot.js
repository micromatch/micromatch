var nm = require('..');
var mm = require('minimatch');

console.log(nm.makeRe('.a/{,*/}xyz.md'))
console.log(nm.isMatch('.a/xyz.md', '.a/{,*/}xyz.md'));

console.log(nm.makeRe('.a/**/xyz.md'))
console.log(nm.isMatch('.a/xyz.md', '.a/**/xyz.md'));
console.log(nm.isMatch('./b/.c', '?/.?'));
console.log(nm.isMatch('./b/.c', '?/.?*'));
console.log(nm.isMatch('b/.c', '?/.?*'));
console.log(nm.isMatch('./', '?', {dot: true}));

// this is wrong
console.log(mm('./', '?/', {dot: true}));
console.log(mm('./b/.c', '?/.?*'));
