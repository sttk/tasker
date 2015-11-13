'use strict';

var path = require('path');
var Tasker = require(path.resolve('./lib/create_and_get.js'));

testsuite('Tasker - A task registry', function() {
  this.testcase('Create and get tasks.', function() {
    this.scene('Get tasks not created.', {
      run: function() {
        var tasker = new Tasker();
        this.isNull(tasker.get('task-0'));
        this.isNull(tasker.get('task-1'));
      }
    });
    this.scene('Get tasks created.', {
      run: function() {
        var tasker = new Tasker();
        var task0 = tasker.create('task-0');
        var task1 = tasker.create('task-1');
        this.equal(tasker.get('task-0'), task0);
        this.equal(tasker.get('task-1'), task1);
        this.isNull(tasker.get('task-2'));
      }
    });
    this.scene('Not create a task twice which has a same name.', {
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
});
