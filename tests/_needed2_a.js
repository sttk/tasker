'use strict';

var path = require('path');
var tasker = require(path.resolve('./lib/needed.js'));

tasker.entry('taskA0', ['taskA1', 'taskA2']);

tasker.load('tests/_load_b.js');

tasker.entry('taskA0', ['taskA3']);

tasker.entry('taskA1');

tasker.entry('taskA2');

tasker.entry('taskA3');

tasker.load('tests/_load_a.js');

tasker.entry('taskA4');

tasker.entry('taskA5');
