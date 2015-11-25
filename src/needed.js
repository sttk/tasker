'use strict';

var Tasker = require('./needed0.js');
var Task = require('./lib/task_nocyclic.js');
module.exports = Tasker;

function _isFinished(tasker) {
  if (! tasker.target) { return false; }
  if (! (tasker.target in tasker._toplevels)) { return false; }
  if (Object.keys(tasker._needed).length > 0) { return false; }
  return true;
}

function _findNeeded(tasker, task) {
  task.forEachDescendant(function(each) {
    if (each.element._undefined) {
      var taskname = each.element._undefined;
      tasker._needed[taskname] = each.element;
    }
  });
}

var _emptyTask = new Task();

var originalEntry = Tasker.prototype.entry;
Tasker.prototype.entry = function(name) {
  var task;
  if (!this.target) {
    return originalEntry.apply(this, arguments);
  } else if (_isFinished(this)) {
    task = this._tasks[name];
    if (task && task._definedCount) { task._definedCount[0] ++; }
    return _emptyTask;
  } else {
    var isNeeded = false;
    if (name in this._needed) {
      isNeeded = true;
    } else if (name == this.target && !(name in this._toplevels)) {
      isNeeded = true;
    } 
    task = originalEntry.apply(this, arguments);
    if (isNeeded) { _findNeeded(this, task); }
    return task;
  }
};

var originalAsChildUndefined = Tasker.prototype.asChildUndefined;
Tasker.prototype.asChildUndefined = function(childName) {
  if (!this.target) {
    originalAsChildUndefined.apply(this, arguments);
  } else {
    var child = this.create(childName);
    child._undefined = childName;
  }
};

var originalLoad = Tasker.prototype.load;
Tasker.prototype.load = function(filename) {
  if (!this.target) {
    return originalLoad.apply(this, arguments);
  } else {
    if (_isFinished(this)) { return; }
    return originalLoad.apply(this, arguments);
  }
};

var originalLoadLater = Tasker.prototype.loadLater;
Tasker.prototype.loadLater = function(filename) {
  if (!this.target) {
    return originalLoadLater.apply(this, arguments);
  } else {
    if (_isFinished(this)) { return; }
    return originalLoadLater.apply(this, arguments);
  }
};

var originalLateLoad = Tasker.prototype.lateLoad;
Tasker.prototype.lateLoad = function() {
  if (!this.target) {
    return originalLateLoad.apply(this, arguments);
  } else {
    var files = Object.keys(this._willLoad);
    for (var i=0, n=files.length; i<n; i++) {
      if (_isFinished(this)) { break; }
      originalLoad(files[i]);
    }
    this._willLoad = {};
  }
};
