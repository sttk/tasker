'use strict';

var Tasker = require('./load.js');

var originalTasker = Tasker;
Tasker = function() {
  var inst = originalTasker();
  inst.prototype = Tasker.prototype;
  inst._toplevels = {};
  return inst;
};

Tasker.prototype = originalTasker.prototype;

var originalClear = Tasker.prototype.clear;
Tasker.prototype.clear = function() {
  originalClear.apply(this, arguments);
  this._toplevels = {};
  delete this.target;
};

Tasker.prototype.get = function(name) {
  return this._toplevels[name];
};

var originalEntry = Tasker.prototype.entry;
Tasker.prototype.entry = function(name) {
  var task = originalEntry.apply(this, arguments);
  if (!(name in this._toplevels)) {
    this._toplevels[name] = task;
  }
  return task;
};

module.exports = Tasker;
