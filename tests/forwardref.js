'use strict';

var Tasker = require('tasker/src/forwardref.js');
var logs = [];

testsuite('Tasker - A task registry', function() {
  this.testcase('Support forward reference', function() {
    this.commons({
      TASKER: null,
      pre: function() {
        var tasker = new Tasker();
        this.TASKER = tasker;
        tasker.onEntry = function(name, task, disp) {
          task.name = name;
          task.displayName = (disp) ? disp.toString() : name;
        };
      },
      post: function() {
        var tasker = this.TASKER;
        tasker.clear();
      }
    });
    this.scene('Entry tasks', {
      entry_nonexistent_children: function() {
        var tasker = this.TASKER;
        var taskE = tasker.entry('task-0', ['task-1', 'task-2'], 'Task #0');
        var task0 = tasker.get('task-0');
        var task1 = tasker.get('task-1');
        var task2 = tasker.get('task-2');
        this.equal(task0, taskE);
        this.equal(task0.name, 'task-0');
        this.equal(task0.displayName, 'Task #0');
        this.equal(task0._undefined, undefined);
        this.equal(task0._childs.length, 2);
        this.equal(task0._childs[0], task1);
        this.equal(task0._childs[1], task2);
        this.equal(task1.name, undefined);
        this.equal(task1.displayName, undefined);
        this.equal(task1._childs, undefined);
        this.equal(task1._undefined, 'task-1');
        this.equal(task2.name, undefined);
        this.equal(task2.displayName, undefined);
        this.equal(task2._childs, undefined);
        this.equal(task2._undefined, 'task-2');
        this.equal(Object.keys(tasker._needed).length, 2);
        this.equal(tasker._needed['task-0'], undefined);
        this.equal(tasker._needed['task-1'], task1);
        this.equal(tasker._needed['task-2'], task2);
      },
      entry_a_task_referenced_by_another_task: function() {
        var tasker = this.TASKER;
        var taskE = tasker.entry('task-1', [], 'Task #1');
        var task0 = tasker.get('task-0');
        var task1 = tasker.get('task-1');
        var task2 = tasker.get('task-2');
        this.equal(taskE, task1);
        this.equal(task0.name, 'task-0');
        this.equal(task0.displayName, 'Task #0');
        this.equal(task0._undefined, undefined);
        this.equal(task0._childs.length, 2);
        this.equal(task0._childs[0], task1);
        this.equal(task0._childs[1], task2);
        this.equal(task1.name, 'task-1');
        this.equal(task1.displayName, 'Task #1');
        this.equal(task1._undefined, undefined);
        this.equal(task1._childs.length, 0);
        this.equal(task2.name, undefined);
        this.equal(task2.displayName, undefined);
        this.equal(task2._childs, undefined);
        this.equal(task2._undefined, 'task-2');
        this.equal(Object.keys(tasker._needed).length, 1);
        this.equal(tasker._needed['task-0'], undefined);
        this.equal(tasker._needed['task-1'], undefined);
        this.equal(tasker._needed['task-2'], task2);
      },
      entry_a_task_which_is_cyclic: function() {
        var tasker = this.TASKER;
        var taskE = tasker.entry('task-2', ['task-0'], 'Task #2');
        var task0 = tasker.get('task-0');
        var task1 = tasker.get('task-1');
        var task2 = tasker.get('task-2');
        this.equal(taskE, task2);
        this.equal(task0.name, 'task-0');
        this.equal(task0.displayName, 'Task #0');
        this.equal(task0._undefined, undefined);
        this.equal(task0._childs.length, 2);
        this.equal(task0._childs[0], task1);
        this.equal(task0._childs[1], task2);
        this.equal(task1.name, 'task-1');
        this.equal(task1.displayName, 'Task #1');
        this.equal(task1._undefined, undefined);
        this.equal(task1._childs.length, 0);
        this.equal(task2.name, 'task-2');
        this.equal(task2.displayName, 'Task #2');
        this.equal(task2._undefined, undefined);
        this.equal(task2._childs.length, 1);
        this.equal(task2._childs[0], task0);
        this.equal(Object.keys(tasker._needed).length, 0);
        this.equal(tasker._needed['task-0'], undefined);
        this.equal(tasker._needed['task-1'], undefined);
        this.equal(tasker._needed['task-2'], undefined);
      },
      entry_same_name_tasks: function() {
        var tasker = this.TASKER;
        var task0 = tasker.get('task-0');
        var task1 = tasker.get('task-1');
        var task2 = tasker.get('task-2');
        var taskE = tasker.entry('task-1', ['task-3'], 'Task #1 (2)');
        var task3 = tasker.get('task-3');
        this.isFalse(taskE == task1);
        var task11 = tasker.get('task-1');
        this.equal(taskE, task11);

        taskE = tasker.entry('task-3', [], 'Task #3');
        this.equal(taskE, task3);

        taskE = tasker.entry('task-4', ['task-1'], 'Task #4');
        var task4 = tasker.get('task-4');
        this.equal(taskE, task4);

        this.equal(task0.name, 'task-0');
        this.equal(task0.displayName, 'Task #0');
        this.equal(task0._undefined, undefined);
        this.equal(task0._childs.length, 2);
        this.equal(task0._childs[0], task1);
        this.equal(task0._childs[1], task2);
        this.equal(task1.name, 'task-1');
        this.equal(task1.displayName, 'Task #1');
        this.equal(task1._undefined, undefined);
        this.equal(task1._childs.length, 0);
        this.equal(task11.name, 'task-1');
        this.equal(task11.displayName, 'Task #1 (2)');
        this.equal(task11._undefined, undefined);
        this.equal(task11._childs.length, 1);
        this.equal(task11._childs[0], task3);
        this.equal(task2.name, 'task-2');
        this.equal(task2.displayName, 'Task #2');
        this.equal(task2._undefined, undefined);
        this.equal(task2._childs.length, 1);
        this.equal(task2._childs[0], task0);
        this.equal(task3.name, 'task-3');
        this.equal(task3.displayName, 'Task #3');
        this.equal(task3._undefined, undefined);
        this.equal(task3._childs.length, 0);
        this.equal(task4.name, 'task-4');
        this.equal(task4.displayName, 'Task #4');
        this.equal(task4._undefined, undefined);
        this.equal(task4._childs.length, 1);
        this.equal(task4._childs[0], task11);
        this.equal(Object.keys(tasker._needed).length, 0);
      },
      for_each_descendant: function() {
        var tasker = this.TASKER;
        var task = tasker.get('task-0');
        var s = '';
        task.forEachDescendant(function(each) {
          var indent = '';
          for (var i=0, n=each.depth; i<n; i++) { indent += '  '; }
          s += indent + each.element.displayName + '\n';
        });
        logs.push(s);
        this.match(s,
'  Task #1\n' +
'  Task #2\n' +
'    Task #0\n' +
'      Task #1\n' +
'');
      },
      for_each_tree_node: function() {
        var tasker = this.TASKER;
        var task = tasker.get('task-0');
        var s = '';
        task.forEachTreeNode(function(each) {
          var indent = '';
          for (var i=0, n=each.depth; i<n; i++) { indent += '  '; }
          s += indent + each.element.displayName + '\n';
        });
        logs.push(s);
        this.match(s,
'Task #0\n' +
'  Task #1\n' +
'  Task #2\n' +
'');
      },
      tree_all_tasks: function() {
        var tasker = this.TASKER;
        var s = '';
        Object.keys(tasker._tasks).sort().forEach(function(name) {
          tasker.get(name).forEachTreeNode(function(each) {
            var indent = '';
            for (var i=0, n=each.depth; i<n; i++) { indent += '  '; }
            s += indent + each.element.displayName + '\n';
          });
        });
        logs.push(s);
        this.match(s,
'Task #0\n' +
'  Task #1\n' +
'  Task #2\n' +
'Task #1 (2)\n' +
'  Task #3\n' +
'Task #2\n' +
'  Task #0\n' +
'    Task #1\n' +
'Task #3\n' +
'Task #4\n' +
'  Task #1 (2)\n' +
'    Task #3\n' +
'');
      },
      run: function() {
        this.entry_nonexistent_children();
        this.entry_a_task_referenced_by_another_task();
        this.entry_a_task_which_is_cyclic();
        this.entry_same_name_tasks();
        this.for_each_descendant();
        this.for_each_tree_node();
        this.tree_all_tasks();
      }
    });
  });
}, {
  post: function() {
    logs.forEach(function(e, i, a) { console.log(e); });
  }
});

