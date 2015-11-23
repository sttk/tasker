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
    if (name == tasker.target) {
      tasker._needed = {};
      needed = true;
    }
    else if (name in tasker._needed) {
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

var originalLoad = tasker.load;
tasker.load = function(filename) {
  if (tasker.target in tasker._tasks && isEmpty(tasker._needed)) {
    return;
  }
  return originalLoad.apply(this, arguments);
};

var originalLoadLater = tasker.loadLater;
tasker.loadLater = function(filename) {
  if (tasker.target in tasker._tasks && isEmpty(tasker._needed)) {
    return;
  }
  return originalLoadLater.apply(this, arguments);
};

var originalLateLoad = function() {
  if (tasker.target in tasker._tasks && isEmpty(tasker._needed)) {
    return;
  }
  var files = Object.keys(this._willLoad);
  this._willLoad = {};
  originalLateLoad.apply(this, arguments);
  for (var i=0, n=files.length; i<n; i++) {
    if (tasker.target in tasker._tasks && isEmpty(tasker._needed)) {
      return;
    }
    this.load(files[i]);
  }
};

module.exports = tasker;
