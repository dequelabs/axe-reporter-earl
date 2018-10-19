import { assert } from 'chai'
// @ts-ignore:
import * as jsonld from 'jsonld'
import * as axe from 'axe-core'
import { getDummyData } from './utils'
import axeEarlReporter, { createEarlReport } from '../axeReporterEarl'
import * as context from '../context.json'
import { RawResult } from '../types'

describe(`createEarlReport`, () => {
  let dummyData: RawResult[]
  beforeEach(async () => {
    dummyData = await getDummyData()
  })

  it(`returns the @context object`, () => {
    const earlReport = createEarlReport(dummyData)
    assert.deepEqual(earlReport['@context'], context)
  })

  it(`returns with "@type": "WebPage"`, async () => {
    const earlReport = createEarlReport(dummyData)
    assert.equal(earlReport['@type'], 'WebPage')
  })

  it(`returns with "assertions": Array`, () => {
    const earlReport = createEarlReport(dummyData)
    assert.isArray(earlReport.assertions)
  })

  it(`returns { url } from window.location.href `, () => {
    const earlReport = createEarlReport(dummyData)
    assert.isDefined(window.location.href)
    assert.equal(earlReport['url'], window.location.href)
  })

  it(`returns valid JSON-LD`, async () => {
    const earlReport = createEarlReport(dummyData)
    await jsonld.flatten(earlReport)
  })

  it(`loses no data when transformed with jsonld`, async () => {
    const earlReport = createEarlReport([
      {
        id: 'foo',
        description:
          'Ensures role attribute has an appropriate value for the element',
        helpUrl: 'https://dequeuniversity.com/rules/axe/3.1/foo'
      },
      {
        id: 'bar',
        description:
          'Ensures role attribute has an appropriate value for the element',
        helpUrl: 'https://dequeuniversity.com/rules/axe/3.1/bar',
        passes: [
          {
            node: { selector: ['#foo'] }
          }
        ]
      },
      {
        id: 'baz',
        description: 'Ensures baz',
        helpUrl: 'https://dequeuniversity.com/rules/axe/3.1/baz',
        incomplete: [
          {
            node: { selector: ['#foo'] }
          }
        ]
      }
    ])

    const context = {
      earl: 'http://www.w3.org/ns/earl#',
      sch: 'https://schema.org/',
      dct: 'http://purl.org/dc/terms#',
      'axe-version':
        'https://github.com/dequelabs/axe-core/releases/tag/',
      'dqu-page': 'https://dequeuniversity.com/rules/axe/'
    }

    const compact = await jsonld.compact(earlReport, context)
    assert.deepEqual(compact, {
      '@context': context,
      '@type': 'sch:WebPage',
      'dct:source': window.location.href,
      '@reverse': {
        'earl:subject': [
          {
            '@type': 'earl:Assertion',
            'earl:assertedBy': { '@id': 'axe-version:3.1.0' },
            'earl:mode': { '@id': 'earl:automatic' },
            'earl:result': {
              '@type': 'earl:TestResult',
              'earl:outcome': { '@id': 'earl:inapplicable' }
            },
            'earl:test': {
              '@id': 'dqu-page:3.1/foo',
              '@type': 'earl:TestCase'
            }
          },
          {
            '@type': 'earl:Assertion',
            'earl:assertedBy': { '@id': 'axe-version:3.1.0' },
            'earl:mode': { '@id': 'earl:automatic' },
            'earl:result': {
              '@type': 'earl:TestResult',
              'earl:info':
                'Ensures role attribute has an appropriate value for the element',
              'earl:outcome': { '@id': 'earl:undefined' },
              'earl:pointer': {
                '@type': 'ptr:CSSSelectorPointer',
                '@value': '#foo'
              }
            },
            'earl:test': {
              '@id': 'dqu-page:3.1/bar',
              '@type': 'earl:TestCase'
            }
          },
          {
            '@type': 'earl:Assertion',
            'earl:assertedBy': { '@id': 'axe-version:3.1.0' },
            'earl:mode': { '@id': 'earl:automatic' },
            'earl:result': {
              '@type': 'earl:TestResult',
              'earl:info': 'Ensures baz',
              'earl:outcome': { '@id': 'earl:undefined' },
              'earl:pointer': {
                '@type': 'ptr:CSSSelectorPointer',
                '@value': '#foo'
              }
            },
            'earl:test': {
              '@id': 'dqu-page:3.1/baz',
              '@type': 'earl:TestCase'
            }
          }
        ]
      }
    })
  })
})

describe(`axeEarlReporter`, () => {
  test(`runs with axe-core`, async () => {
    document.body.innerHTML = `
      <h1>My page </h1>
      <main>
        <p>Some page</p>
        <p><input type="text"> Failing input field</p>
      </main>
    `
    // Run axe
    const earlResults = await axe.run({
      // @ts-ignore:
      reporter: axeEarlReporter
    })
    assert.isDefined(earlResults['@context'])
  })
})
