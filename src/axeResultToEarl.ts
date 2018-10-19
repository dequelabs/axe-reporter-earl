import { RawResult, Assertion, TestResult } from './types'
import testResults from './testResult'

export default function axeResultToEarl(
  rawResults: RawResult[]
): Assertion[] {
  return rawResults.reduce(
    (asserts: Assertion[], axeResult: RawResult): Assertion[] => {
      let results: TestResult[] = []
      results = results.concat(
        testResults(axeResult, axeResult.violations)
      )
      results = results.concat(
        testResults(axeResult, axeResult.passes)
      )
      results = results.concat(
        testResults(axeResult, axeResult.incomplete)
      )

      if (results.length === 0) {
        results.push({
          '@type': 'TestResult',
          outcome: 'earl:inapplicable'
        })
      }

      const newAsserts = results.map(result => {
        const match = axeResult.helpUrl.match(
          /axe\/([1-9][0-9]*\.[1-9][0-9]*)\//
        )
        const version = (match && match[1]) || ''
        return {
          '@type': 'Assertion',
          mode: 'earl:automatic',
          assertedBy: `https://github.com/dequelabs/axe-core/releases/tag/${version}.0`,
          test: {
            '@type': 'TestCase',
            '@id': axeResult.helpUrl
          },
          result
        } as Assertion
      })

      return asserts.concat(newAsserts)
    },
    []
  )
}
