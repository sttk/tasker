'use strict';

var gulp = require('gulp');
var ghelp = require('gulp-showhelp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var mapstream = require('map-stream');
var mocha = require('gulp-mocha');
var fs = require('fs');


gulp.task('default', [ 'help' ]);

gulp.task('help', function() {
  ghelp.show();
}).help = 'shows a help message.';

gulp.task('lint', function() {
  function jshintMapper(data, cb) {
    cb(data.jshint.success ? null : new Error(), data);
  }
  gulp.src('src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(mapstream(jshintMapper))
    .on('error', function() { this.emit('end'); });
}).help = 'lints source files.';

gulp.task('lint-for-test', function() {
  function jshintMapper(data, cb) {
    cb(data.jshint.success ? null : new Error(), data);
  }
  gulp.src('tests/*.mocha')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(mapstream(jshintMapper))
    .on('error', function() { this.emit('end'); });
});

gulp.task('test', ['lint', 'lint-for-test'], function() {
  var slink = './node_modules/tasker';
  if (! fs.existsSync(slink)) {
    fs.symlink('..', './node_modules/tasker', function(e) {
      if (e != null) { console.log("!ERROR: " + e); }
      return;
    });
  }
  gulp.src('tests/*.mocha', {read:false})
    .pipe(mocha())
    .on('error', function() { this.emit('end'); });
}).help = 'run mocha tests.'

gulp.task('watch-test', function() {
  gulp.watch(['src/**', 'tests/**'], ['test']);
});
