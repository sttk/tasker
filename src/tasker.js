'use strict';

var Task = require('./task.js');
var Lineno = require('./lineno.js');
var path = require('path');
var load = require('load');
var Map = (Map) ? Map : require('es6-map');

var Tasker = function() {
  function Constructor() {
    this.toplevels = {};
    this.target = null;
    this._tasks = {};
    this._needed = {};
    this._loaded = {};
    this._willLoad = new Map();
    this._lineno = new Lineno(path.resolve(process.argv[1]));
    this._namespace = null;
  }
  Constructor.prototype = Tasker.prototype;
  return new Constructor();
};

Tasker.prototype = new function() {
  this.clear = function() {
    this._tasks = {};
    this.toplevels = {};
    this._needed = {};
    this._loaded = {};
    this._willLoad.clear();
    this._lineno = new Lineno(path.resolve(process.argv[1]));
    this._namespace = null;
    this.target = null;
  };

  this.get = function(name) {
    return this.toplevels[name];
  };

  this.entry = function(name, childNames) {
    if (isFinished(this)) { return createEmptyTask(this, name); }

    var childs = createChilds(this, childNames);
    var task = createTask(this, name, childs);

    if (typeof(this.onEntry) === 'function') {
      var args = [].slice.call(arguments, 2);
      this.onEntry.apply(this, [task].concat(args));
    }

    return task;
  };

  this.load = function(filename, namespace) {
    if (isFinished(this)) { return; }

    filename = resolvePath(this, filename);
    var ns = this.generateQName(namespace, this._namespace);
    var key = this.generateQName(filename, ns);
    if (key in this._loaded) { return; }
    this._willLoad.delete(key);
    this._loaded[key] = {filename:filename, namespace:namespace};

    var prevLno = this._lineno;
    var prevNs = this._namespace;
    this._lineno = new Lineno(filename);
    this._namespace = ns;
    requireWithoutCache(filename);
    this._lineno = prevLno;
    this._namespace = prevNs;
  };

  this.loadLater = function(filename, namespace) {
    if (isFinished(this)) { return; }

    filename = resolvePath(this, filename);
    var ns = this.generateQName(namespace, this._namespace);
    var key = this.generateQName(filename, ns);
    if (this._willLoad.has(key)) { return; }
    this._willLoad.set(key, {filename:filename, namespace:namespace});
  };

  this.generateQName = function(name, namespace) {
    if (typeof(name) === 'string' && name.length > 0) {
      if (typeof(namespace) === 'string' && namespace.length > 0) {
        return name + '@' + namespace;
      }
      return name;
    }
    if (typeof(namespace) === 'string' && namespace.length > 0) {
      return namespace;
    }
    return '';
  };

  this.lateLoad = function() {
    var self = this;
    self._willLoad.forEach(function(value, key) {
      self.load(value.filename, value.namespace);
    });
    self._willLoad.clear();
  };

  function createChilds(tasker, names) {
    var childs = [];
    for (var i=0, n=names.length; i<n; i++) {
      var qname = tasker.generateQName(names[i], tasker._namespace);
      var task = tasker._tasks[qname];
      if (!task) {
        task = new Task(qname, [], tasker._lineno.filename, 0);
        tasker._tasks[qname] = task;
        if (!tasker.target) { tasker._needed[qname] = task; }
      }
      childs.push(task);
    }
    return childs;
  }

  function collectNeededForTarget(tasker, qname) {
    if (!tasker.target) { return; }

    if (qname === tasker.target || qname in tasker._needed) {
      var task = tasker._tasks[qname];
      task.forEachDescendant(function(each) {
        if (each.element._defined[0] === 0) {
          tasker._needed[each.element.name] = each.element;
        }
      });
    }
  }

  function createTask(tasker, name, childs) {
    var qname = tasker.generateQName(name, tasker._namespace);
    var lineno = tasker._lineno;

    var task = tasker._tasks[qname];
    if (!task) {
      task = new Task(qname, childs, lineno.filename, lineno.get());
      tasker._tasks[qname] = task;
      tasker.toplevels[qname] = task;
      task._defined[0] = 1;
      collectNeededForTarget(tasker, qname);
    }
    else if (task._defined[0] === 0) {
      task._childs = childs;
      task.filename = lineno.filename;
      task.lineno = lineno.get();
      task._defined[0] = 1;
      tasker.toplevels[qname] = task;
      collectNeededForTarget(tasker, qname);
      delete tasker._needed[qname];
    }
    else {
      task = new Task(task, childs, lineno.filename, lineno.get());
      tasker._tasks[qname] = task;
    }
    return task;
  }

  function isFinished(tasker) {
    if (!tasker.target) { return false; }
    if (!(tasker.target in tasker.toplevels)) { return false; }
    if (Object.keys(tasker._needed).length > 0) { return false; }
    return true;
  }

  var emptyTask = new Task('', []);
  function createEmptyTask(tasker, name) {
    var qname = tasker.generateQName(name, tasker._namespace);
    var task = tasker._tasks[qname];
    if (task && task._defined[0] > 0) { task._defined[0] ++; }
    return emptyTask;
  }

  function resolvePath(tasker, filename) {
    if (filename[0] !== '.') {
      return require.resolve(filename);
    }
    var fpath = path.resolve(path.dirname(tasker._lineno.filename), filename);
    try {
      return require.resolve(fpath);
    } catch (e) {
      return require.resolve(filename);
    }
  }

  function requireWithoutCache(filename) {
    var exports = {};
    var module = {exports:exports};
    load(filename, {module:module, exports:exports});
  }
};

module.exports = Tasker;
