'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var unused = require('gulp-unused');
var istanbul = require('gulp-istanbul');

gulp.task('coverage', function() {
  return gulp.src(['index.js', 'lib/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['coverage'], function() {
  return gulp.src('test/*.js')
    .pipe(mocha({reporter: 'spec'}))
    .pipe(istanbul.writeReports());
});

gulp.task('unused', function() {
  return gulp.src(['index.js', 'lib/*.js'])
    .pipe(unused({keys: Object.keys(require('./lib/utils.js'))}));
});

gulp.task('default', ['test']);
