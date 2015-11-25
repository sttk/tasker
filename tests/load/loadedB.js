'use strict';
var tasker = require('tasker/src/load1.js');
tasker.entry('taskB0', null, 'Task B0 [1]');
tasker.entry('taskB1', ['taskA2', 'taskB0'], 'Task B1');
tasker.entry('taskB0', null, 'Task B0 [2]');
