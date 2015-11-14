'use strict';

var Tasker = require('./entry.js');

Tasker.prototype.put = Tasker.prototype.entry;

Tasker.prototype.entry = function(name, childNames) {
  var args = [].slice.call(arguments, 2);
  var childTasks = this.parseChilds(childNames);
  var task = this.put.apply(this, [name].concat(args));
  task._childs = childTasks;
  return task;
};

Tasker.prototype.parseChilds = function(names) {
  var arr = [];
  if (names == null) { return arr; }
  if (!Array.isArray(names)) {
    throw new TypeError('The child task names must be specified in an array.');
  }
  for (var i=0, n=names.length; i<n; i++) {
    if (typeof(names[i]) !== 'string') {
      throw new TypeError('The child task name is not a string.: ' + names[i]);
    }
    var child = this._tasks[names[i]];
    if (!child) { child = this.processUndefinedChild(names[i]); }
    if (child) { arr.push(child); }
  }
  return arr;
};

Tasker.prototype.processUndefinedChild = function(name) {
  throw new Error('The child task does not exist: ' + name);
};

module.exports = Tasker;
