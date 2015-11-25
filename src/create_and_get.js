'use strict';

var Task = require('./lib/task.js');

var Tasker = function() {
  function Constructor() {
    this._tasks = {};
  }
  Constructor.prototype = Tasker.prototype;
  return new Constructor();
};

Tasker.prototype.clear = function() {
  this._tasks = {};
};

Tasker.prototype.create = function(name) {
  var task = this._tasks[name];
  if (task == null) {
    task = new Task();
    this._tasks[name] = task;
  }
  return task;
};

Tasker.prototype.get = function(name) {
  return this._tasks[name];
};

module.exports = Tasker;
