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
6. [Merge multiple js files.](#load)
7. [Entry only tasks needed.](#needed)
8. [Namespace for tasks in merged files.](#namespace)

---

## <a name="create_and_get"></a>Create and get tasks.

```js
var Tasker = require('tasker/src/create_and_get.js');
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
var Tasker = require('tasker/src/entry.js');
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
var Tasker = require('tasker/src/tree.js');
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
var Tasker = require('tasker/src/listing.js');
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
// 

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
// 

s = '';
tasker.get('task-7').forEachTreeNode(function(each) {
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
// 
```

### <a name="forwardref"></a> Support forward referece.

```js
var Tasker = require('tasker/src/forwardref.js');
var assert = require('assert');

var tasker = new Tasker();
tasker.onEntry = function(name, task, disp) {
  task.name = name;
  task.displayName = (disp) ? disp.toString() : name;
};

tasker.entry('task-0', ['task-1', 'task-2'], 'Task #0');
tasker.entry('task-1', [], 'Task #1');
tasker.entry('task-2', [], 'Task #2');
tasker.entry('task-1', [], 'Task #1 (2)');
tasker.entry('task-3', ['task-1'], 'Task #3');

var s = '';
Object.keys(tasker._tasks).sort().forEach(function(name) {
  tasker.get(name).forEachTreeNode(function(each) {
    s += '  '.repeat(each.depth) + each.element.displayName + '\n';
  });
});
console.log(s);
// The above code displays as follows:
// Task #0
//   Task #1
//   Task #2
// Task #1 (2)
// Task #2
// Task #3
//   Task #1 (2)
// 
```

## <a name="load"></a>Merge multiple js files.

```js
// ./tests/load/loadedA.js
var tasker = require('tasker/src/load1.js');
tasker.entry('taskA0', []);
tasker.entry('taskA3', ['taskA4','taskB1']);
tasker.entry('taskA0', []);
tasker.entry('taskA1', ['taskA0', 'taskB1']);
tasker.load('./loadedB.js');
tasker.entry('taskA0', []);
tasker.entry('taskA2');
tasker.entry('taskA4', ['taskC0']);
tasker.entry('taskA5', []);
```

```js
// ./tests/load/loadedB.js
var tasker = require('tasker/src/load1.js');
tasker.entry('taskB0');
tasker.entry('taskB1', ['taskC0', 'taskB0']);
tasker.entry('taskB0');
```

```js
var tasker = require('tasker/src/load1.js');
var Lineno = require('tasker/src/lib/lineno.js');
tasker._lineno = new Lineno('./tests/load/loadedA.js');
tasker.load(tasker._lineno.file());
console.log(tasker.tree());

// The above code displays as follows:
// Task A0 [3] (8)
// Task A1
// ├─Task A0 [2] (5)
// └─Task B1 (loadedB.js)
// 　├─taskA2
// 　└─Task B0 [1] (loadedB.js:3)
// taskA2
// Task A3
// ├─Task A4
// │ └─taskC0 <undefined>
// └─Task B1 (loadedB.js)
// 　├─taskA2
// 　└─Task B0 [1] (loadedB.js:3)
// Task A4
// └─taskC0 <undefined>
// taskA5
// Task B0 [2] (loadedB.js:5)
// Task B1 (loadedB.js)
// ├─taskA2
// └─Task B0 [1] (loadedB.js:3)
// 
```

## <a name="needed"></a>Entry only tasks needed.

```js
// ./tests/needed/loadedA3.js
var tasker = require('tasker/src/needed1.js');
tasker.entry('taskA0', ['taskA2'], 'Task A0 [1]);
tasker.entry('taskA3', ['taskA4','taskB1'], 'Task A3');
tasker.entry('taskA0', [], 'Task A0 [2]);
tasker.entry('taskA2');
tasker.entry('taskA1', ['taskA0', 'taskB1'], 'Task A1');
tasker.load('./loadedB3.js');
tasker.entry('taskA0', [], 'Task A0 [3]);
tasker.entry('taskA4', ['taskC0'], 'Task A4');
tasker.entry('taskA5');
```

```js
// ./tests/needed/loadedB3.js
var tasker = require('tasker/src/needed1.js');
tasker.entry('taskB0', null, 'Task B0 [1]');
tasker.entry('taskB1', ['taskC0', 'taskB0'], 'Task B1');
tasker.entry('taskB0', null, 'Task B0 [2]');
```

```js
var tasker = require('tasker/src/needed1.js');
var Lineno = require('tasker/src/lib/lineno.js');
tasker._lineno = new Lineno('./tests/needed/loadedA3.js');
tasker.target = 'taskA0';
tasker.load(tasker._lineno.file());
console.log(tasker.tree());

// The above code displays as follows:
// (!) On top level, a first task is given priority.
// (!) taskA4, taskA5, tasks in loadedB3.js are ignored.
// Task A0 [1] (3)
// └─taskA2
// taskA2
// Task A3
// ├─taskA4 <undefined>
// └─taskB1 <undefined>
// 
```

## <a name="namespace"></a>Namespace for tasks in merged files.

```js
// ./tests/namespace/loadedA.js
var tasker = require('tasker/src/namespace1.js');
tasker.entry('taskA0', ['taskA1', 'taskA2']);
tasker.load('./loadedB.js', 'bbb');
tasker.entry('taskA1', ['taskB0@bbb']);
tasker.entry('taskA2', ['taskC0@XXX@bbb']);
tasker.entry('taskA3', ['taskC0@bbb']);
```

```js
// ./tests/namespace/loadedB.js
var tasker = require('tasker/src/namespace1.js');
tasker.entry('taskB0', ['taskC0', 'taskC0@XXX']);
tasker.load('./loadedC.js');
tasker.load('./loadedC.js', 'XXX');
```

```js
// ./tests/namespace/loadedC.js
var tasker = require('tasker/src/namespace1.js');
tasker.entry('taskC0');
```

```js
var tasker = require('tasker/src/namespace1.js');
var Lineno = require('tasker/src/lib/lineno.js');
tasker._lineno = new Lineno('./tests/namespace/loadedA3.js');
tasker.load(tasker._lineno.file());
console.log(tasker.tree());

// The above code displays as follows:
// taskA0
// ├─taskA1
// │ └─taskB0@bbb (loadedB.js)
// │ 　├─taskC0@bbb (loadedC.js)
// │ 　└─taskC0@XXX@bbb (loadedC.js)
// └─taskA2
// 　└─taskC0@XXX@bbb (loadedC.js)
// taskA1
// └─taskB0@bbb (loadedB.js)
// 　├─taskC0@bbb (loadedC.js)
// 　└─taskC0@XXX@bbb (loadedC.js)
// taskA2
// └─taskC0@XXX@bbb (loadedC.js)
// taskA3
// └─taskC0@bbb (loadedC.js)
// taskB0@bbb (loadedB.js)
// ├─taskC0@bbb (loadedC.js)
// └─taskC0@XXX@bbb (loadedC.js)
// taskC0@XXX@bbb (loadedC.js)
// taskC0@bbb (loadedC.js)
// 
```

## License

Copyright © Takayuki Sato.

Tasker is free software under [MIT](<http://opensource.org/licenses/MIT>) License.
