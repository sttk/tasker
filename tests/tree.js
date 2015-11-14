'use strict';

var path = require('path');
var Tasker = require(path.resolve('./lib/tree.js'));


testsuite('Tasker - A task registry', function() {
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
