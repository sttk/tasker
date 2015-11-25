'use strict';

var Tasker = require('./entry.js');
module.exports = Tasker;

var originalEntry = Tasker.prototype.entry;
Tasker.prototype.entry = function(name, childNames) {
  var args = [].slice.call(arguments, 2);
  var childTasks = createChildTasks(this, childNames);
  var task = originalEntry.apply(this, [name].concat(args));
  task._childs = childTasks;
  this.asTaskDefined(name);
  return task;
};

function createChildTasks(tasker, childNames) {
  var childs = [];
  if (childNames == null) {
    return childs;
  }
  if (!Array.isArray(childNames)) {
    throw new TypeError('The child task names must be specified in an array.');
  }
  for (var i=0, n=childNames.length; i<n; i++) {
    if (typeof(childNames[i]) !== 'string') {
      throw new TypeError('The child task name is not a string.: ' +
        childNames[i]);
    }
    var child = tasker._tasks[childNames[i]];
    if (!child) {
      tasker.asChildUndefined(childNames[i]);
      child = tasker._tasks[childNames[i]];
      if (child) { childs.push(child); }
    }
    else {
      tasker.asChildDefined(childNames[i]);
      childs.push(child);
    }
  }
  return childs;
}

Tasker.prototype.asTaskDefined = function(name) {
};

Tasker.prototype.asChildUndefined = function(childName) {
  throw new Error('The child task does not exist: ' + childName);
};

Tasker.prototype.asChildDefined = function(childName) {
};
