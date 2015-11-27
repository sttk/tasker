'use strict';

var Task = require('tasker/src/task.js');

testsuite('Tests of Task', function() {
  this.testcase('#Constructor', function() {
    this.scene('no argument', {
      run:function() {
        try {
          var task = new Task();
          this.fail();
        } catch (e) {
          this.pass(e);
        }
      }
    });
    this.scene('no child, no filename, no lineno', {
      run:function() {
        var task = new Task('task0');
        this.equal(task.name, 'task0');
        this.isNull(task._childs);
        this.isNull(task.filename);
        this.isNull(task.lineno);
        this.equal(task._defined[0], 0);
      }
    });
    this.scene('full arguments, but childs is empty', {
      run:function() {
        var task = new Task('task0', [], 'aaa', 10);
        this.equal(task.name, 'task0');
        this.equal(task._childs.length, 0);
        this.equal(task.filename, 'aaa');
        this.equal(task.lineno, 10);
        this.equal(task._defined[0], 0);
      }
    });
    this.scene('full arguments, and childs is not empty', {
      run:function() {
        var obj1 = {}, obj2 = {};
        var task = new Task('task0', [obj1, obj2], 'aaa', 10);
        this.equal(task.name, 'task0');
        this.equal(task._childs.length, 2);
        this.equal(task._childs[0], obj1);
        this.equal(task._childs[1], obj2);
        this.equal(task.filename, 'aaa');
        this.equal(task.lineno, 10);
        this.equal(task._defined[0], 0);
      }
    });
  });
  this.testcase('#CopyConstructor', function() {
    this.scene('no argument', {
      run:function() {
        try {
          var task = new Task();
          this.fail();
        } catch (e) {
          this.pass(e);
        }
      }
    });
    this.scene('no child, no filename, no lineno', {
      run:function() {
        var task0 = new Task('task0');
        var task1 = new Task(task0);
        this.equal(task1.name, 'task0');
        this.isNull(task1._childs);
        this.isNull(task1.filename);
        this.isNull(task1.lineno);
        this.equal(task1._defined[0], 1);
        var task2 = new Task(task1);
        this.equal(task2.name, 'task0');
        this.isNull(task2._childs);
        this.isNull(task2.filename);
        this.isNull(task2.lineno);
        this.equal(task2._defined[0], 2);
      }
    });
    this.scene('full arguments, but childs is empty', {
      run:function() {
        var obj1 = {};
        var task0 = new Task('task0', [obj1], 'aaa', 10);
        var task1 = new Task(task0, [], 'bbb', 20);
        this.equal(task1.name, 'task0');
        this.equal(task1._childs.length, 0);
        this.equal(task1.filename, 'bbb');
        this.equal(task1.lineno, 20);
        this.equal(task1._defined[0], 1);
      }
    });
    this.scene('full arguments, and childs is not empty', {
      run:function() {
        var obj1 = {}, obj2 = {}, obj3 = {};
        var task0 = new Task('task0', [obj1], 'aaa', 10);
        var task1 = new Task(task0, [obj2, obj3], 'bbb', 20);
        this.equal(task1.name, 'task0');
        this.equal(task1._childs.length, 2);
        this.equal(task1._childs[0], obj2);
        this.equal(task1._childs[1], obj3);
        this.equal(task1.filename, 'bbb');
        this.equal(task1.lineno, 20);
        this.equal(task1._defined[0], 1);
      }
    });
  });
  this.testcase('#forEachChild', function() {
    this.scene('no child', {
      run: function() {
        var task = new Task('task0', []);
        task.forEachChild(function() {
          this.fail();
        });
        this.pass();
      }
    });
    this.scene('has children', {
      run: function() {
        var task0 = new Task('task0', []);
        var task1 = new Task('task1', []);
        var task2 = new Task('task2', [task1, task0]);
        var logs = [];
        task2.forEachChild(function(each) {
          var s = each.element.name + ':' + each.index + '/' + each.count;
          logs.push(s);
        });
        this.equal(logs.length, 2);
        this.equal(logs[0], "task1:0/2");
        this.equal(logs[1], "task0:1/2");
      }
    });
    this.scene('grandchild is not a target', {
      run: function() {
        var task0 = new Task('task0', []);
        var task1 = new Task('task1', [task0]);
        var task2 = new Task('task2', [task1]);
        var logs = [];
        task2.forEachChild(function(each) {
          var s = each.element.name + ':' + each.index + '/' + each.count;
          logs.push(s);
        });
        this.equal(logs.length, 1);
        this.equal(logs[0], "task1:0/1");
      }
    });
  });
  this.testcase('#forEachDescendant', function() {
    this.scene('no child', {
      run:function() {
        var task = new Task('task0', []);
        task.forEachDescendant(function() {
          this.fail();
        });
        this.pass();
      }
    });
    this.scene('has child', {
      run:function() {
        var self = this;
        var task0 = new Task('task0', []);
        var task1 = new Task('task1', []);
        var task2 = new Task('task2', [task0, task1]);
        var logs = [];
        task2.forEachDescendant(function(each) {
          var s = self.format('{1}:{2}/{3}:{4}',
            each.element.name, each.index, each.count, each.depth);
          logs.push(s);
        });
        this.equal(logs.length, 2);
        this.equal(logs[0], "'task0':0/2:1", logs[0]);
        this.equal(logs[1], "'task1':1/2:1", logs[1]);
      }
    });
    this.scene('has grandchild', {
      run:function() {
        var self = this;
        var task0 = new Task('task0', []);
        var task1 = new Task('task1', []);
        var task2 = new Task('task2', [task0, task1]);
        var task3 = new Task('task3', []);
        var task4 = new Task('task4', []);
        var task5 = new Task('task5', [task4, task3]);
        var task6 = new Task('task6', [task2, task5]);
        var logs = [];
        task6.forEachDescendant(function(each) {
          var s = self.format('{1}:{2}/{3}:{4}',
            each.element.name, each.index, each.count, each.depth);
          logs.push(s);
        });
        this.equal(logs.length, 6, logs.length);
        this.equal(logs[0], "'task2':0/2:1", logs[0]);
        this.equal(logs[1], "'task0':0/2:2", logs[1]);
        this.equal(logs[2], "'task1':1/2:2", logs[2]);
        this.equal(logs[3], "'task5':1/2:1", logs[3]);
        this.equal(logs[4], "'task4':0/2:2", logs[4]);
        this.equal(logs[5], "'task3':1/2:2", logs[5]);
      }
    });
    this.scene('not cyclic', {
      run:function() {
        var self = this;
        var task0 = new Task('task0', []);
        var task1 = new Task('task1', []);
        var task2 = new Task('task2', [task0, task1]);
        var task3 = new Task('task3', [task2]);
        task0._childs.push(task3);
        task1._childs.push(task3);
        var logs = [];
        task3.forEachDescendant(function(each) {
          var s = self.format('{1}:{2}/{3}:{4}',
            each.element.name, each.index, each.count, each.depth);
          logs.push(s);
        });
        this.equal(logs.length, 5, logs.length);
        this.equal(logs[0], "'task2':0/1:1", logs[0]);
        this.equal(logs[1], "'task0':0/2:2", logs[1]);
        this.equal(logs[2], "'task3':0/1:3", logs[2]);
        this.equal(logs[3], "'task1':1/2:2", logs[3]);
        this.equal(logs[4], "'task3':0/1:3", logs[4]);
      }
    });
  });
  this.testcase('#forEachTreeNode', function() {
    this.scene('no child', {
      run:function() {
        var self = this;
        var task = new Task('task0', []);
        var logs = [];
        task.forEachTreeNode(function(each) {
          var s = self.format('{1}:{2}/{3}:{4}',
            each.element.name, each.index, each.count, each.depth);
          logs.push(s);
        });
        this.equal(logs.length, 1, logs.length);
        this.equal(logs[0], "'task0':0/1:0", logs[0]);
      }
    });
    this.scene('has child', {
      run:function() {
        var self = this;
        var task0 = new Task('task0', []);
        var task1 = new Task('task1', []);
        var task2 = new Task('task2', [task0, task1]);
        var logs = [];
        task2.forEachTreeNode(function(each) {
          var s = self.format('{1}:{2}/{3}:{4}',
            each.element.name, each.index, each.count, each.depth);
          logs.push(s);
        });
        this.equal(logs.length, 3);
        this.equal(logs[0], "'task2':0/1:0", logs[0]);
        this.equal(logs[1], "'task0':0/2:1", logs[1]);
        this.equal(logs[2], "'task1':1/2:1", logs[2]);
      }
    });
    this.scene('has grandchild', {
      run:function() {
        var self = this;
        var task0 = new Task('task0', []);
        var task1 = new Task('task1', []);
        var task2 = new Task('task2', [task0, task1]);
        var task3 = new Task('task3', []);
        var task4 = new Task('task4', []);
        var task5 = new Task('task5', [task4, task3]);
        var task6 = new Task('task6', [task2, task5]);
        var logs = [];
        task6.forEachTreeNode(function(each) {
          var s = self.format('{1}:{2}/{3}:{4}',
            each.element.name, each.index, each.count, each.depth);
          logs.push(s);
        });
        this.equal(logs.length, 7, logs.length);
        this.equal(logs[0], "'task6':0/1:0", logs[0]);
        this.equal(logs[1], "'task2':0/2:1", logs[1]);
        this.equal(logs[2], "'task0':0/2:2", logs[2]);
        this.equal(logs[3], "'task1':1/2:2", logs[3]);
        this.equal(logs[4], "'task5':1/2:1", logs[4]);
        this.equal(logs[5], "'task4':0/2:2", logs[5]);
        this.equal(logs[6], "'task3':1/2:2", logs[6]);
      }
    });
    this.scene('not cyclic', {
      run:function() {
        var self = this;
        var task0 = new Task('task0', []);
        var task1 = new Task('task1', []);
        var task2 = new Task('task2', [task0, task1]);
        var task3 = new Task('task3', [task2]);
        task0._childs.push(task3);
        task1._childs.push(task3);
        var logs = [];
        task3.forEachTreeNode(function(each) {
          var s = self.format('{1}:{2}/{3}:{4}',
            each.element.name, each.index, each.count, each.depth);
          logs.push(s);
        });
        this.equal(logs.length, 4, logs.length);
        this.equal(logs[0], "'task3':0/1:0", logs[0]);
        this.equal(logs[1], "'task2':0/1:1", logs[1]);
        this.equal(logs[2], "'task0':0/2:2", logs[2]);
        this.equal(logs[3], "'task1':1/2:2", logs[3]);
      }
    });
  });
});
