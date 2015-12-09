var tasker = require('tasker');

var a1 = tasker.loadLater('./a/a1.js', 'a1');
tasker.loadLater('./a/a0.js', a1);

tasker.task('default',
  tasker.series('clean', 'build@a1', 'serve@a1', function(cb) {
    console.log('** default');
    console.log('Server bind to ' + a1.bindTo);
    console.log('Serving ' + a1.build);
})).description = 'Build and watch for changes';

tasker.task('duplicate-name', function() {});

tasker.task('duplicate-name', function() {});

tasker.task('yyy', 'duplicate-name');
