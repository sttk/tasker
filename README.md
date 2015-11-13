# Tasker [![Build Status][travis-image]][travis-url]

[travis-image]: https://travis-ci.org/sttk/tasker.svg?branch=incremental-dev
[travis-url]: https://travis-ci.org/sttk/tasker

A sample program of a task registry.

1. [Create and get tasks.](#create_and_get)
2. [Entry a task with its content.](#entry)

---

## <a name="create_and_get"></a>Create and get tasks.

<div class="highlight highlight-source-js"><pre>
var Tasker = require('lib/create_and_get.js');
var assert = require('assert');

var tasker = new Tasker();
var task0 = tasker.create('task-0');
assert.strictEqual(tasker.get('task-0'), task0);

var task00 = tasker.create('task-0');
assert.strictEqual(tasker.get('task-0'), task00);
assert.strictEqual(task0, task00);
</pre></div>

## <a name="entry"></a>Entry a task with its content.

<div class="highlight highlight-source-js"><pre>
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

var task11 = tasker.entry('task-1', 999);
assert.strictEqual(task1, task11);
assert.equal(task1.num, 999);
</pre></div>

## License

Copyright © Takayuki Sato.

Tasker is free software under [MIT](<http://opensource.org/licenses/MIT>) License.
