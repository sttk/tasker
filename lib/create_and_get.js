'use strict';

var Task = require('./task.js');

var Tasker = function() {

  function Constructor() {
    var self = this;
    this._tasks = {};
    this.create = function(key) {
      var task = self._tasks[key];
      if (!task) {
        task = new Task();
        self._tasks[key] = task;
      }
      return task;
    };
    this.get = function(key) {
      return self._tasks[key];
    };
  }
  Constructor.prototype = Tasker.prototype;
  return new Constructor();
};

module.exports = Tasker;
