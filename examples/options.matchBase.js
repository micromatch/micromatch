var mm = require('../');
var files = [
  'ab',
  'a/bc',
  'bb',
  'bbc',
  'b/c',
  'a/b/c.js',
  'a/b/c.md',
  'a/bb/c.js',
  'a/bb/c.md',
  'a/bbb/c.js',
  'a/bbb/c.md',
  'a/bbbb/c.js',
  'a/bbbb/c.md',
  'a/b/c/d/eeeeeee/f.js',
  'a/b/c/d/eeeeeee/f.md',
  'a/b/c/d/e.js',
  'a/b/c/d/e.md',
  'a/b/c/d/e.txt',
  'a/b/c/d/e.txt',
  'a/b/c/ddd/e.js',
  'a/b/c/ddd/e.md'
];

console.log(mm(files, '**/*.!(md|txt)'))
// var re = mm.makeRe('**/*!(.md)');

// var res = files.filter(function (fp) {
//   return re.test(fp);
// })
// console.log(res)
