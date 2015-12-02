'use strict';

var tasker = require('./tasker.js');
var bach = require('bach');

var g4 = new function() {

  this.task = function(name, fn) {
    switch (typeof(name)) {
    case 'function' :
      var key = getFuncName(name);
      if (key == null) { throw Error('No function name.'); }
      return tasker.put(key, [], name, key);
    case 'string' :
      if (typeof(fn) === 'function') {
        var child = tasker._tasks.get(fn);
        var childs = (child == null) ? [] : [fn];
        return tasker.put(name, childs, fn, name);
      } else {
        throw new TypeError('arguments[2]');
      }
    default :
      throw new TypeError('arguments[1]');
    }
  };

  this.series = function() {
    var args = [].slice.call(arguments);
    var proxy = {func:noop};
    var fn = function(proxy) {
      return function() { proxy.func.apply(g4, arguments); };
    }(proxy);
    tasker.put(fn, args, fn, '<series>');
    var bachArgs = genBachArgs(args);
    proxy.func = bach.series.apply(bach, bachArgs);
    return fn;
  };

  this.parallel = function() {
    var args = [].slice.call(arguments);
    var proxy = {func:noop};
    var fn = function(proxy) {
      return function() { proxy.func.apply(g4, arguments); };
    }(proxy);
    tasker.put(fn, args, fn, '<series>');
    var bachArgs = genBachArgs(args);
    proxy.func = bach.parallel.apply(bach, bachArgs);
    return fn;
  };

  this.load = function(filename, namespace) {
    tasker.load(filename, namespace);
  };

};

var noop = function() {};

function genBachArgs(args) {
  var bachArgs = [], fn, name, task;
  for (var i=0, n=args.length; i<n; i++) {
    switch (typeof(args[i])) {
    case 'function':
      fn = args[i];
      if (!tasker._tasks.has(fn)) {
        tasker.put(fn, [], fn, getFuncName(fn, '<f>'));
      }
      bachArgs.push(fn);
      break;
    case 'string':
      name = args[i];
      task = tasker._tasks.get(name);
      if (task == null) { // out of target.
        fn = noop;
      } else if (typeof(task.func) === 'function') {
        fn = task.func;
      } else {
        fn = function(task) {
          return function() {
            if (typeof(task.func) !== 'function') {
              throw new Error('No such task.: ' + task.key);
            }
            task.func.apply(g4, arguments);
          };
        }(task);
      }
      bachArgs.push(fn);
      break;
    default:
      throw new Error('arguments[' + i + ']');
    }
  }
  return bachArgs;
}

function getFuncName(fn, defName) {
  if (fn.displayName) {
    return fn.displayName;
  }
  else if (fn.name.length > 0) {
    return fn.name;
  }
  else {
    return defName;
  }
}

module.exports = g4;
