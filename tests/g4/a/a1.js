var tasker = require('tasker');

tasker.task('build', function(cb) {
  console.log('** build');
  cb();
}).description = {
  '_': 'Build all the things!',
  '--dev': 'un-minified',
  '--production': 'compressed into single bundle'
};

tasker.task('serve', function(cb) {
  console.log('** serve');
  cb();
}).description = {
  '_': 'Serves files locally',
  '--lr': 'with live reloading'
};

var bindTo = '0.0.0.0:8888';
var build = './build';
var src = './src';

tasker.task('duplicate-name', function() {});

tasker.task('xxx', 'duplicate-name');
