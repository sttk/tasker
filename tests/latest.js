'use strict';

var path = require('path');
var tasker = require(path.resolve('./index.js'));

testsuite('Tasker - A task registry', function() {
  this.testcase('Merge multiple js files.', {
    run: function() {
      tasker.load(path.resolve('./tests/_load_a.js'));
      tasker.tree();
      this.match(tasker.log,
'taskA0 (14)\n' +
'taskA1\n' +
'├─taskA0 (8)\n' +
'└─taskB1 (_load_b.js)\n' +
'　├─taskC0 <undefined>\n' +
'　└─taskB0 (_load_b.js:6)\n' +
'taskB0 (_load_b.js:10)\n' +
'taskB1 (_load_b.js)\n' +
'├─taskC0 <undefined>\n' +
'└─taskB0 (_load_b.js:6)\n' +
'');
    }
  });
}, {post:function() {
  console.log(tasker.log);
}});
