'use strict';

var Lineno = require('tasker/src/lineno.js');
var path = require('path');
var load = require('load');

testsuite('Tests of Lineno', function() {
  this.commons({
    desc: function(lno) {
      return this.format('Line number is {1}.', lno);
    }
  }),
  this.testcase('#get', function() {
    this.scene('Eval and the specified file is done eval.', {
      run:function() {
        var lineno = new Lineno('tasker/tests/lineno.js');
        var lno = lineno.get();
        this.equal(lno, 17, this.desc(lno));
      }
    });
    this.scene('Eval and the specified file is doing eval.', {
      run:function() {
        var lineno = new Lineno(__filename);
        var lno = lineno.get();
        this.equal(lno, 24, this.desc(lno));
      }
    });
    this.scene('Required', {
      run:function() {
        var ret = require('tasker/tests/lineno/a.js');
        var lno = ret.lineno;
        this.equal(lno, 6, this.desc(lno));
      }
    });
    this.scene('Load', {
      run:function() {
        var filename = require.resolve('tasker/tests/lineno/a.js');
        var ctx = load(filename, {module:{}, exports:{}});
        var lno = ctx.module.exports.lineno;
        this.equal(lno, 6, this.desc(lno));
      }
    });
  });
});
