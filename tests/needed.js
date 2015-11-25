'use strict';

var tasker = require('tasker/src/needed1.js');
var Lineno = require('tasker/src/lib/lineno.js');
var path = require('path');
var logs = [];

testsuite('Tasker - A task registry', function() {
  this.testcase('Entry only tasks needed.', {
    without_target: function() {
      tasker.clear();
      tasker._lineno = new Lineno('./tests/needed/loadedA.js');
      tasker.load(tasker._lineno.file());
      var log = tasker.tree();
      logs.push(log);
      this.match(log,
'Task A0 [1] (3)\n' +
'Task A1\n' +
'├─Task A0 [2] (5)\n' +
'└─Task B1 (loadedB.js)\n' +
'　├─taskA2\n' +
'　└─Task B0 [1] (loadedB.js:3)\n' +
'taskA2\n' +
'Task A3\n' +
'├─Task A4\n' +
'│ └─taskC0 <undefined>\n' +
'└─Task B1 (loadedB.js)\n' +
'　├─taskA2\n' +
'　└─Task B0 [1] (loadedB.js:3)\n' +
'Task A4\n' +
'└─taskC0 <undefined>\n' +
'taskA5\n' +
'Task B0 [1] (loadedB.js:3)\n' +
'Task B1 (loadedB.js)\n' +
'├─taskA2\n' +
'└─Task B0 [1] (loadedB.js:3)\n' +
'');
    },
    with_target_taskA0: function() {
      tasker.clear();
      tasker._lineno = new Lineno('./tests/needed/loadedA1.js');
      tasker.target = 'taskA0';
      tasker.load(tasker._lineno.file());
      var log = tasker.tree();
      logs.push(log);
      this.match(log,
'Task A0 [1] (3)\n' +
'');
    },
    with_target_taskA0_and_loadB: function() {
      tasker.clear();
      tasker._lineno = new Lineno('./tests/needed/loadedA2.js');
      tasker.target = 'taskA0';
      tasker.load(tasker._lineno.file());
      var log = tasker.tree();
      logs.push(log);
      this.match(log,
'Task A0 [1] (3)\n' +
'└─taskA2\n' +
'Task A1\n' +
'├─Task A0 [2] (5)\n' +
'└─Task B1 (loadedB2.js)\n' +
'　├─taskA2\n' +
'　└─Task B0 [1] (loadedB2.js:3)\n' +
'taskA2\n' +
'Task A3\n' +
'├─taskA4 <undefined>\n' +
'└─Task B1 (loadedB2.js)\n' +
'　├─taskA2\n' +
'　└─Task B0 [1] (loadedB2.js:3)\n' +
'Task B0 [1] (loadedB2.js:3)\n' +
'Task B1 (loadedB2.js)\n' +
'├─taskA2\n' +
'└─Task B0 [1] (loadedB2.js:3)\n' +
'');
    },
    with_target_taskA0_and_no_loadB: function() {
      tasker.clear();
      tasker._lineno = new Lineno('./tests/needed/loadedA3.js');
      tasker.target = 'taskA0';
      tasker.load(tasker._lineno.file());
      var log = tasker.tree();
      logs.push(log);
      this.match(log,
'Task A0 [1] (3)\n' +
'└─taskA2\n' +
'taskA2\n' +
'Task A3\n' +
'├─taskA4 <undefined>\n' +
'└─taskB1 <undefined>\n' +
'');
    },
    run: function() {
      this.without_target();
      this.with_target_taskA0();
      this.with_target_taskA0_and_loadB();
      this.with_target_taskA0_and_no_loadB();
    }
  });
}, {
  post: function() {
    logs.forEach(function(log) { console.log(log); });
  }
});
