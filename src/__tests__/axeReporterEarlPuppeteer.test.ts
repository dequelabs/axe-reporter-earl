import * as puppeteer from 'puppeteer'
import { Page, Browser } from 'puppeteer'
import axeEarlReporter from '../axeEarlReporter'
import * as axe from 'axe-core'
import { resolve } from 'dns'
const axePath = require.resolve('axe-core')

describe(`run axe-core reporter in puppeteer`, () => {
  const extendedTimeout = 5000
  let page: Page
  let browser: Browser

  beforeAll(async () => {
    browser = await puppeteer.launch()
    page = await browser.newPage()
  })

  afterAll(() => {
    browser.close()
  })

  test(
    'run axe on Google and generate earl reports',
    async () => {
      await page.goto('https://google.com')
      const title = await page.title()
      expect(title).toBe('Google')

      const params: any = {
        reporter: axeEarlReporter
      }
      const results: any | axe.AxeResults = await axe.run(params)
      expect(results['@context']).toBeDefined()
    },
    extendedTimeout
  )

  test(
    'run axe on Deque.com and generate earl reports',
    async () => {
      await page.goto('https://deque.com/')
      const params: any = {
        reporter: axeEarlReporter
      }
      const results: any | axe.AxeResults = await axe.run(params)
      expect(results['@context']).toBeDefined()
    },
    extendedTimeout
  )

  test(
    'run axe with earl reporter as configure on Deque.com',
    async () => {
      await page.goto('https://deque.com/')
      const params: any = {
        reporter: axeEarlReporter
      }
      axe.configure(params)
      const results: any | axe.AxeResults = await axe.run()
      expect(results['@context']).toBeDefined()
    },
    extendedTimeout
  )

  test(
    `run axe on Deque.com inside puppeteer evaluate function`,
    async () => {
      /**
       * Note:
       * When running axe with in a `page.evaluate` with a custom reporter like `axeEarlReporter`, there are a multiple of errors encountered (mostly undefined callback, or window not defined).
       *
       * To circumvent this issue, a dummy reporter is passed and the raw results are extracted, then passed to earl reporter
       */

      // fn to evaluate in context of puppeteer page
      function evaluateFn() {
        return new Promise((resolve, reject) => {
          const params: any = {
            reporter: (raw: any, _: any, callback: Function) => {
              callback(JSON.parse(JSON.stringify(raw)))
            }
          }
          axe.configure(params)
          axe
            .run()
            .then(result => resolve(result))
            .catch(err => reject(err))
        })
      }
      // expose reporter to window
      await page.exposeFunction('reporter', axeEarlReporter)
      // add axe script to page
      await page.addScriptTag({
        path: axePath
      })

      const rawResults: any = await page.evaluate(evaluateFn)

      const earlResults: any = await new Promise(resolve => {
        axeEarlReporter(rawResults, {}, (earlResults: any) => {
          resolve(earlResults)
        })
      })
      expect(earlResults['@context']).toBeDefined()
    },
    extendedTimeout
  )
})
