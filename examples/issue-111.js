var mm = require('..');
var pattern = './something/*.js';

console.log(mm.isMatch('./something/file.js', pattern));
console.log(mm.makeRe(pattern).test('./something/file.js'));

