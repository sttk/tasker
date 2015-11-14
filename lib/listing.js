'use strict';

var Task = require('./task.js');

Task.prototype.forEachChild = function(fn) {
  var args = [].slice.call(arguments, 1);
  var arr = this._childs;
  for (var i=0, n=arr.length; i<n; i++) {
    var each = {index:i, count:arr.length, element:arr[i]};
    fn.apply(this, [each].concat(args));
  }
};

Task.prototype.forEachDescendant = function(fn) {
  var args = [].slice.call(arguments, 1);
  this._forEachDescRcr.apply(this, [fn, 1].concat(args));
};

Task.prototype._forEachDescRcr = function(fn, depth) {
  var args = [].slice.call(arguments, 2);
  var arr = this._childs;
  for (var i=0, n=arr.length; i<n; i++) {
    var each = {index:i, count:arr.length, depth:depth, element:arr[i]};
    fn.apply(this, [each].concat(args));
    this._forEachDescRcr.apply(each.element, [fn, depth+1].concat(args));
  }
};

module.exports = Task;
