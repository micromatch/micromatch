'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var unused = require('gulp-unused');
var istanbul = require('gulp-istanbul');
var eslint = require('gulp-eslint');

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

gulp.task('lint', function() {
  return gulp.src(['*.js', 'lib/*.js', 'test/{*,support/*}.js'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('unused', function() {
  return gulp.src(['index.js', 'lib/*.js'])
    .pipe(unused({keys: Object.keys(require('./lib/utils.js'))}));
});

gulp.task('default', ['test', 'lint']);
