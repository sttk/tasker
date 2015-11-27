'use strict';

var Lineno = require('tasker/src/lineno.js');

var lineno = new Lineno(__filename);
var lno = lineno.get();

module.exports = { lineno:lno  };
