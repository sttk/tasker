'use strict';

var tasker = require('tasker');

tasker.task('case0', tasker.series('task0', 'task1', 'task2'));
tasker.task('case1', tasker.series('task00', 'task1', 'task2'));
tasker.task('case2', tasker.parallel('task0', 'task1', 'task2'));
tasker.task('case3', tasker.parallel('task00', 'task1', 'task2'));

tasker.task('task0', function(cb) {
  cb(new Error('Task 0 has caused error!'));
});

tasker.task('task00', function(cb) {
  throw new Error('Task 0 has caused error!');
});

tasker.task('task1', function(cb) {
  cb();
});

tasker.task('task2', function(cb) {
  cb();
});
