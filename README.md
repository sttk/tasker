# Tasker [![Build Status][travis-image]][travis-url]

[travis-image]: https://travis-ci.org/sttk/tasker.svg?branch=incremental-dev
[travis-url]: https://travis-ci.org/sttk/tasker

A sample program of a task registry.

In this branch, the project adopts incremental development.
The product improved in following stages.

1. [Create and get tasks.](#create_and_get)
2. [Entry a task with its content.](#entry)
3. [Make a tree structure of tasks.](#tree)
4. [List children and descendants.](#listing)
5. [Support forward referece.](#forwardref)

---

## <a name="create_and_get"></a>Create and get tasks.

```js
var Tasker = require('lib/create_and_get.js');
var assert = require('assert');

var tasker = new Tasker();
var task0 = tasker.create('task-0');
assert.strictEqual(tasker.get('task-0'), task0);

// Returns a same task object by a same name.
var task00 = tasker.create('task-0');
assert.strictEqual(tasker.get('task-0'), task00);
assert.strictEqual(task0, task00);
```

## <a name="entry"></a>Entry a task with its content.

```js
var Tasker = require('lib/entry.js');
var assert = require('assert');

var tasker = new Tasker();
tasker.onEntry = function(name, task, num) {
  task.num = (typeof(num) === 'number') ? num : 0;
};

var task0 = tasker.entry('task-0', 123);
assert.strictEqual(task0, tasker.get('task-0'));
assert.equal(task0.num, 123);

var task1 = tasker.entry('task-1');
assert.strictEqual(task1, tasker.get('task-1'));
assert.equal(task1.num, 0);

// Returns a same task by a same name and it is updated with new content.
var task11 = tasker.entry('task-1', 999);
assert.strictEqual(task1, task11);
assert.equal(task1.num, 999);
```

## <a name="tree"></a>Make a tree structure of tasks

```js
var Tasker = require('lib/tree.js');
var assert = require('assert');

var tasker = new Tasker();
tasker.onEntry = function(name, task, disp) {
  task.name = name;
  task.displayName = (disp) ? disp.toString() : name;
};

var task0 = tasker.entry('task-0', null, 'Task #0');
assert.strictEqual(task0, tasker.get('task-0'));
assert.equal(task0.displayName, 'Task #0');
assert.equal(task0._childs.length, 0);

var task1 = tasker.entry('task-1', []);
assert.strictEqual(task1, tasker.get('task-1'));
assert.equal(task1.displayName, 'task-1');
assert.equal(task1._childs.length, 0);

var task2 = tasker.entry('task-2', ['task-1', 'task-0'], 'Task #2');
assert.strictEqual(task2, tasker.get('task-2'));
assert.equal(task2.displayName, 'Task #2');
assert.equal(task2._childs.length, 2);
assert.equal(task2._childs[0], task1);
assert.equal(task2._childs[1], task0);

// Returns a same task by a same name and it is updated with new content.
var task22 = tasker.entry('task-2', [], 'Task #22');
assert.strictEqual(task2, task22);
assert.equal(task2.displayName, 'Task #22');
assert.equal(task2._childs.length, 0);

// Throws an error if a non-existent task name is specified as a child.
var task3;
try {
  task3 = tasker.entry('task-3', ['task-4'], 'Task #3');
  assert.fail();
} catch (e) {
  assert.equal(tasker.get('task-3'), null);
  assert.equal(tasker.get('task-4'), null);
}
```

## <a name="listing"></a>List children and descendants.

```js
var Tasker = require('lib/tree.js');
var Task = require('lib/listing.js');
var assert = require('assert');

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
tasker.entry('task-7', ['task-0', 'task-6', 'task-5'], 'Task #7 <#0,#6,#5>');

var s = '';
tasker.get('task-7').forEachChild(function(each, a, b) {
  s += each.element.name + '[' + each.index + '/' + each.count + ']:';
  s += a + ':' + b + '\n';
}, 'A', 'B');
console.log(s);
// The above code displays as follows:
// task-0[0/3]:A:B
// task-6[1/3]:A:B
// task-5[2/3]:A:B

s = tasker.get('task-7').displayName + '\n';
tasker.get('task-7').forEachDescendant(function(each) {
  s += '  '.repeat(each.depth) + each.element.displayName;
  s += ' [' + each.index + '/' + each.count + ',' + each.depth + ']\n';
});
console.log(s);
// The above code displays as follows:
// Task #7 <#0,#6,#5>
//   Task #0 [0/3,1]
//   Task #6 <#4> [1/3,1]
//     Task #4 [0/1,2]
//   Task #5 <#2,#3> [2/3,1]
//     Task #2 [0/2,2]
//     Task #3 [1/2,2]

s = tasker.get('task-7').displayName + '\n';
var fn = function(each, depth, indent) {
  var task = each.element;
  s += indent + ' |\n';
  s += indent + ' +-' + task.displayName + '\n';
  indent += (each.index === each.count - 1) ? '   ' : ' | ';
  task.forEachChild(fn, depth + 1, indent);
};
tasker.get('task-7').forEachChild(fn, 0, '');
console.log(s);
// The above code displays as follows:
// Task #7 <#0,#6,#5>
//  |
//  +-Task #0
//  |
//  +-Task #6 <#4>
//  |  |
//  |  +-Task #4
//  |
//  +-Task #5 <#2,#3>
//     |
//     +-Task #2
//     |
//     +-Task #3
```
### <a name="forwardref"></a> Support forward referece.

```js
var Tasker = require('./lib/forwardref.js');
var assert = require('assert');

var task0 = tasker.entry('task-0', ['task-1'], 'Task #0');
var task1 = tasker.get('task-1');
this.equal(task0.name, 'task-0');
this.equal(task0.displayName, 'Task #0');
this.equal(task0._childs.length, 1);
this.equal(task0._childs[0], task1);
this.equal(task1._undefined, 'task-1');
this.equal(task1._childs, undefined);
this.equal(tasker._needed['task-0'], undefined);
this.equal(tasker._needed['task-1'], task1);

var newTask = tasker.entry('task-1', [], 'Task #1');
this.equal(task1, newTask);
this.equal(task1.name, 'task-1');
this.equal(task1.displayName, 'Task #1');
this.equal(task0._childs.length, 1);
this.equal(task0._childs[0], task1);
this.equal(task1._undefined, undefined);
this.equal(task1._childs.length, 0);
this.equal(tasker._needed['task-0'], undefined);
this.equal(tasker._needed['task-1'], undefined);
```

## License

Copyright © Takayuki Sato.

Tasker is free software under [MIT](<http://opensource.org/licenses/MIT>) License.
