'use strict'

// [ES6]import path from 'path'
const path = require('path')

// [ES6]export default class Lineno {
module.exports = class Lineno {
  constructor (filename) {
    this.filename = filename
    this.get = constructorOpt

    function constructorOpt () {
      let original = Error.prepareStackTrace
      Error.prepareStackTrace = prepareStackTrace
      let error = {}
      Error.captureStackTrace(error, constructorOpt)
      let lno = error.stack
      Error.prepareStackTrace = original
      return lno
    }

    function prepareStackTrace (e, structuredStackTrace) {
      let lno = -1
      for (let i = 0, n = structuredStackTrace.length; i < n; i++) {
        var st = structuredStackTrace[i]
        if (st.isEval()) {
          if (lno < 0) {
            lno = st.getLineNumber()
          }
          if (st.getEvalOrigin().indexOf(`(${filename}:`) >= 0) {
            break
          }
        } else if (st.getFileName() === filename) {
          lno = st.getLineNumber()
          break
        } else if (
            (st.getFunctionName() == null) &&
            (st.getMethodName() == null) &&
            (path.basename(filename) === st.getFileName())) {
          lno = st.getLineNumber()
          break
        }
      }
      return lno
    }
  }
}
