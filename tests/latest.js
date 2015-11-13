'use strict';

var path = require('path');
var Tasker = require(path.resolve('./index.js'));

testsuite('Create and get', function() {
  this.testcase('Get tasks not created.', {
    run: function() {
      var tasker = new Tasker();
      this.isNull(tasker.get('task-0'));
      this.isNull(tasker.get('task-1'));
    }
  });
  this.testcase('Get tasks created.', {
    run: function() {
      var tasker = new Tasker();
      var task0 = tasker.create('task-0');
      var task1 = tasker.create('task-1');
      this.equal(tasker.get('task-0'), task0);
      this.equal(tasker.get('task-1'), task1);
      this.isNull(tasker.get('task-2'));
    }
  });
  this.testcase('Not create a task which has duplicated name', {
    run: function() {
      var tasker = new Tasker();
      var task0 = tasker.create('task-0');
      this.equal(tasker.get('task-0'), task0);
      var task00 = tasker.create('task-0');
      this.equal(tasker.get('task-0'), task00);
      this.equal(task0, task00);
    }
  });
});
