'use strict';

var Tasker = require('tasker/src/listing.js');
var logs = [];

testsuite('Tasker - A task registry', function() {
  this.testcase('List children and descendants.', function() {
    this.commons({
      TASKER: new Tasker(),
      pre: function() {
        var tasker = new Tasker();
        this.TASKER = tasker;
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
      },
      post: function() {
        var tasker = this.TASKER;
        tasker.clear();
      }
    }),
    this.scene('Task#forEachChild', {
      run: function() {
        var tasker = this.TASKER;
        var s = '';
        tasker.get('task-7').forEachChild(function(each, a, b) {
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
    this.scene('Task#forEachChild (recursively)', {
      run: function() {
        var tasker = this.TASKER;
        var s = tasker.get('task-7').displayName + '\n';
        var fn =function(each, depth, indent) {
          var task = each.element;
          s += indent + ' |\n';
          s += indent + ' +-' + task.displayName + '\n';
          indent += (each.index === each.count - 1) ? '   ' : ' | ';
          task.forEachChild(fn, depth + 1, indent);
        };
        tasker.get('task-7').forEachChild(fn, 0, '');
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
    this.scene('Task#forEachDescendant', {
      run: function() {
        var tasker = this.TASKER;
        var s = tasker.get('task-7').displayName + '\n';
        tasker.get('task-7').forEachDescendant(function(each) {
          for (var i=0, n=each.depth; i<n; i++) { s += '  '; }
          s += each.element.displayName;
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
    this.scene('Task#forEachDescendant -2', {
      run: function() {
        var tasker = this.TASKER;
        var s = tasker.get('task-7').displayName + '\n';
        var fn =function(each, indents) {
          if (each.index === each.count - 1) {
            indents[each.depth] = indents[each.depth - 1] + '   ';
          } else {
            indents[each.depth] = indents[each.depth - 1] + ' | ';
          }
          var task = each.element;
          var indent = indents[each.depth - 1];
          s += indent + ' |\n';
          s += indent + ' +-' + task.displayName + '\n';
        };
        tasker.get('task-7').forEachDescendant(fn, ['']);
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
