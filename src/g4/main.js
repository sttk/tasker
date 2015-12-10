'use strict';

var g4 = require('./g4.js');
var tasker = require('./tasker.js');
var path = require('path');
var argv = require('yargs')
  .boolean('tasks-simple')
  .boolean('tasks')
  .boolean('tasks-custom')
  .boolean('tasks-undefined')
  .argv;

var g4file = path.resolve(argv['file']);
var target = argv._[0];

var isError = false;
process.on('beforeExit', function(code) {
  if (isError) { process.exit(1); }
});

(function() {

  if (argv['tasks-simple']) {
    if (target != null) { tasker.target = target; }
    g4.load(g4file);
    tasker.lateLoad();
    printTasksSimple(target);
  }
  else if (argv['tasks']) {
    if (target != null) { tasker.target = target; }
    g4.load(g4file);
    tasker.lateLoad();
    printTasks(target, argv['depth']);
  }
  else if (argv['tasks-undefined']) {
    if (target != null) { tasker.target = target; }
    g4.load(g4file);
    tasker.lateLoad();
    printTasksUndefined(target);
  }
  else {
    if (target == null) { target = 'default'; }
    tasker.target = target;
    g4.load(g4file);
    tasker.lateLoad();
    process.chdir(path.dirname(g4file));
    runTask(target);
  }

}());

function runTask(target) {
  if (!tasker.toplevels.has(target)) {
    throw new Error('No such task.: ' + target);
  }
  g4.parallel(target)(function(err, res) {
    if (err) { isError = true; console.error(err.stack); }
    //if (err) { throw err; }
  });
}

function printTasksUndefined(target) {
  if (target != null && tasker.get(target) == null) {
    console.log(target);
  }
  tasker._needed.forEach(function(value, key) {
    console.log(key);
  });
}

function printTasksSimple(target) {
  var lines = [], align = 0, keys = getToplevelKeys(target);
  keys.forEach(function(key) {
    var task = tasker.get(key);
    var line = {};
    lines.push(line);
    line.name = getTaskName(task);
    align = Math.max(align, line.name.length + 2);
    if (task.ret.description == null ||
        typeof(task.ret.description) !== 'object') {
      line.desc = task.ret.description ? task.ret.description : '';
    } else {
      line.desc = task.ret.description._ ? task.ret.description._ : '';
    }
  });

  lines.forEach(function(line) {
    console.log(line.name + spaces(align - line.name.length) + line.desc);
  });
}

function printTasks(target, depth) {
  var lines = [], align = 0, keys = getToplevelKeys(target);
  for (var i=0, n=keys.length; i<n; i++) {
    var line = {};
    lines.push(line);

    var task = tasker.get(keys[i]);
    var name = getTaskName(task);
    var branch, indent;
    if (i === n - 1) {
      branch = '└─';
      indent = '  ';
    } else {
      branch = '├─';
      indent = '│ ';
    }
    if (task._childs.length === 0 || depth === 0) {
      branch += '─ ';
    } else {
      branch += '┬ ';
    }

    line.name = branch + name;
    align = Math.max(align, line.name.length + 2);

    if (task.ret.description == null ||
        typeof(task.ret.description) !== 'object') {
      line.desc = task.ret.description ? task.ret.description : '';
    } else {
      Object.keys(task.ret.description).forEach(function(key) {
        if (key === '_') {
          line.desc = task.ret.description._ ? task.ret.description._ : '';
        } else {
          var optLine = {
            name: indent + ((task._childs.length > 0) ? '│ ' : '  ') + key,
            desc: '…' + task.ret.description[key]
          };
          align = Math.max(align, optLine.name.length + 2);
          lines.push(optLine);
        }
      });
    }

    task.forEachDescendant(function(each, indents) {
      if (depth != null && each.depth > depth) { return; }
      var line = {};
      lines.push(line);

      var task = each.element;
      var name = getTaskName(task);
      var branch;
      if (each.index === each.count - 1) {
        indents[each.depth] = indents[each.depth - 1] + '  ';
        branch = '└─';
      } else {
        indents[each.depth] = indents[each.depth - 1] + '│ ';
        branch = '├─';
      }
      if (each.depth === depth || task._childs.length === 0) {
        branch += '─ ';
      } else {
        branch += '┬ ';
      }

      line.name = indents[each.depth - 1] + branch + name;
      line.desc = '';
    }, [indent]);
  }

  console.log('Tasks for ' + argv['file']);
  lines.forEach(function(line) {
    console.log(line.name + spaces(align - line.name.length) + line.desc);
  });
}

function getToplevelKeys(target) {
  if (target) {
    if (!tasker.toplevels.has(target)) {
      throw new Error('No such task.: ' + target);
    }
    return [target];
  } else {
    var keys = [];
    tasker.toplevels.forEach(function(task, key) { keys.push(key); });
    return keys.sort();
  }
}

function spaces(n) {
  n = Math.max(n, 1);
  if (String.prototype.repeat) {
    return ' '.repeat(n);
  } else {
    var s = '';
    for (var i=0; i<n; i++) { s += ' '; }
    return s;
  }
}

function getTaskName(task) {
  var name = task.getDisplayName();
  var loc = '';
  if (task._defined[0] > 1) {
    if (task.filename !== g4file) {
      loc += path.relative(path.dirname(g4file), task.filename) + ':';
    }
    loc = '(' + loc + task.lineno + ')';
  }
  return name + loc;
}
