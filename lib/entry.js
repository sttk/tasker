'use strict';

var Tasker = require('./create_and_get.js');

Tasker.prototype.entry = function(name) {
  var task = this.create(name);
  if (typeof(this.onEntry) === 'function') {
    var args = [].slice.call(arguments, 1);
    this.onEntry.apply(this, [name, task].concat(args));
  }
  return task;
};

module.exports = Tasker;
