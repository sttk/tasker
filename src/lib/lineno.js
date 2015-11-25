'use strict';

var path = require('path');

var Lineno = function(filepath) {

  function Constructor(fpath) {
    var _filepath = path.resolve(fpath);
    function _getLineNumber() {
      var original = Error.prepareStackTrace;
      Error.prepareStackTrace = _prepareStackTrace;
      var error = {};
      Error.captureStackTrace(error, _getLineNumber);
      var lineNo = error.stack;
      Error.prepareStackTrace = original;
      return lineNo;
    }
    function _prepareStackTrace(error, structuredStackTrace) {
      var i, lineNo = -1;
      for (i=0; i<structuredStackTrace.length; i++) {
        var st = structuredStackTrace[i];
        var fnm = st.getFileName();
        if (_filepath === fnm) {
          lineNo = st.getLineNumber();
          break;
        }
      }
      return lineNo;
    }
    function _getFilePath() {
      return _filepath;
    }

    this.get = _getLineNumber;
    this.file = _getFilePath;
  }
  Constructor.prototype = Lineno.prototype;
  return new Constructor(filepath);
};

module.exports = Lineno;
