var tasker = require('tasker/src/namespace1.js');
var Lineno = require('tasker/src/lib/lineno.js');
var assert = require('assert');
tasker._lineno = new Lineno('./tests/namespace/loadedA5.js');
var Lineno = require('tasker/src/lib/lineno.js');
tasker.load(tasker._lineno.file());
var log = tasker.tree();
console.log(log);
assert.equal(log,
'taskA0\n' +
'├─taskA1\n' +
'│ └─taskB0@bbb (loadedB.js)\n' +
'│ 　├─taskC0@bbb (loadedC.js)\n' +
'│ 　└─taskC0@XXX@bbb (loadedC.js)\n' +
'└─taskA2\n' +
'　└─taskC0@XXX@bbb (loadedC.js)\n' +
'taskA1\n' +
'└─taskB0@bbb (loadedB.js)\n' +
'　├─taskC0@bbb (loadedC.js)\n' +
'　└─taskC0@XXX@bbb (loadedC.js)\n' +
'taskA2\n' +
'└─taskC0@XXX@bbb (loadedC.js)\n' +
'taskA3\n' +
'└─taskC0@bbb (loadedC.js)\n' +
'taskB0@bbb (loadedB.js)\n' +
'├─taskC0@bbb (loadedC.js)\n' +
'└─taskC0@XXX@bbb (loadedC.js)\n' +
'taskC0@XXX@bbb (loadedC.js)\n' +
'taskC0@bbb (loadedC.js)\n' +
'');
