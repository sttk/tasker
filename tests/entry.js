'use strict';

var Tasker = require('tasker/src/entry.js');

testsuite('Tasker - A task registry', function() {
  this.testcase('Entry a task with its content.', function() {
    this.scene('Entry tasks', {
      run: function() {
        var tasker = new Tasker();
        tasker.onEntry = function(name, task, num) {
          task.num = (typeof(num) === 'number') ? num : 0;
        };
  
        var task0 = tasker.entry('task-0', 123);
        this.equal(task0, tasker.get('task-0'));
        this.equal(task0.num, 123);
  
        var task1 = tasker.entry('task-1');
        this.equal(task1, tasker.get('task-1'));
        this.equal(task1.num, 0);
      }
    });
    this.scene('Entry tasks twice which has a same name.', {
      run: function() {
        var tasker = new Tasker();
        tasker.onEntry = function(name, task, num) {
          task.num = (typeof(num) === 'number') ? num : 0;
        };
  
        var task0 = tasker.entry('task-0', 123);
        this.equal(task0, tasker.get('task-0'));
        this.equal(task0.num, 123);
  
        var task00 = tasker.entry('task-0', 999);
        this.equal(task0, task00);
        this.equal(task0, tasker.get('task-0'));
        this.equal(task0.num, 999);
      }
    });
    this.scene('Pass second arguments and later.', {
      run: function() {
        var tasker = new Tasker();
        tasker.onEntry = function(name, task) {
          var args = [].slice.call(arguments, 2);
          task.name = name;
          for (var i=0, n=args.length; i<n; i++) {
            task['prop' + i] = args[i];
          }
        };
  
        var task0 = tasker.entry('task-0', 'a', 'b', 'c');
        this.equal(task0.name, 'task-0');
        this.equal(task0.prop0, 'a');
        this.equal(task0.prop1, 'b');
        this.equal(task0.prop2, 'c');
        this.equal(task0.prop3, undefined);
  
        var task1 = tasker.entry('task-1', 'A');
        this.equal(task1.name, 'task-1');
        this.equal(task1.prop0, 'A');
        this.equal(task1.prop1, undefined);
      }
    });
  });
});

