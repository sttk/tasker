'use strict';

var gulp = require('gulp');
var ghelp = require('gulp-showhelp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var mapstream = require('map-stream');
var jsunit = require('gulp-tarte-jsunit');
var fs = require('fs');


gulp.task('default', [ 'help' ]);

gulp.task('help', function() {
  ghelp.show();
}).help = 'shows a help message.';

var srcs = ['src/*.js', 'src/lib/*.js'];

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
  var js = ghelp.getArgv('js');
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
  var slink = './node_modules/tasker';
  if (! fs.existsSync(slink)) {
    fs.symlink('..', './node_modules/tasker', function(e) {
      if (e != null) { console.log("!ERROR: " + e); }
      return;
    });
  }
  var js = ghelp.getArgv('js');
  if (js == null) {
    console.log("!ERROR: The option 'js' should be specified js path.");
    return;
  }
  var json = ghelp.getArgv('report-file');
  if (json == null) {
    var exit = function() { process.exit(1); }
    jsunit.run(js, {pass:done, fail:exit, rterr:exit, pgerr:exit});
  } else {
    jsunit.run(js, done);
  }
}).help = {
  '': 'runs a js code for test.',
  '--js=file': 'specifys a js path containing a unit test code.',
  '[ --report-file=file ]': 'specifys a path of a report file.'
};
