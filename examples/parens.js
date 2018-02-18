var mm = require('../');
const re = mm.makeRe('./test(dir)/foo.txt', { noext: true });
console.dir(re);
