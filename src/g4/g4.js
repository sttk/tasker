'use strict';

var tasker = require('./tasker.js');
var Task = require('./task.js');
var bach = require('bach');

var g4 = new function() {

  this.task = function(name, fn) {
    switch (typeof(name)) {
    case 'function' :
      var key = getFuncKey(name);
      if (key == null) { throw Error('No function name.'); }
      return tasker.put(key, [], name, key);
    case 'string' :
      switch (typeof(fn)) {
      case 'function' :
        var task = tasker._tasks.get(fn);
        if (task == null) {
          return tasker.put(name, [], fn, name);
        } else if (task._bach) {
          return tasker.put(name, [fn], fn, name);
        } else if (getFuncKey(fn) != null) {
          return tasker.put(name, [fn], genTaskFuncRunner(task), name);
        } else {
          return tasker.put(name, [], fn, name);
        }
      case 'string' :
        var task = tasker._tasks.get(fn);
        if (task == null) {
          task = tasker.generateTemporaryTask(fn);
        }
        return tasker.put(name, [fn], genTaskFuncRunner(task), name);
      default :
        throw new TypeError('fn');
      }
    default :
      throw new TypeError('name');
    }
  };

  this.series = function() {
    var args = [].slice.call(arguments);
    var bachArgs = genBachArgs(args);
    var fn = bach.series.apply(bach, bachArgs);
    var task = tasker.put(fn, args, fn, '<series>');
    task._bach = true;
    return fn;
  };

  this.parallel = function() {
    var args = [].slice.call(arguments);
    var bachArgs = genBachArgs(args);
    var fn = bach.parallel.apply(bach, bachArgs);
    var task = tasker.put(fn, args, fn, '<parallel>');
    task._bach = true;
    return fn;
  };

  this.load = function(filename, namespace) {
    tasker.load(filename, namespace);
  };

};

function genBachArgs(args) {
  var bachArgs = [];
  for (var i=0, n=args.length; i<n; i++) {
    switch (typeof(args[i])) {
    case 'function':
      var fn = args[i];
      var task = tasker._tasks.get(fn);
      if (task == null) {
        task = tasker.put(fn, [], fn);
      }
      if (getFuncKey(fn) == null) {
        bachArgs.push(fn);
      } else {
        bachArgs.push(genTaskFuncRunner(task));
      }
      break;

    case 'string':
      var name = args[i];
      var task = tasker._tasks.get(name);
      if (task == null) {
        task = tasker.generateTemporaryTask(name);
      }
      bachArgs.push(genTaskFuncRunner(task));
      break;

    default:
      throw new Error('arguments[' + i + ']');
    }
  }
  return bachArgs;
}

function getFuncKey(fn) {
  if (fn.displayName) {
    return fn.displayName;
  } else if (fn.name.length > 0) {
    return fn.name;
  } else {
    return null;
  }
}

function genTaskFuncRunner(task) {
  return function(task) {
    return function(cb) {
      var ret;
      var name = task.getDisplayName();
      if (typeof(task.func) !== 'function') {
        throw new Error('No such task.: ' + name);
      }
      console.log("Starting '" + name + "'...");
      if (task.func.length === 0) {
        ret = task.func.call(g4);
        console.log("Finished '" + name + "'");
        cb();
      } else {
        ret = task.func.call(g4, function() {
          console.log("Finished '" + name + "'");
          cb();
        });
      }
      return ret;
    }
  }(task);
}

module.exports = g4;
