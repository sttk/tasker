'use strict';

var Tasker = require('./forwardref.js');
var Lineno = require('./_lineno.js');

var originalPut = Tasker.prototype.put;
Tasker.prototype.put = function(name) {
  var task = originalPut.apply(this, arguments);
  if (this._lineno) {
    task.file = this._lineno.file();
    task.lineno = this._lineno.get();
  }
  return task;
};

function _createLoaded(tasker) {
  if (!tasker._loaded) { tasker._loaded = {}; }
  if (!tasker._willLoad) { tasker._willLoad = {}; }
}

Tasker.prototype.load = function(filename) {
  _createLoaded(this);
  var lineno = new Lineno(filename);
  var filename = lineno.file();
  if (filename in this._loaded) { return; }
  if (filename in this._willLoad) { delete this._willLoad[filename]; }
  this._loaded[filename] = true;
  var prev = this._lineno;
  this._lineno = lineno;
  require(filename);
  this._lineno = prev;
};

Tasker.prototype.loadLater = function(filename) {
  _createLoaded(this);
  var lineno = new Lineno(filename);
  if (lineno.file in this._loaded) { return; }
  if (lineno.file in this._willLoaded) { return; }
  this._willLoad[lineno.file] = true;
};

Tasker.prototype.lateLoad = function() {
  _createLoaded(this);
  var files = Object.keys(this._willLoad);
  for (var i=0, n=files.length; i<n; i++) { this.load(files[i]); }
};

module.exports = new Tasker;
