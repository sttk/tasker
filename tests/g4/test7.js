'use strict';

var tasker = require('tasker');

tasker.task('default', tasker.parallel('task0', tasker.series('task1', 'task2'), 'task3'));

tasker.task('task0', function(cb) { cb(); });
tasker.task('task1', function(cb) { cb(); });
tasker.task('task2', function(cb) { cb(); });
tasker.task('task3', function(cb) { cb(); });
