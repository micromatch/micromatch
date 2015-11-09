var path = require('path');
var mini = require('minimatch');
var mm = require('../');

function resolve(fp) {
  return path.resolve(fp);
}

var arr = ['/b', '/b/a.js', '/b/b.js', '/b/c.js', '/b/index.js'].map(resolve);

console.log(mini.match(arr, '/b*/**', {
  root: '.'
}));
console.log(mm(arr, '/b*/**', {
  root: '.'
}));

console.log(mini.match(['/b', '/b/c', '/b/c/d', '/bc', '/bc/e', '/bc/e/f'], '/b*/**', {
  root: path.resolve('a')
}));
console.log(mm(['/b', '/b/c', '/b/c/d', '/bc', '/bc/e', '/bc/e/f'], '/b*/**', {
  root: path.resolve('a')
}));
console.log(mini.match(['/b', '/b/c', '/b/c/d', '/bc', '/bc/e', '/bc/e/f'], '/b*/**', {
  cwd: path.resolve('a/b'),
  root: 'a'
}));
console.log(mm(['/b', '/b/c', '/b/c/d', '/bc', '/bc/e', '/bc/e/f'], '/b*/**', {
  cwd: path.resolve('a/b'),
  root: 'a'
}));
