'use strict';

var path = require('path');
var Tasker = require('./forwardref.js');
var Lineno = require('./lib/lineno.js');

var originalTasker = Tasker;
Tasker = function() {
  var inst = originalTasker();
  inst.prototype = Tasker.prototype;
  inst._loaded = {};
  inst._willLoad = {};
  return inst;
};

Tasker.prototype = originalTasker.prototype;

var originalClear = Tasker.prototype.clear;
Tasker.prototype.clear = function() {
  originalClear.apply(this, arguments);
  delete this._lineno;
  this._loaded = {};
  this._willLoad = {};
};

var originalEntry = Tasker.prototype.entry;
Tasker.prototype.entry = function(name) {
  var taskOld = this._tasks[name];
  var taskNew = originalEntry.apply(this, arguments);
  if (taskOld && taskOld._definedCount && taskNew !== taskOld) {
    taskNew._definedCount = taskOld._definedCount;
    taskNew._definedCount[0] ++;
  } else {
    taskNew._definedCount = [1];
  }
  return taskNew;
};

var originalAsTaskDefined = Tasker.prototype.asTaskDefined;
Tasker.prototype.asTaskDefined = function(name) {
  originalAsTaskDefined.apply(this, arguments);
  var task = this._tasks[name];
  if (this._lineno) {
    task.file = this._lineno.file();
    task.lineno = this._lineno.get();
  }
  return task;
};

Tasker.prototype.load = function(filename) {
  if (this._lineno) {
    filename = path.resolve(path.dirname(this._lineno.file()), filename);
  }
  var lineno = new Lineno(filename);
  var abspath = lineno.file();
  if (abspath in this._loaded) { return; }
  if (abspath in this._willLoad) { delete this._willLoad[abspath]; }
  this._loaded[abspath] = true;
  var prev = this._lineno;
  this._lineno = lineno;
  require(abspath);
  this._lineno = prev;
};

Tasker.prototype.loadLater = function(filename) {
  var lineno = new Lineno(filename);
  var abspath = lineno.file();
  if (abspath in this._loaded) { return; }
  if (abspath in this._willLoad) { return; }
  this._willLoad[abspath] = true;
};

Tasker.prototype.lateLoad = function() {
  var files = Object.keys(this._willLoad);
  for (var i=0, n=files.length; i<n; i++) {
    this.load(files[i]);
  }
  this._willLoad = {};
};

module.exports = Tasker;
