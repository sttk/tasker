'use strict';

var path = require('path');
var Tasker = require(path.resolve('./lib/tree.js'));
var Task = require(path.resolve('./lib/listing.js'));

var logs = [];

testsuite('Tasker - A task registry', function() {
  this.testcase('List children and descendants.', function() {
    this.commons({
      tasker: (new function() {
        var tasker = new Tasker();
        tasker.onEntry = function(name, task, disp) {
          task.name = name;
          task.displayName = (disp) ? disp.toString() : name;
        };
        tasker.entry('task-0', null, 'Task #0');
        tasker.entry('task-1', null, 'Task #1');
        tasker.entry('task-2', null, 'Task #2');
        tasker.entry('task-3', null, 'Task #3');
        tasker.entry('task-4', null, 'Task #4');
        tasker.entry('task-5', ['task-2', 'task-3'], 'Task #5 <#2,#3>');
        tasker.entry('task-6', ['task-4'], 'Task #6 <#4>');
        tasker.entry('task-7', ['task-0', 'task-6', 'task-5'],
          'Task #7 <#0,#6,#5>');
        return tasker;
      }())
    }),
    this.scene('Task#forEachChild', {
      run: function() {
        var s = '';
        this.tasker.get('task-7').forEachChild(function(each, a, b) {
          s += each.element.name + '[' + each.index + '/' + each.count + ']:';
          s += a + ':' + b + '\n';
        }, 'A', 'B');
        this.equal(s,
          'task-0[0/3]:A:B\n' +
          'task-6[1/3]:A:B\n' +
          'task-5[2/3]:A:B\n' +
        '');
        logs.push(s);
      }
    });
    this.scene('Task#forEachDescendant', {
      run: function() {
        var s = this.tasker.get('task-7').displayName + '\n';
        this.tasker.get('task-7').forEachDescendant(function(each) {
          s += '  '.repeat(each.depth) + each.element.displayName;
          s += ' [' + each.index + '/' + each.count + ',' + each.depth + ']\n';
        });
        this.equal(s,
          'Task #7 <#0,#6,#5>\n' +
          '  Task #0 [0/3,1]\n' +
          '  Task #6 <#4> [1/3,1]\n' +
          '    Task #4 [0/1,2]\n' +
          '  Task #5 <#2,#3> [2/3,1]\n' +
          '    Task #2 [0/2,2]\n' +
          '    Task #3 [1/2,2]\n' +
          '');
        logs.push(s);
      }
    });
    this.scene('Task#forEachChild (2)', {
      run: function() {
        var s = this.tasker.get('task-7').displayName + '\n';
        var fn =function(each, depth, indent) {
          var task = each.element;
          s += indent + ' |\n';
          s += indent + ' +-' + task.displayName + '\n';
          indent += (each.index === each.count - 1) ? '   ' : ' | ';
          task.forEachChild(fn, depth + 1, indent);
        };
        this.tasker.get('task-7').forEachChild(fn, 0, '');
        this.equal(s,
          'Task #7 <#0,#6,#5>\n' +
          ' |\n' +
          ' +-Task #0\n' +
          ' |\n' +
          ' +-Task #6 <#4>\n' +
          ' |  |\n' +
          ' |  +-Task #4\n' +
          ' |\n' +
          ' +-Task #5 <#2,#3>\n' +
          '    |\n' +
          '    +-Task #2\n' +
          '    |\n' +
          '    +-Task #3\n' +
          '');
        logs.push(s);
      }
    });
  });
}, {post: function() {
  logs.forEach(function(log) { console.log(log); });
}});
