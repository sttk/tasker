'use strict';

var path = require('path');
var Tasker = require(path.resolve('./lib/forwardref.js'));

testsuite('Tasker - A task registry', function() {
  this.testcase('Support forward reference', function() {
    this.commons({
      newTasker: function() {
        var tasker = new Tasker();
        tasker.onEntry = function(name, task, disp) {
          task.name = name;
          task.displayName = (disp) ? disp.toString() : name;
        };
        return tasker;
      },
      entryTask0: function(tasker) {
        var task0 = tasker.entry('task-0', ['task-1', 'task-2'], 'Task #0');
        var task1 = tasker.get('task-1');
        var task2 = tasker.get('task-2');
        this.equal(task0.name, 'task-0');
        this.equal(task0.displayName, 'Task #0');
        this.equal(task0._childs.length, 2);
        this.equal(task0._childs[0], task1);
        this.equal(task0._childs[1], task2);
        this.equal(task1._undefined, 'task-1');
        this.equal(task1._childs, undefined);
        this.equal(task2._undefined, 'task-2');
        this.equal(task2._childs, undefined);
        this.equal(tasker._needed['task-0'], undefined);
        this.equal(tasker._needed['task-1'], task1);
        this.equal(tasker._needed['task-2'], task2);
      },
      entryTask1: function(tasker) {
        var task0 = tasker.get('task-0');
        var task1 = tasker.get('task-1');
        var task2 = tasker.get('task-2');
        var newTask = tasker.entry('task-1', [], 'Task #1');
        this.equal(task1, newTask);
        this.equal(task1.name, 'task-1');
        this.equal(task1.displayName, 'Task #1');
        this.equal(task0._childs.length, 2);
        this.equal(task0._childs[0], task1);
        this.equal(task0._childs[1], task2);
        this.equal(task1._undefined, undefined);
        this.equal(task1._childs.length, 0);
        this.equal(task2._undefined, 'task-2');
        this.equal(task2._childs, undefined);
        this.equal(tasker._needed['task-0'], undefined);
        this.equal(tasker._needed['task-1'], undefined);
        this.equal(tasker._needed['task-2'], task2);
      },
      entryTask2: function(tasker) {
        var task0 = tasker.get('task-0');
        var task1 = tasker.get('task-1');
        var task2 = tasker.get('task-2');
        var newTask =  tasker.entry('task-2', ['task-1','task-3'], 'Task #2');
        this.equal(task2, newTask);
        var task3 = tasker.get('task-3');
        this.equal(task2.name, 'task-2');
        this.equal(task2.displayName, 'Task #2');
        this.equal(task0._childs.length, 2);
        this.equal(task0._childs[0], task1);
        this.equal(task0._childs[1], task2);
        this.equal(task1._undefined, undefined);
        this.equal(task1._childs.length, 0);
        this.equal(task2._undefined, undefined);
        this.equal(task2._childs.length, 2);
        this.equal(task2._childs[0], task1);
        this.equal(task2._childs[1], task3);
        this.equal(task3._undefined, 'task-3');
        this.equal(task3._childs, undefined);
        this.equal(tasker._needed['task-0'], undefined);
        this.equal(tasker._needed['task-1'], undefined);
        this.equal(tasker._needed['task-2'], undefined);
        this.equal(tasker._needed['task-3'], task3);
      },
      entryTask3: function(tasker) {
        var task0 = tasker.get('task-0');
        var task1 = tasker.get('task-1');
        var task2 = tasker.get('task-2');
        var task3 = tasker.get('task-3');
        var newTask = tasker.entry('task-3', [], 'Task #3');
        this.equal(task3.name, 'task-3');
        this.equal(task3.displayName, 'Task #3');
        this.equal(task0._childs.length, 2);
        this.equal(task0._childs[0], task1);
        this.equal(task0._childs[1], task2);
        this.equal(task1._undefined, undefined);
        this.equal(task1._childs.length, 0);
        this.equal(task2._undefined, undefined);
        this.equal(task2._childs.length, 2);
        this.equal(task2._childs[0], task1);
        this.equal(task2._childs[1], task3);
        this.equal(task3._undefined, undefined);
        this.equal(task3._childs.length, 0);
        this.equal(tasker._needed['task-0'], undefined);
        this.equal(tasker._needed['task-1'], undefined);
        this.equal(tasker._needed['task-2'], undefined);
        this.equal(tasker._needed['task-3'], undefined);
      },
    });
    this.scene('Entry a task with non-existent children.', {
      run: function() {
        var tasker = this.newTasker();
        this.entryTask0(tasker);
      }
    });
    this.scene('Entry a task which does not exist.', {
      run: function() {
        var tasker = this.newTasker();
        this.entryTask0(tasker);
        this.entryTask1(tasker);
      }
    });
    this.scene('Entry a task which does not exist and has children.', {
      run: function() {
        var tasker = this.newTasker();
        this.entryTask0(tasker);
        this.entryTask1(tasker);
        this.entryTask2(tasker);
        this.entryTask3(tasker);
      }
    });
  });
});

