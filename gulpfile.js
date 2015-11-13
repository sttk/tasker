'use strict';

var gulp = require('gulp');
var ghelp = require('gulp-showhelp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var mapstream = require('map-stream');
var jsunit = require('gulp-tarte-jsunit');

gulp.task('default', [ 'help' ]);

gulp.task('help', function() {
  ghelp.show();
}).help = 'shows a help message.';

var srcs = [
  'lib/create_and_get.js',
];

gulp.task('lint', function(done) {
  function jshintMapper(data, cb) {
    cb(data.jshint.success ? null : new Error(), data);
  }
  gulp.src(srcs)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(mapstream(jshintMapper))
    .on('error', function() {})
    .on('end', done);
});

gulp.task('lint-for-test', function(done) {
  var js = ghelp.get_argv('js');
  if (js == null) {
    console.log("!ERROR: The option 'js' should be specified js path.");
    return;
  }
  function jshintMapper(data, cb) {
    cb(data.jshint.success ? null : new Error(), data);
  }
  gulp.src(js)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(mapstream(jshintMapper))
    .on('error', function() {})
    .on('end', done);
});

gulp.task('test', [ 'lint', 'lint-for-test' ], function(done) {
  var js = ghelp.get_argv('js');
  if (js == null) {
    console.log("!ERROR: The option 'js' should be specified js path.");
    return;
  }
  jsunit.run(js, done);
}).help = {
  '': 'runs a js code for test.',
  '--js=file': 'specifys a js path containing a unit test code.',
  '[ --report-file=file ]': 'specifys a path of a report file.'
};
