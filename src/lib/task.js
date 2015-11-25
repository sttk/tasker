'use struct';

var Task = function() {
  function Constructor() {}
  Constructor.prototype = Task.prototype;
  return new Constructor();
};

module.exports = Task;
