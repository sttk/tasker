'use strict';

var Task = require('./task.js');
var Lineno = require('./lineno.js');
var path = require('path');
var load = require('load');
var Map = (Map) ? Map : require('es6-map');

require('./polyfill/object.js');

var Tasker = function() {
  function Constructor() {
    this.toplevels = new Map();
    this.target = null;
    this._tasks = new Map();
    this._needed = new Map();
    this._loaded = new Map();
    this._willLoad = new Map();
    this._lineno = new Lineno(path.resolve(process.argv[1]));
    this._namespace = null;
  }
  Constructor.prototype = Tasker.prototype;
  return new Constructor();
};

Tasker.prototype = new function() {
  this.clear = function() {
    this.toplevels.clear();
    this.target = null;
    this._tasks.clear();
    this._needed.clear();
    this._loaded.clear();
    this._willLoad.clear();
    this._lineno = new Lineno(path.resolve(process.argv[1]));
    this._namespace = null;
  };

  this.get = function(key) {
    return this.toplevels.get(generateQKey(this, key));
  };

  this.getByQName = function(qname) {
    return this.toplevels.get(qname);
  };

  this.put = function(key, childNames) {
    if (isFinished(this)) {
      dontCreateTaskButCountUpDefined(this, key);
      return emptyTask;
    }

    var childs = createChilds(this, childNames);
    var task = createTask(this, key, childs);

    if (typeof(this.onPut) === 'function') {
      var args = [].slice.call(arguments, 2);
      this.onPut.apply(this, [task].concat(args));
    }

    return task;
  };

  this.load = function(filename, namespace, params) {
    if (isFinished(this)) { return {}; }

    if (namespace != null && typeof(namespace) !== 'string') {
      params = namespace;
      namespace = null;
    } else if (params == null) {
      params = {};
    }

    filename = resolvePath(this, filename);
    var qpath = generateQPath(this, filename, namespace);
    var info = this._loaded.get(qpath);
    if (info != null) { return info.result; }
    this._willLoad.delete(qpath);

    info = {
      filename: filename,
      namespace: namespace,
      parameters: params,
      result: null
    };
    this._loaded.set(qpath, info);

    var prevLno = this._lineno;
    var prevNs = this._namespace;
    this._lineno = new Lineno(filename);
    this._namespace = generateNamespace(this, namespace);
    info.result = requireWithoutCache(filename, info.parameters);
    this._lineno = prevLno;
    this._namespace = prevNs;

    return info.result;
  };

  this.loadLater = function(filename, namespace, params) {
    if (isFinished(this)) { return {}; }

    if (namespace != null && typeof(namespace) !== 'string') {
      params = namespace;
      namespace = null;
    } else if (params == null) {
      params = {};
    }

    filename = resolvePath(this, filename);
    var qpath = generateQPath(this, filename, namespace);
    var info = this._willLoad.get(qpath);
    if (info != null) { return info.result; }

    info = {
      filename: filename,
      namespace: namespace,
      parameters: params,
      result: {}
    };
    this._willLoad.set(qpath, info);

    return info.result;
  };

  this.lateLoad = function() {
    var self = this;
    self._willLoad.forEach(function(info) {
      var ret = self.load(info.filename, info.namespace, info.parameters);
      Object.assign(info.result, ret);
    });
    self._willLoad.clear();
  };

  this.generateQName = function(name, namespace) {
    return name + '@' + namespace;
  };

  this.generateTemporaryTask = function(key) {
    var qkey = generateQKey(this, key);
    var task = this._tasks.get(qkey);
    if (!task) {
      task = new Task(qkey, [], this._lineno.filename, 0);
      this._tasks.set(qkey, task);
      if (this.target == null) { this._needed.set(qkey, task); }
    }
    return task;
  };

  function generateNamespace(tasker, namespace) {
    if (namespace) {
      if (tasker._namespace) {
        return tasker.generateQName(namespace, tasker._namespace);
      } else {
        return namespace;
      }
    } else {
      return tasker._namespace;
    }
  }

  function generateQKey(tasker, key, namespace) {
    if (typeof(key) === 'string') {
      if (namespace) {
        key = tasker.generateQName(key, namespace);
      }
      if (tasker._namespace) {
        key = tasker.generateQName(key, tasker._namespace);
      }
      return key;
    } else {
      return key;
    }
  }

  function generateQPath(tasker, path, namespace) {
    if (namespace) {
      path += ';' + namespace;
    }
    if (tasker._namespace) {
      path += ';' + tasker._namespace;
    }
    return path;
  }

  function createChilds(tasker, keys) {
    var childs = [];
    for (var i=0, n=keys.length; i<n; i++) {
      var task = tasker.generateTemporaryTask(keys[i]);
      childs.push(task);
    }
    return childs;
  }

  function createTask(tasker, key, childs) {
    var qkey = generateQKey(tasker, key);
    var lineno = tasker._lineno;

    var task = tasker._tasks.get(qkey);
    if (!task) {
      task = new Task(qkey, childs, lineno.filename, lineno.get());
      tasker._tasks.set(qkey, task);
      tasker.toplevels.set(qkey, task);
      task._defined[0] = 1;
      if (tasker.target != null && qkey === tasker.target) {
        task.forEachDescendant(function(each) {
          var t = each.element;
          if (t._defined[0] === 0) { tasker._needed.set(t.key, t); }
        });
      }
    }
    else if (task._defined[0] === 0) {
      task._childs = childs;
      tasker.toplevels.set(qkey, task);
      task.filename = lineno.filename;
      task.lineno = lineno.get();
      task._defined[0] = 1;
      if (tasker.target != null && tasker._needed.has(qkey)) {
        task.forEachDescendant(function(each) {
          var t = each.element;
          if (t._defined[0] === 0) { tasker._needed.set(t.key, t); }
        });
      }
      tasker._needed.delete(qkey);
    }
    else {
      task = new Task(task, childs, lineno.filename, lineno.get());
      tasker._tasks.set(qkey, task);
    }
    return task;
  }

  function isFinished(tasker) {
    if (tasker.target == null) { return false; }
    if (!tasker.toplevels.has(tasker.target)) { return false; }
    if (tasker._needed.size > 0) { return false; }
    return true;
  }

  function dontCreateTaskButCountUpDefined(tasker, key) {
    var qkey = generateQKey(tasker, key);
    var task = tasker._tasks.get(qkey);
    if (task && task._defined[0] > 0) { task._defined[0] ++; }
  }

  var emptyTask = new Task('', []);

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

  function requireWithoutCache(filename, params) {
    params.exports = {};
    params.module = {exports: params.exports};
    return load(filename, params);
  }
};

module.exports = Tasker;
