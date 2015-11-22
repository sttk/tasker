'use strict';

var path = require('path');
var tasker = require(path.resolve('./lib/load.js'));

tasker.entry('taskB0');

tasker.entry('taskB1', ['taskA2', 'taskB0' ]);

tasker.entry('taskB0');
