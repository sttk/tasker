'use strict';

var path = require('path');
var Tasker = require(path.resolve('./index.js'));

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
  this.testcase('Entry a task with its content.', function() {
    this.scene('Entry tasks', {
      run: function() {
        var tasker = new Tasker();
        tasker.onEntry = function(name, task, num) {
          task.num = (typeof(num) === 'number') ? num : 0;
        };
  
        //var task0 = tasker.entry('task-0', 123);
        var task0 = tasker.entry('task-0', null, 123);
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
  
        //var task0 = tasker.entry('task-0', 123);
        var task0 = tasker.entry('task-0', [], 123);
        this.equal(task0, tasker.get('task-0'));
        this.equal(task0.num, 123);
  
        //var task00 = tasker.entry('task-0', 999);
        var task00 = tasker.entry('task-0', [], 999);
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
  
        //var task0 = tasker.entry('task-0', 'a', 'b', 'c');
        var task0 = tasker.entry('task-0', [], 'a', 'b', 'c');
        this.equal(task0.name, 'task-0');
        this.equal(task0.prop0, 'a');
        this.equal(task0.prop1, 'b');
        this.equal(task0.prop2, 'c');
        this.equal(task0.prop3, undefined);
  
        //var task1 = tasker.entry('task-1', 'A');
        var task1 = tasker.entry('task-1', [], 'A');
        this.equal(task1.name, 'task-1');
        this.equal(task1.prop0, 'A');
        this.equal(task1.prop1, undefined);
      }
    });
  });
  this.testcase('Make a tree structure of tasks', function() {
    this.commons({
      newTasker: function() {
        var tasker = new Tasker();
        tasker.onEntry = function(name, task, disp) {
          task.name = name;
          task.displayName = (disp) ? disp.toString() : name;
        };
        return tasker;
      }
    }),
    this.scene('Entry tasks with/without children.', {
      run: function() {
        var tasker = this.newTasker();

        var task0 = tasker.entry('task-0', null, 'Task #0');
        this.equal(task0, tasker.get('task-0'));
        this.equal(task0.displayName, 'Task #0');
        this.equal(task0._childs.length, 0);

        var task1 = tasker.entry('task-1', []);
        this.equal(task1, tasker.get('task-1'));
        this.equal(task1.displayName, 'task-1');
        this.equal(task1._childs.length, 0);

        var task2 = tasker.entry('task-2', ['task-1', 'task-0'], 'Task #2');
        this.equal(task2, tasker.get('task-2'));
        this.equal(task2.displayName, 'Task #2');
        this.equal(task2._childs.length, 2);
        this.equal(task2._childs[0], task1);
        this.equal(task2._childs[1], task0);
      }
    });
    this.scene('Entry a task with a same name and update its content.', {
      run: function() {
        var tasker = this.newTasker();

        var task0 = tasker.entry('task-0', null, 'Task #0');
        this.equal(task0, tasker.get('task-0'));
        this.equal(task0.displayName, 'Task #0');
        this.equal(task0._childs.length, 0);

        var task1 = tasker.entry('task-1', []);
        this.equal(task1, tasker.get('task-1'));
        this.equal(task1.displayName, 'task-1');
        this.equal(task1._childs.length, 0);

        var task2 = tasker.entry('task-2', ['task-1', 'task-0'], 'Task #2');
        this.equal(task2, tasker.get('task-2'));
        this.equal(task2.displayName, 'Task #2');
        this.equal(task2._childs.length, 2);
        this.equal(task2._childs[0], task1);
        this.equal(task2._childs[1], task0);

        var task22 = tasker.entry('task-2', [], 'Task #22');
        this.equal(task2, task22);
        this.equal(task2.displayName, 'Task #22');
        this.equal(task2._childs.length, 0);
      }
    });
    this.scene('Throw an error if a child task name is not found.', {
      run: function() {
        var tasker = this.newTasker();
        try {
          var task3 = tasker.entry('task-3', ['task-4'], 'Task #3');
          this.fail();
        } catch (e) {
          this.isNull(tasker.get('task-3'));
          this.isNull(tasker.get('task-4'));
        }
      }
    });
  });
});
