import axeResultToEarl from '../axeResultToEarl'
import { assert } from 'chai'
import { getDummyData } from './utils'
import testResult from '../testResult'
import { RawResult, RawNodeResult } from '../types'

let dummyData: RawResult[]
beforeEach(async () => {
  dummyData = await getDummyData()
})

const resultTypes = ['violations', 'passes', 'incomplete']
const outcomeMap = {
  violations: 'earl:failed',
  passes: 'earl:passed',
  incomplete: 'earl:cantTell'
}

test(`returns an array of assertions`, () => {
  assert.isArray(dummyData)
  assert.notEqual(dummyData.length, 0)

  const assertions = axeResultToEarl(dummyData)
  assert.isArray(assertions)
  assert.notEqual(assertions.length, 0)
})

test(`Assertions have {'assertedBy': axeReleaseUrl }`, async () => {
  const dummyData = await getDummyData('20.10')
  const assertions = axeResultToEarl(dummyData)
  assertions.forEach(assertion => {
    assert.equal(
      assertion['assertedBy'],
      'https://github.com/dequelabs/axe-core/releases/tag/20.10.0'
    )
  })
})

test(`Assertions have {'test': { '@type': 'TestCase', '@id': helpUrl } }`, () => {
  const helpUrls = dummyData.map(({ helpUrl }) => helpUrl)
  const assertions = axeResultToEarl(dummyData)
  assertions.forEach(assertion => {
    assert.isObject(assertion['test'])
    assert.include(helpUrls, assertion['test']['@id'])
  })
})

test(`Rules without results get an 'earl:inapplicable' assertion`, () => {
  const assertions = axeResultToEarl(dummyData)
  const inapplicableData = dummyData.filter(
    ({ violations, passes, incomplete }) => {
      return (
        (!violations || violations.length === 0) &&
        (!passes || passes.length === 0) &&
        (!incomplete || incomplete.length === 0)
      )
    }
  )
  assert.notEqual(inapplicableData.length, 0)
  inapplicableData.forEach(ruleData => {
    let ruleAsserts = assertions.filter(assertion => {
      return assertion.test['@id'].includes(`/${ruleData.id}?`)
    })
    assert.lengthOf(
      ruleAsserts,
      1,
      'One inapplicable assertion per inapplicable rule'
    )
    assert.equal(ruleAsserts[0].result.outcome, 'earl:inapplicable')
  })
})

resultTypes.forEach(type =>
  describe(`result type ${type}`, () => {
    test(`Assertions include all ${type}`, () => {
      const assertions = axeResultToEarl(dummyData)

      dummyData.forEach(ruleData => {
        const rawResult: RawNodeResult[] = (ruleData as any)[type]
        assert.isDefined(rawResult)
        const outcomeType: string = (outcomeMap as any)[type]
        assert.isDefined(outcomeType)

        const ruleAsserts = assertions
          .filter(assertion => {
            return assertion.test['@id'].includes(`/${ruleData.id}?`)
          })
          .filter(({ result }) => result.outcome === outcomeType)

        assert.equal(
          rawResult.length,
          ruleAsserts.length,
          'Expect to see an assert for each result'
        )

        const expectAssert = testResult(ruleData, rawResult)
        ruleAsserts.forEach(ruleAssert => {
          assert.deepInclude(
            expectAssert,
            ruleAssert.result,
            'Each result from axe corresponds to an assertion'
          )
        })
      })
    })
  })
)
