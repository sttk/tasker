'use strict';

var Task = require('../task.js');

Task.prototype.getDisplayName = function() {
  if (this.displayName) { return this.displayName; }
  if (typeof(this.key) === 'function') {
    var fn = this.key;
    if (fn.displayName) { return fn.displayName; }
    if (fn.name.length > 0) { return fn.name; }
    return '<f>';
  }
  return this.key.toString();
};
