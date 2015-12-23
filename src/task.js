'use strict'

// [ES6] export default class Task {
module.exports = class Task {
  constructor (key, childs, filename, lineno) {
    if (key instanceof Task) {
      this.key = key.key
      this._defined = key._defined
      this._defined[0] ++
    } else {
      this.key = key
      this._defined = [0]
    }
    this._childs = childs
    this.filename = filename
    this.lineno = lineno
  }

  // [ES6]forEachChild (fn, ...args) {
  forEachChild (fn) {
    let args = [].slice.call(arguments, 1)
    let arr = this._childs
    for (let i = 0, n = arr.length; i < n; i++) {
      let each = {index: i, count: arr.length, element: arr[i]}
      // [ES6]fn(each, ...args)
      fn.apply(this, [each].concat(args))
    }
  }

  // [ES6]forEachDescendant (fn, ...args) {
  forEachDescendant (fn) {
    let args = [].slice.call(arguments, 1)
    let set = new WeakSet()
    // [ES6]forEachDescRcr(this, fn, 1, set, ...args)
    forEachDescRcr.apply(this, [this, fn, 1, set].concat(args))
  }

  // [ES6]forEachTreeNode (fn, ...args) {
  forEachTreeNode (fn) {
    let args = [].slice.call(arguments, 1)
    let each = {index: 0, count: 1, depth: 0, element: this}
    // [ES6]fn(each, ...args)
    fn.apply(this, [each].concat(args))
    let set = new WeakSet()
    set.add(this)
    // [ES6]forEachDescRcr(this, fn, 1, set, ...args)
    forEachDescRcr.apply(this, [this, fn, 1, set].concat(args))
  }
}

// [ES6]function forEachDescRcr (task, fn, depth, set, ...args) {
function forEachDescRcr (task, fn, depth, set) {
  let args = [].slice.call(arguments, 4)
  let arr = filterChildsToAvoidCyclic(task, set)
  for (let i = 0, n = arr.length; i < n; i++) {
    let each = {index: i, count: n, depth: depth, element: arr[i]}
    fn.apply(task, [each].concat(args))
    set.add(each.element)
    // [ES6]forEachDescRcr(arr[i], fn, depth + 1, set, ...args)
    forEachDescRcr.apply(arr[i], [arr[i], fn, depth + 1, set].concat(args))
    set.delete(each.element)
  }
}

function filterChildsToAvoidCyclic (task, set) {
  return task._childs.filter(child => !set.has(child))
}
