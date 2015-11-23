'use strict';

var path = require('path');
var tasker = require(path.resolve('./lib/needed.js'));

testsuite('Tasker - A task registry', function() {
  this.testcase('Merge multiple js files.', {
    pre: function() {
      tasker.file = path.resolve('./tests/_needed2_a.js');
      tasker.target = 'taskA0';
    },
    run: function() {
      tasker.load(tasker.file);
      tasker.tree();
      this.match(tasker.log,
      ' ' +
'taskA0 (10)\n' +
'└─taskA3\n' +
'taskA3\n' +
'taskB0 (_load_b.js:10)\n' +
'taskB1 (_load_b.js)\n' +
'├─taskA2 <undefined>\n' +
'└─taskB0 (_load_b.js:6)\n' +
'');
    }
  });
}, {
  post: function() {
    console.log(tasker.log);
  }
});
