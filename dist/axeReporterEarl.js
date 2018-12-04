'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
var types_1 = require('./types')
var context = require('./context.json')
var axeResultToEarl_1 = require('./axeResultToEarl')
function axeReporterEarl(rawResults, _a, callback) {
  callback(createEarlReport(rawResults))
}
exports.default = axeReporterEarl
function createEarlReport(rawResults, url) {
  debugger
  return {
    '@context': context,
    '@type': types_1.EarlType.WebPage,
    url: url ? url : window.location.href,
    assertions: axeResultToEarl_1.default(rawResults)
  }
}
exports.createEarlReport = createEarlReport
//# sourceMappingURL=axeReporterEarl.js.map
