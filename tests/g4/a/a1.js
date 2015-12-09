var tasker = require('tasker');

var bindTo = '0.0.0.0:8888';
var build = './build';
var src = './src';

tasker.task('build', function(cb) {
  console.log('** build');
  console.log('Build from ' + src + ' to ' + build);
  cb();
}).description = {
  '_': 'Build all the things!',
  '--dev': 'un-minified',
  '--production': 'compressed into single bundle'
};

tasker.task('serve', function(cb) {
  console.log('** serve');
  console.log('At ' + bindTo);
  cb();
}).description = {
  '_': 'Serves files locally',
  '--lr': 'with live reloading'
};

tasker.task('duplicate-name', function() {});

tasker.task('xxx', 'duplicate-name');
