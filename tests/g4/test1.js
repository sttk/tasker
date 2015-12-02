'use strict';

var tasker = require('tasker');

tasker.task('task-0', function(cb) {
  console.log('>task-0');
  cb();
}).description = 'Task #0.';

tasker.task('default', function(cb) {
  console.log('>default');
  cb();
}).description = 'Default task.';

tasker.task('task-2', tasker.series(fn1, fn2));

function fn1(cb) {
  console.log('>fn1');
  cb();
}

function fn2(cb) {
  console.log('>fn2');
  cb();
}

function fn3(cb) {
  console.log('>fn3');
  cb();
}

var fn4 = function(cb) {
  console.log('>fn4');
  cb();
}

tasker.task(fn3);

tasker.task('task-1', tasker.series('task-0', fn3, fn4))
 .description = {
   _: 'Task #1.',
   '--option1=value': 'Option 1.',
   '--option2': 'Option 2.'
 };

tasker.task('task-4', fn4);

tasker.task('task-5', tasker.parallel('task-0', fn3, 'task-4'));

tasker.task('task-6',
  tasker.series(
    'task-0',
    'task-4',
    tasker.series(fn3, fn1),
    fn2,
    tasker.series(fn3, tasker.series('task-0', 'task-4', fn2), fn1)
  )
).description = 'Task #6.';

tasker.task('task-7',
  tasker.parallel('task-6', 'task-4', 'task-5', 'task-6'));
