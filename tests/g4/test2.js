'use strict';

var tasker = require('tasker');

tasker.task('task-0', tasker.parallel('task-1', 'task-2'));

tasker.task('task-1', function(cb) {
  console.log('Task #1(1) start.');
  setTimeout(function() { console.log('Task #1(1) end.'); cb(); }, 2000);
}).description = 'Task #1 (1)';

tasker.task('task-1', function(cb) {
  console.log('Task #1(2) start.');
  setTimeout(function() { console.log('Task #1(2) end.'); cb(); }, 2000);
}).description = 'Task #1 (2)';

tasker.task('task-3', tasker.series('task-1', 'task-2'));

tasker.task('task-2', function(cb) {
  console.log('Task #2 start.');
  setTimeout(function() { console.log('Task #2 end.'); cb(); }, 1000);
});

tasker.task('task-4', tasker.series('task-5'));
