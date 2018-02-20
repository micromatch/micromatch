var mm = require('..');

console.log(mm.isMatch("./x/y.js", "*.js", { matchBase: true }));
// true
console.log(mm.isMatch("./x/y.js", "!*.js", { matchBase: true }));
// false
console.log(mm.isMatch("./x/y.js", "**/*.js", { matchBase: true }));
// true
console.log(mm.isMatch("./x/y.js", "!**/*.js", { matchBase: true }));
// false
