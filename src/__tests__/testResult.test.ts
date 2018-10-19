import testResult, { cssToPointer } from '../testResult'
import { assert } from 'chai'
import { getDummyData } from './utils'
import { RawResult, RawNodeResult } from '../types'

let dummyData: RawResult[]
beforeEach(async () => {
  dummyData = await getDummyData()
})

const resultTypes: ResultType[] = [
  'violations',
  'passes',
  'incomplete'
]
const outcomeMap = {
  violations: 'earl:failed',
  passes: 'earl:passed',
  incomplete: 'earl:cantTell'
}

type ResultType = 'violations' | 'passes' | 'incomplete'
type ResultCallback = (
  axeResult: RawResult,
  nodeResults: RawNodeResult[],
  type: ResultType
) => void

function eachResult(callback: ResultCallback) {
  dummyData.forEach(axeResult => {
    resultTypes.forEach((type: ResultType) => {
      const nodeResults = axeResult[type]
      if (nodeResults && nodeResults.length) {
        callback(axeResult, nodeResults, type)
      }
    })
  })
}

test(`returns an array of TestResult objects`, () => {
  eachResult((axeResult, nodeResults) => {
    const results = testResult(axeResult, nodeResults)
    results.forEach(result => {
      assert.equal(result['@type'], 'TestResult')
    })
  })
})

test(`TestResult has 'outcome'`, () => {
  eachResult((axeResult, nodeResults, type) => {
    assert.isDefined(outcomeMap[type])
    const results = testResult(axeResult, nodeResults)
    results.forEach(result => {
      assert.equal(result['outcome'], outcomeMap[type])
    })
  })
})

test(`TestResult has 'info'`, () => {
  eachResult((axeResult, nodeResults) => {
    assert.isDefined(axeResult.description)
    const results = testResult(axeResult, nodeResults)
    results.forEach(result => {
      assert.equal(result['info'], axeResult.description)
    })
  })
})

test(`TestResult has 'pointer'`, () => {
  eachResult((axeResult, nodeResults) => {
    assert.isDefined(axeResult.description)
    const results = testResult(axeResult, nodeResults)
    const pointers = nodeResults.map(
      ({ node }) =>
        Array.isArray(node.selector[0])
          ? node.selector[0][0]
          : node.selector[0]
    )
    results.forEach(result => {
      assert.include(
        pointers,
        result['pointer'],
        'There is a pointer for each result'
      )
    })
  })
})

describe(`cssToPointer`, () => {
  it(`returns the first item of an array`, () => {
    assert.equal(cssToPointer(['foo', 'bar']), 'foo')
  })

  it(`returns the first item of a nested array`, () => {
    assert.equal(cssToPointer([['foo', 'bar'], 'baz']), 'foo')
  })
})
