var mm = require('..');
var mi = require('minimatch');

var files = [
  '.editorconfig',
  '.git',
  '.gitignore',
  '.nyc_output',
  '.travis.yml',
  '.verb.md',
  'CHANGELOG.md',
  'CONTRIBUTING.md',
  'LICENSE',
  'coverage',
  'example.js',
  'example.md',
  'example.css',
  'index.js',
  'node_modules',
  'package.json',
  'test.js',
  'utils.js'
]

console.log(mm(files, ['example.*', '*.js'], {
  nodupes: true
}))
