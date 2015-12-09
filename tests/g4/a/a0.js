var tasker = require('tasker');

tasker.task('clean', function(cb) {
  console.log('** clean');
  cb();
}).description = 'Delete dist folder';

tasker.task('duplicate-name', function() {});
tasker.task('xxx', 'duplicate-name');
