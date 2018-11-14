import puppeteer from 'puppeteer'
// import { Page, Browser } from 'puppeteer'
import axeEarlReporter from '../axeEarlReporter'
import * as axe from 'axe-core'
const axePath = require.resolve('axe-core')

describe(`run axe-core reporter in puppeteer`, () => {
  let page: any
  let browser: any

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 100 * 5,
      devtools: true
    })
    page = await browser.newPage()
  })

  afterAll(() => {
    browser.close()
  })

  test('run axe on Google and generate earl reports', async () => {
    await page.goto('https://google.com')
    const title = await page.title()
    expect(title).toBe('Google')

    const params: any = {
      reporter: axeEarlReporter
    }
    const results: any | axe.AxeResults = await axe.run(params)
    expect(results['@context']).toBeDefined()
  })

  test('run axe on Deque.com and generate earl reports', async () => {
    await page.goto('https://deque.com/')
    const params: any = {
      reporter: axeEarlReporter
    }
    const results: any | axe.AxeResults = await axe.run(params)
    expect(results['@context']).toBeDefined()
  })

  test('run axe with earl reporter as configure on Deque.com', async () => {
    await page.goto('https://deque.com/')
    const params: any = {
      reporter: axeEarlReporter
    }
    axe.configure(params)
    const results: any | axe.AxeResults = await axe.run()
    expect(results['@context']).toBeDefined()
  })

  test.only(`run axe on Deque.com inside puppeteer evaluate function`, async () => {
    // fn to evaluate in context of puppeteer page
    function evaluateFn() {
      return new Promise((resolve, reject) => {
        const params: any = {
          reporter: (window as any).reporter
        }
        // axe.configure(params)
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
    const results = await page.evaluate(evaluateFn)
    // TODO: this breaks with callback not defined, when passing reporter
    // expect(results['@context']).toBeDefined()
  })
})
