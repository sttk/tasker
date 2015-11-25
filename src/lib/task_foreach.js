'use strict';

var Task = require('./task.js');
module.exports = Task;

Task.prototype.forEachChild = function(fn) {
  var args = [].slice.call(arguments, 1);
  var childs = this._childs;
  if (childs == null) { return; }
  for (var i=0, n=childs.length; i<n; i++) {
    var each = {index:i, count:childs.length, element:childs[i]};
    fn.apply(this, [each].concat(args));
  }
};

Task.prototype.forEachTreeNode = function(fn) {
  var args = [].slice.call(arguments, 1);
  var each = {index:0, count:1, depth:0, element:this};
  fn.apply(this, [each].concat(args));
  forEachDescRcr.apply(this, [this, fn, 1].concat(args));
};

Task.prototype.forEachDescendant = function(fn) {
  var args = [].slice.call(arguments, 1);
  forEachDescRcr.apply(this, [this, fn, 1].concat(args));
};

function forEachDescRcr(task, fn, depth) {
  var args = [].slice.call(arguments, 3);
  var childs = task._childs;
  if (childs == null) { return; }
  for (var i=0, n=childs.length; i<n; i++) {
    var each = {index:i, count:childs.length, depth:depth, element:childs[i]};
    fn.apply(task, [each].concat(args));
    forEachDescRcr.apply(childs[i], [childs[i], fn, depth + 1].concat(args));
  }
}
