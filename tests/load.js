'use strict';

var tasker = require('tasker/src/load1.js');
var Lineno = require('tasker/src/lib/lineno.js');
var path = require('path');
var logs = [];

testsuite('Tasker - A task registry', function() {
  this.testcase('Merge multiple js files.', {
    pre: function() {
      tasker._lineno = new Lineno('./tests/load/loadedA.js');
    },
    run: function() {
      tasker.load(tasker._lineno.file());
      var log = tasker.tree();
      logs.push(log);
      this.match(log,
'Task A0 [3] (8)\n' +
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
'Task B0 [2] (loadedB.js:5)\n' +
'Task B1 (loadedB.js)\n' +
'├─taskA2\n' +
'└─Task B0 [1] (loadedB.js:3)\n' +
'');
    }
  });
}, {
  post: function() {
    logs.forEach(function(log) { console.log(log); });
  }
});
