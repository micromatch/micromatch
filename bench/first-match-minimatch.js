console.time('minimatch');
console.log(require('minimatch').makeRe('**/*').test('foo/bar/baz/qux.js'));
console.timeEnd('minimatch');
// minimatch: 9.275ms
