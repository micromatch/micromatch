console.time('micromatch');
console.log(require('..').makeRe('**/*').test('foo/bar/baz/qux.js'));
console.timeEnd('micromatch');
// micromatch: 7.429ms
