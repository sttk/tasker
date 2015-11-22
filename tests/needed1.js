'use strict';

var path = require('path');
var tasker = require(path.resolve('./lib/needed.js'));

testsuite('Tasker - A task registry', function() {
  this.testcase('Merge multiple js files.', {
    pre: function() {
      tasker.file = path.resolve('./tests/_load_a.js');
      tasker.target = 'taskA1';
    },
    run: function() {
      tasker.load(path.resolve('./tests/_load_a.js'));
      tasker.tree();
      this.match(tasker.log,
'taskA0 (16)\n' +
'taskA1\n' +
'├─taskA0 (10)\n' +
'└─taskB1 (_load_b.js)\n' +
'　├─taskA2\n' +
'　└─taskB0 (_load_b.js:6)\n' +
'taskA2\n' +
'taskA3\n' +
'├─taskA4 <undefined>\n' +
'└─taskB1 (_load_b.js)\n' +
'　├─taskA2\n' +
'　└─taskB0 (_load_b.js:6)\n' +
'taskB0 (_load_b.js:10)\n' +
'taskB1 (_load_b.js)\n' +
'├─taskA2\n' +
'└─taskB0 (_load_b.js:6)\n' +
'');
    }
  });
}, {post:function() {
  console.log(tasker.log);
}});
