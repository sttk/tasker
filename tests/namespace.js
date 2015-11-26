'use strict';

var tasker = require('tasker/src/namespace1.js');
var Lineno = require('tasker/src/lib/lineno.js');
var path = require('path');
var logs = [];

testsuite('Tasker - A task registry', function() {
  this.testcase('Namespace for tasks in merged files.', {
    load_file_with_namespace: function() {
      tasker.clear();
      tasker._lineno = new Lineno('./tests/namespace/loadedA.js');
      tasker.load(tasker._lineno.file());
      var log = tasker.tree();
      logs.push(log);
      this.match(log,
'taskA0\n' +
'├─taskA1\n' +
'│ └─taskB0 <undefined>\n' +
'└─taskA2\n' +
'　└─taskB0@bbb (loadedB.js)\n' +
'　　├─taskC0@bbb (loadedC.js)\n' +
'　　└─taskC0@XXX@bbb (loadedC.js)\n' +
'taskA1\n' +
'└─taskB0 <undefined>\n' +
'taskA2\n' +
'└─taskB0@bbb (loadedB.js)\n' +
'　├─taskC0@bbb (loadedC.js)\n' +
'　└─taskC0@XXX@bbb (loadedC.js)\n' +
'taskA3\n' +
'└─taskC0 <undefined>\n' +
'taskA4\n' +
'└─taskC0@XXX <undefined>\n' +
'taskA5\n' +
'└─taskC0@XXX@bbb (loadedC.js)\n' +
'taskA6\n' +
'└─taskC0@bbb (loadedC.js)\n' +
'taskB0@bbb (loadedB.js)\n' +
'├─taskC0@bbb (loadedC.js)\n' +
'└─taskC0@XXX@bbb (loadedC.js)\n' +
'taskC0@XXX@bbb (loadedC.js)\n' +
'taskC0@bbb (loadedC.js)\n' +
'');
    },
    load_file_without_namespace: function() {
      tasker.clear();
      tasker._lineno = new Lineno('./tests/namespace/loadedA1.js');
      tasker.load(tasker._lineno.file());
      var log = tasker.tree();
      logs.push(log);
      this.match(log,
'taskA1\n' +
'└─taskB0 (loadedB.js)\n' +
'　├─taskC0 (loadedC.js)\n' +
'　└─taskC0@XXX (loadedC.js)\n' +
'taskA2\n' +
'└─taskB0@bbb <undefined>\n' +
'taskA3\n' +
'└─taskC0 (loadedC.js)\n' +
'taskA4\n' +
'└─taskC0@XXX (loadedC.js)\n' +
'taskA5\n' +
'└─taskC0@XXX@bbb <undefined>\n' +
'taskA6\n' +
'└─taskC0@bbb <undefined>\n' +
'taskB0 (loadedB.js)\n' +
'├─taskC0 (loadedC.js)\n' +
'└─taskC0@XXX (loadedC.js)\n' +
'taskC0 (loadedC.js)\n' +
'taskC0@XXX (loadedC.js)\n' +
'');
    },
    load_file_with_and_without_namespace: function() {
      tasker.clear();
      tasker._lineno = new Lineno('./tests/namespace/loadedA2.js');
      tasker.load(tasker._lineno.file());
      var log = tasker.tree();
      logs.push(log);
      this.match(log,
'taskA1\n' +
'└─taskB0 (loadedB.js)\n' +
'　├─taskC0 (loadedC.js)\n' +
'　└─taskC0@XXX (loadedC.js)\n' +
'taskA2\n' +
'└─taskB0@bbb (loadedB.js)\n' +
'　├─taskC0@bbb (loadedC.js)\n' +
'　└─taskC0@XXX@bbb (loadedC.js)\n' +
'taskA3\n' +
'└─taskC0 (loadedC.js)\n' +
'taskA4\n' +
'└─taskC0@XXX (loadedC.js)\n' +
'taskA5\n' +
'└─taskC0@XXX@bbb (loadedC.js)\n' +
'taskA6\n' +
'└─taskC0@bbb (loadedC.js)\n' +
'taskB0 (loadedB.js)\n' +
'├─taskC0 (loadedC.js)\n' +
'└─taskC0@XXX (loadedC.js)\n' +
'taskB0@bbb (loadedB.js)\n' +
'├─taskC0@bbb (loadedC.js)\n' +
'└─taskC0@XXX@bbb (loadedC.js)\n' +
'taskC0 (loadedC.js)\n' +
'taskC0@XXX (loadedC.js)\n' +
'taskC0@XXX@bbb (loadedC.js)\n' +
'taskC0@bbb (loadedC.js)\n' +
'');
    },
    load_file_twice_with_namespace: function() {
      tasker.clear();
      tasker._lineno = new Lineno('./tests/namespace/loadedA3.js');
      tasker.load(tasker._lineno.file());
      var log = tasker.tree();
      logs.push(log);
      this.match(log,
'taskA0\n' +
'├─taskA1\n' +
'│ └─taskB0 <undefined>\n' +
'└─taskA2\n' +
'　└─taskB0@bbb (loadedB.js)\n' +
'　　├─taskC0@bbb (loadedC.js)\n' +
'　　└─taskC0@XXX@bbb (loadedC.js)\n' +
'taskA1\n' +
'└─taskB0 <undefined>\n' +
'taskA2\n' +
'└─taskB0@bbb (loadedB.js)\n' +
'　├─taskC0@bbb (loadedC.js)\n' +
'　└─taskC0@XXX@bbb (loadedC.js)\n' +
'taskA3\n' +
'└─taskC0 <undefined>\n' +
'taskA4\n' +
'└─taskC0@XXX <undefined>\n' +
'taskA5\n' +
'└─taskC0@XXX@bbb (loadedC.js)\n' +
'taskA6\n' +
'└─taskC0@bbb (loadedC.js)\n' +
'taskB0@bbb (loadedB.js)\n' +
'├─taskC0@bbb (loadedC.js)\n' +
'└─taskC0@XXX@bbb (loadedC.js)\n' +
'taskC0@XXX@bbb (loadedC.js)\n' +
'taskC0@bbb (loadedC.js)\n' +
'');
    },
    load_file_twice_without_namespace: function() {
      tasker.clear();
      tasker._lineno = new Lineno('./tests/namespace/loadedA1.js');
      tasker.load(tasker._lineno.file());
      var log = tasker.tree();
      logs.push(log);
      this.match(log,
'taskA1\n' +
'└─taskB0 (loadedB.js)\n' +
'　├─taskC0 (loadedC.js)\n' +
'　└─taskC0@XXX (loadedC.js)\n' +
'taskA2\n' +
'└─taskB0@bbb <undefined>\n' +
'taskA3\n' +
'└─taskC0 (loadedC.js)\n' +
'taskA4\n' +
'└─taskC0@XXX (loadedC.js)\n' +
'taskA5\n' +
'└─taskC0@XXX@bbb <undefined>\n' +
'taskA6\n' +
'└─taskC0@bbb <undefined>\n' +
'taskB0 (loadedB.js)\n' +
'├─taskC0 (loadedC.js)\n' +
'└─taskC0@XXX (loadedC.js)\n' +
'taskC0 (loadedC.js)\n' +
'taskC0@XXX (loadedC.js)\n' +
'');
    },
    run: function() {
      this.load_file_with_namespace();
      this.load_file_without_namespace();
      this.load_file_with_and_without_namespace();
      this.load_file_twice_with_namespace();
      this.load_file_twice_without_namespace();
    }
  });
}, {
  post: function() {
    logs.forEach(function(log) { console.log(log); });
  }
});
