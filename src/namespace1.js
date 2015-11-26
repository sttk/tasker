'use strict';

var path = require('path');
var Tasker = require('./namespace.js');

var tasker = new Tasker();
module.exports = tasker;

Tasker.prototype.onEntry = function(name, task, disp) {
  task.name = name;
  task.displayName = disp;
};

Tasker.prototype.tree = function() {
  var logger = [''];
  var names = Object.keys(this._toplevels).sort();
  for (var i=0, n=names.length; i<n; i++) {
    var task = this._toplevels[names[i]];
    if (task._undefined) { continue; }
    task.forEachTreeNode(treeFn, [''], logger);
  }
  return logger[0];
};

var treeFn = function(each, indents, logger) {
  var branch, indent;
  if (each.depth === 0) {
    branch = '';
    indent = '';
  } else if (each.index === each.count - 1) {
    branch = '└─';
    indent = indents[each.depth - 1];
    indents[each.depth] = indent + '　';
  } else {
    branch = '├─';
    indent = indents[each.depth - 1];
    indents[each.depth] = indent + '│ ';
  }
  logger[0] += indent + branch + displayTask(each.element) + '\n';
};

function displayTask(task) {
  var disp = '';

  if (task.file && tasker._lineno) {
    if (task.file !== tasker._lineno.file()) {
      disp += path.relative(path.dirname(tasker._lineno.file()), task.file);
    }
  }
  if (task._definedCount && task._definedCount[0] > 1) {
    if (disp.length > 0) {
      disp += ':';
    }
    disp += task.lineno;
  }
  if (disp.length > 0) {
    disp = ' (' + disp + ')';
  }
  if (task._undefined) { 
    disp = task._undefined + ' <undefined>';
  } else if (task.displayName) {
    disp = task.displayName + disp;
  } else {
    disp = task.name + disp;
  }
  return disp;
}

