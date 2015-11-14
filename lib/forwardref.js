'use strict';

var Tasker = require('./tree.js');
var Task = require('./listing.js');

Tasker.prototype.processUndefinedChild = function(name) {
  var child = this.create(name);
  child._undefined = name;
  this._needed[name] = child;
  return child;
};

var originalEntry = Tasker.prototype.entry;
Tasker.prototype.entry = function(name, childNames) {
  if (!this._needed) { this._needed = []; }
  if (name in this._needed) {
    var task = this._tasks[name];
    delete task['_undefined'];
    delete this._needed[name];
  }
  return originalEntry.apply(this, arguments);
};

module.exports = Tasker;
