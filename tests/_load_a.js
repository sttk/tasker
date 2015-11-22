'use strict';

var path = require('path');
var tasker = require(path.resolve('./lib/load.js'));

tasker.entry('taskA0', []);

tasker.entry('taskA3', ['taskA4', 'taskB1']);

tasker.entry('taskA0', []);

tasker.entry('taskA1', ['taskA0', 'taskB1']);

tasker.load(path.resolve('./tests/_load_b.js'));

tasker.entry('taskA0', []);

tasker.entry('taskA2');


tasker.entry('taskA4', ['taskC0']);

tasker.entry('taskA5', []);

