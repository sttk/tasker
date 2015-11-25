var tasker = require('tasker/src/needed1.js');
var Lineno = require('tasker/src/lib/lineno.js');
var assert = require('assert');
tasker._lineno = new Lineno('./tests/needed/loadedA3.js');
tasker.target = 'taskA0';
tasker.load(tasker._lineno.file());
var log = tasker.tree();
assert.equal(log,
'Task A0 [1] (3)\n' +
'└─taskA2\n' +
'taskA2\n' +
'Task A3\n' +
'├─taskA4 <undefined>\n' +
'└─taskB1 <undefined>\n' +
'');
console.log(log);

// The above code displays as follows:
// (!) On top level, a first task is given priority.
// (!) taskA4, taskA5, tasks in loadedB3.js are ignored.
// Task A0 [1] (3)
// └─taskA2
// taskA2
// Task A3
// ├─taskA4 <undefined>
// └─taskB1 <undefined>

