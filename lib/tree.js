'use strict';

var Tasker = require('./entry.js');

Tasker.prototype.findChildForEntry = function(name) {
  if (typeof(name) !== 'string') {
    throw new TypeError('The child task name is not a string.');
  }
  var child = this._tasks[name];
  if (!child) {
    throw new Error('The child task does not exist: ' + name);
  }
  return child;
}

var originalEntry = Tasker.prototype.entry;
Tasker.prototype.entry = function(name, childs) {
  var arr = [];
  if (childs && Array.isArray(childs)) {
    for (var i=0, n=childs.length; i<n; i++) {
      var task = this.findChildForEntry(childs[i]);
      if (task) { arr.push(task); }
    }
  }
  var args = [].slice.call(arguments, 2);
  var task = originalEntry.apply(this, [name].concat(args));
  task._childs = arr;
  return task;
}

module.exports = Tasker;
