'use strict';

var tasker = require('tasker/src/namespace1.js');

tasker.entry('taskA0', ['taskA1', 'taskA2']);
tasker.load('./loadedB.js', 'bbb');
tasker.entry('taskA1', ['taskB0@bbb']);
tasker.entry('taskA2', ['taskC0@XXX@bbb']);
tasker.entry('taskA3', ['taskC0@bbb']);
