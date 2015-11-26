'use strict';

var tasker = require('tasker/src/namespace1.js');

tasker.entry('taskA0', ['taskA1', 'taskA2']);
tasker.load('./loadedB.js', 'bbb');
tasker.load('./loadedB.js', 'bbb');
tasker.entry('taskA1', ['taskB0']);
tasker.entry('taskA2', ['taskB0@bbb']);
tasker.entry('taskA3', ['taskC0']);
tasker.entry('taskA4', ['taskC0@XXX']);
tasker.entry('taskA5', ['taskC0@XXX@bbb']);
tasker.entry('taskA6', ['taskC0@bbb']);
