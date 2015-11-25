'use strict';

var Task = require('./task_foreach.js');
module.exports = Task;

Task.prototype.forEachTreeNode = function(fn) {
  var args = [].slice.call(arguments, 1);
  var each = {index:0, count:1, depth:0, element:this};
  fn.apply(this, [each].concat(args));
  forEachDescRcr.apply(this, [this, fn, 1, [this]].concat(args));
};

Task.prototype.forEachDescendant = function(fn) {
  var args = [].slice.call(arguments, 1);
  forEachDescRcr.apply(this, [this, fn, 1, []].concat(args));
};

function forEachDescRcr(task, fn, depth, called) {
  var args = [].slice.call(arguments, 4);
  var childs = [], i, n, j, nn;
  if (task._childs == null) { return; }
  L:for (i=0, n=task._childs.length; i<n; i++) {
    var ch = task._childs[i];
    for (j=0, nn=called.length; j<nn; j++) {
      if (ch.name === called[j].name) { continue L; }
    }
    childs.push(ch);
  }
  for (i=0, n=childs.length; i<n; i++) {
    var each = {index:i, count:childs.length, depth:depth, element:childs[i]};
    fn.apply(task, [each].concat(args));
    called.push(each.element);
    forEachDescRcr.apply(each.element,
      [each.element, fn, depth + 1, called].concat(args));
    called.pop();
  }
}
