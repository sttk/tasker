var tasker = require('tasker');

function nameTest(done) {
  done();
}

tasker.task('name-test', nameTest);
tasker.task('name-test2', nameTest);
tasker.task('name-test3', nameTest);
tasker.task('name-test4', nameTest);
