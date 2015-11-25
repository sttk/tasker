'use strict';

var Tasker = require('./listing.js');
var Task = require('./lib/task_nocyclic.js');

var originalTasker = Tasker;
Tasker = function() {
  var inst = originalTasker();
  inst.prototype = Tasker.prototype;
  inst._needed = {};
  return inst;
};

Tasker.prototype = originalTasker.prototype;

var originalClear = Tasker.prototype.clear;
Tasker.prototype.clear = function() {
  originalClear.apply(this, arguments);
  this._needed = {};
};

var originalEntry = Tasker.prototype.entry;
Tasker.prototype.entry = function(name) {
  var task = this._tasks[name];
  if (task && !task._undefined) {
    delete this._tasks[name];
  }
  task = originalEntry.apply(this, arguments);
  return task;
};

Tasker.prototype.asTaskDefined = function(name) {
  var task = this._tasks[name];
  if (task._undefined) {
    delete task._undefined;
    delete this._needed[name];
  }
};

Tasker.prototype.asChildUndefined = function(childName) {
  var child = this.create(childName);
  child._undefined = childName;
  this._needed[childName] = child;
};

/*
Tasker.prototype.asChildDefined = function(childName) {
};
*/

module.exports = Tasker;
