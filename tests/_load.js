'use strict';

var path = require('path');
var tasker = require(path.resolve('./lib/load.js'));

tasker.log = '';

var originalEntry = tasker.entry;
tasker.entry = function(name) {
  var task = this._tasks[name], newTask;
  if (!task || !task._definedCount || task._definedCount[0] === 0) {
    newTask = originalEntry.apply(this, arguments);
    newTask._definedCount = [1];
  } else {
    delete this._tasks[name];
    newTask = originalEntry.apply(this, arguments);
    newTask._definedCount = task._definedCount;
    newTask._definedCount[0] ++;
  }
  return newTask;
};

var filename = path.resolve('./tests/_load_a.js');
var mainDir = path.dirname(filename);
var mainPath = filename;

tasker.onEntry = function(name, task, type, disp) {
  task.name = name;
  task.displayName = disp;
};

function display(task) {
  var disp = '';
  if (task.file && task.file !== mainPath) {
    disp += path.relative(mainDir, task.file);
  }
  if (task._definedCount > 1) {
    if (disp.length > 0) { disp += ':'; }
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

var treeFn = function(each, indent) {
  var task = each.element;
  var branch, nextIndent;
  if (each.index == each.count - 1) {
    branch = '└─';
    nextIndent = '　';
  } else {
    branch = '├─';
    nextIndent = '│ ';
  }
  tasker.log += indent + branch + display(task) + '\n';
  task.forEachChild(treeFn, nextIndent);
};

tasker.tree = function() {
  var names = Object.keys(tasker._tasks).sort();
  for (var i=0, n=names.length; i<n; i++) {
    var task = tasker.get(names[i]);
    if (task._undefined) { continue; }
    tasker.log += display(task) + '\n';
    task.forEachChild(treeFn, '');
  }
};

module.exports = tasker;