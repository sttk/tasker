# Tasker [![Build Status][travis-image]][travis-url]

[travis-image]: https://travis-ci.org/sttk/tasker.svg?branch=master
[travis-url]: https://travis-ci.org/sttk/tasker

A sample program of a task registry.

This program can manager tasks with tree-structure and also has features as follows:

* Allows a task to have any property by overriding Tasker#onPut method.
* Can load other js files and merge tasks defined in those files.
* Can specify a namespace word to tasks in a loading js file.
* Supports forward references of tasks.
* A task can list its children or descendants.
* A task has informations about its defining position (filename and line number).

## License

Copyright © Takayuki Sato.

Tasker is free software under [MIT](<http://opensource.org/licenses/MIT>) License.
