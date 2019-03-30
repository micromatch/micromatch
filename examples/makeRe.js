const mm = require('..');

console.log(mm.makeRe('{a,b}', { expand: true }));
console.log(mm.makeRe('{a,b}'));
