'use strict';

var tasker = require('tasker');

var fn = function(cb) {
  console.log('>>fn');
  cb();
}

var fn1 = function(cb) {
  console.log('>>fn1');
  cb();
}

fn.displayName = 'FN';

tasker.task('task-2', tasker.series(fn, fn1));

tasker.task('task-0', 'task-1');

tasker.task('task-1', fn);

tasker.task('task-3', 'task-2');
