'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
var types_1 = require('./types')
function testResult(_a, outcomes) {
  var description = _a.description
  if (outcomes === void 0) {
    outcomes = []
  }
  return outcomes.map(function(_a) {
    var node = _a.node,
      result = _a.result
    return {
      '@type': types_1.EarlType.TestResult,
      info: description,
      outcome: 'earl:' + result,
      pointer: cssToPointer(node.selector)
    }
  })
}
exports.default = testResult
function cssToPointer(selector) {
  var item = selector[0]
  if (Array.isArray(item)) {
    return item[0]
  }
  return item
}
exports.cssToPointer = cssToPointer
//# sourceMappingURL=testResult.js.map
