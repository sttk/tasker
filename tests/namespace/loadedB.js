'use strict';

var tasker = require('tasker/src/namespace1.js');

tasker.entry('taskB0', ['taskC0', 'taskC0@XXX']);
tasker.load('./loadedC.js');
tasker.load('./loadedC.js', 'XXX');
