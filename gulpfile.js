'use strict'

const gulp = require('gulp-run-seq')
const ghelp = require('gulp-showhelp')
const eslint = require('gulp-eslint')
const mocha = require('gulp-mocha')
const fs = require('fs')


gulp.task('default', [ 'help' ])

gulp.task('help', () => {
  ghelp.show()
}).help = 'shows a help message.'

gulp.task('lint', (end) => {
  gulp.src('src/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.results(function(results) { end() }))
    .pipe(eslint.failAfterError())
}).help = 'lints source files.'

gulp.task('lint-test', (end) => {
  gulp.src('tests/*.mocha')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.results(function(results) { end() }))
    .pipe(eslint.failAfterError())
}).help = 'lints test source files.'

gulp.task('symlink', (end) => {
  var slink = './node_modules/tasker';
  if (fs.existsSync(slink)) {
    end()
    return
  }
  fs.symlink('..', './node_modules/tasker', function(e) {
    if (e != null) { console.log("!ERROR: " + e); }
    end(e)
  });
}).help = 'make symbolic link of this project in node_modules.'

gulp.task('test', [[ ['lint', 'lint-test'], 'symlink' ]], (end) => {
  gulp.src('tests/*.mocha', { read: false })
    .pipe(mocha())
    .on('end', end)
}).help = 'run mocha tests.'
