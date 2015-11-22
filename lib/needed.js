'use strict';

var tasker = require('./load_ex.js');

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) { return false; }
  }
  return true;
}

var originalEntry = tasker.entry;
tasker.entry = function(name, childs) {
  if (!this._needed) { this._needed = []; }
  if ('target' in tasker) {
    if (tasker.target in tasker._tasks && isEmpty(tasker._needed)) {
      if (task) { task._definedCount[0] ++; }
      return;
    }
    var task = tasker._tasks[name], needed;
    if (name in tasker._needed || name == tasker.target) {
      needed = true;
    }
    task = originalEntry.apply(this, arguments);
    if (needed) {
      task.forEachDescendant(function(each) {
        if (each.element._undefined) {
          var taskname = each.element._undefined;
          tasker._needed[taskname] = tasker._tasks[taskname];
        }
      });
    }
    return task;
  } else {
    return originalEntry.apply(this, arguments);
  }
};

var originalProcessUndefinedChild = tasker.processUndefinedChild;
tasker.processUndefinedChild = function(name) {
  var child = this.create(name);
  child._undefined = name;
  if (!('target' in tasker)) {
    this._needed[name] = child;
  }
  return child;
};


module.exports = tasker;
