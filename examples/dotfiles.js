const minimatch = require('minimatch');
const mm = require('..');

console.log(minimatch('b/.c', '**/**/**', { dot: true }));
console.log(mm.isMatch('b/.c', '**/**/**', { dot: true }));
console.log('---')
console.log(minimatch('../c', '**/**/**', { dot: true }));
console.log(mm.isMatch('../c', '**/**/**', { dot: true }));
console.log('---')
console.log(minimatch('b/.c', '**/**/**'));
console.log(mm.isMatch('b/.c', '**/**/**'));
console.log('---')
console.log(minimatch('../c', '**/**/**'));
console.log(mm.isMatch('../c', '**/**/**'));
