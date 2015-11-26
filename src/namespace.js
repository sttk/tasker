'use strict';

var Tasker = require('./needed.js');
var Lineno = require('./lib/lineno.js');
var path = require('path');
var load = require('load');

function _genName(name, ns) {
  return name + '@' + ns;
}

var originalEntry = Tasker.prototype.entry;
Tasker.prototype.entry = function(name, childs) {
  if (this._namespace && this._namespace.length > 0) {
    name = _genName(name, this._namespace);
    if (childs && Array.isArray(childs)) {
      for (var i=0, n=childs.length; i<n; i++) {
        childs[i] = _genName(childs[i], this._namespace);
      }
    }
  }
  var args = [].slice.call(arguments, 2);
  return originalEntry.apply(this, [name, childs].concat(args));
};

var originalClear = Tasker.prototype.clear;
Tasker.prototype.clear = function() {
  originalClear.apply(this, arguments);
  delete this._namespace;
};

function _chkName(name, ns) {
  if (typeof(name) === 'string' && name.length > 0) {
    if (typeof(ns) === 'string' && ns.length > 0) {
      return _genName(name, ns);
    } else if (ns == null) {
      return name;
    } else {
      throw new TypeError('The namespace must be a string.');
    }
  } else if (name == null) {
    if (typeof(ns) === 'string' && ns.length > 0) {
      return ns;
    } else if (ns == null) {
      return null;
    } else {
      throw new TypeError('The namespace must be a string.');
    }
  } else {
    throw new TypeError('The name must be a string.');
  }
}

var originalLoad = Tasker.prototype.load;
Tasker.prototype.load = function(filename, namespace) {
  namespace = _chkName(namespace, this._namespace);
  if (namespace != null) {
    if (this._lineno) {
      filename = path.resolve(path.dirname(this._lineno.file()), filename);
    }
    var lineno = new Lineno(filename);
    filename = lineno.file();
    var key = _genName(filename, namespace);
    if (key in this._loaded) { return; }
    if (key in this._willLoad) { delete this._willLoad[key]; }
    this._loaded[key] = { filename:filename, namespace:namespace };
    var prevLno = this._lineno;
    var prevNs = this._namespace;
    this._lineno = lineno;
    this._namespace = namespace;
    load(filename);
    if (prevLno) { this._lineno = prevLno; } else { delete this._lineno; }
    if (prevNs) { this._namespace = prevNs; } else { delete this._namespace; }
  } else {
    originalLoad.apply(this, arguments);
  }
};

var originalLoadLater = Tasker.prototype.loadLater;
Tasker.prototype.loadLater = function(filename, namespace) {
  if (typeof(namespace) === 'string' && namespace.length > 0) {
    var lineno = new Lineno(filename);
    filename = lineno.file();
    var key = _genName(filename, namespace);
    if (key in this._loaded) { return; }
    if (key in this._willLoad) { return; }
    this._willLoad[key] = {filename:filename, namespace:namespace};
  } else if (namespace != null) {
    throw new TypeError('The namespace must be a string.');
  } else {
    originalLoadLater.apply(this, arguments);
  }
};

Tasker.prototype.lateLoad = function() {
  var paths = Object.keys(this._willLoad);
  for (var i=0, n=paths.length; i<n; i++) {
    var opt = this._willLoad[paths[i]];
    if (opt === true) {
      this.load(opt.filename);
    } else {
      this.load(opt.filename, opt.namespace);
    }
  }
  this._willLoad = {};
};

module.exports = Tasker;

