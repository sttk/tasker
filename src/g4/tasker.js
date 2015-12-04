'use strict';

var Tasker = require('../tasker.js');
var Task = require('./task.js');

var tasker = new Tasker();

var origToplevelsSet = tasker.toplevels.set;
tasker.toplevels.set = function(key, value) {
  if (typeof(key) !== 'string') { return null; }
  return origToplevelsSet.apply(this, arguments);
};

tasker.onPut = function(task, fn, disp) {
  task.func = fn;
  task.displayName = disp;
};

module.exports = tasker;
