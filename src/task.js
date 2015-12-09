'use strict';

var WeakMap = (WeakMap) ? WeakMap : require('es6-weak-map');

var Task = function(key, childs, filename, lineno) {
  function Constructor(key, childs, filename, lineno) {
    this.key = key;
    this._childs = childs;
    this.filename = filename;
    this.lineno = lineno;
    this._defined = [0];
  }

  function CopyConstructor(task, childs, filename, lineno) {
    this.key = task.key;
    this._childs = childs;
    this.filename = filename;
    this.lineno = lineno;
    this._defined = task._defined;
    this._defined[0] ++;
  }

  if (key instanceof Task) {
    CopyConstructor.prototype = Task.prototype;
    return new CopyConstructor(key, childs, filename, lineno);
  } else {
    Constructor.prototype = Task.prototype;
    return new Constructor(key, childs, filename, lineno);
  }
};

Task.prototype = new function() {

  this.forEachChild = function(fn) {
    var args = [].slice.call(arguments, 1);
    var arr = this._childs;
    for (var i=0, n=arr.length; i<n; i++) {
      var each = {index:i, count:arr.length, element:arr[i]};
      fn.apply(this, [each].concat(args));
    }
  };

  this.forEachDescendant = function(fn) {
    var args = [].slice.call(arguments, 1);
    var map = new WeakMap();
    forEachDescRcr.apply(this, [this, fn, 1, map].concat(args));
  };

  this.forEachTreeNode = function(fn) {
    var args = [].slice.call(arguments, 1);
    var each = {index:0, count:1, depth:0, element:this};
    fn.apply(this, [each].concat(args));
    var map = new WeakMap();
    map.set(this, this);
    forEachDescRcr.apply(this, [this, fn, 1, map].concat(args));
  };

  function forEachDescRcr(task, fn, depth, map) {
    var args = [].slice.call(arguments, 4);
    var arr = filterChildsToAvoidCyclic(task, map);
    for (var i=0, n=arr.length; i<n; i++) {
      var each = {index:i, count:arr.length, depth:depth, element:arr[i]};
      fn.apply(task, [each].concat(args));
      map.set(each.element, each.element);
      forEachDescRcr.apply(arr[i], [arr[i], fn, depth + 1, map].concat(args));
      map.delete(each.element);
    }
  }

  function filterChildsToAvoidCyclic(task, map) {
    var arr = [];
    for (var i=0, n=task._childs.length; i<n; i++) {
      if (map.has(task._childs[i])) { continue; }
      arr.push(task._childs[i]);
    }
    return arr;
  }
};

module.exports = Task;
