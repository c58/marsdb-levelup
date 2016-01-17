'use strict';

var gulp = require('gulp');
var babel = require('gulp-babel');
var config = require('../config');
var gulpif = require('gulp-if');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var path = require('path');


gulp.task('build', [
  'build:node'
]);

gulp.task('build:node', function() {
  return gulp.src(config.src)
    .pipe(babel())
    .pipe(gulp.dest(config.dist));
});
