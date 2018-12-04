'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
var types_1 = require('./types')
var testResult_1 = require('./testResult')
function axeResultToEarl(rawResults) {
  return rawResults.reduce(function(asserts, axeResult) {
    var results = []
    results = results.concat(
      testResult_1.default(axeResult, axeResult.violations)
    )
    results = results.concat(
      testResult_1.default(axeResult, axeResult.passes)
    )
    results = results.concat(
      testResult_1.default(axeResult, axeResult.incomplete)
    )
    if (results.length === 0) {
      results.push({
        '@type': types_1.EarlType.TestResult,
        outcome: 'earl:inapplicable'
      })
    }
    var newAsserts = results.map(function(result) {
      var match = axeResult.helpUrl.match(
        /axe\/([1-9][0-9]*\.[1-9][0-9]*)\//
      )
      var version = (match && match[1]) || ''
      return {
        '@type': types_1.EarlType.Assertion,
        mode: 'earl:automatic',
        assertedBy: {
          '@id':
            'https://github.com/dequelabs/axe-core/releases/tag/' +
            version +
            '.0',
          '@type': ['earl:Assertor', 'earl:Software', 'doap:Project'],
          'doap:name': 'Axe',
          'doap:vendor': {
            '@id': 'https://deque.com/',
            '@type': 'foaf:Organization',
            'foaf:name': 'Deque Systems'
          }
        },
        test: {
          '@type': types_1.EarlType.TestCase,
          '@id': axeResult.helpUrl
        },
        result: result
      }
    })
    return asserts.concat(newAsserts)
  }, [])
}
exports.default = axeResultToEarl
//# sourceMappingURL=axeResultToEarl.js.map
