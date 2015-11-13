# Tasker

A sample program of a task registry.

1. [Create and get tasks.](#create_and_get)

---

## <a name="create_and_get"></a>Create and get tasks.

<pre class="js">
var Tasker = require('src/01_create_and_get.js');
var assert = require('assert');

var tasker = new Tasker();
var task0 = tasker.create('task-0');
assert.strictEqual(tasker.get('task-0'), task0);

var task00 = tasker.create('task-0');
assert.strictEqual(tasker.get('task-0'), task00);
assert.strictEqual(task0, task00);
</pre>

## License

Copyright © Takayuki Sato.

Tasker is free software under [MIT](<http://opensource.org/licenses/MIT>) License.
