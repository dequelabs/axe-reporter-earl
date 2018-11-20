import { RawResult, EarlResult, EarlType } from './types'
import * as context from './context.json'
import axeResultToAssertion from './axeResultToEarl'

export default function axeEarlReporter(
  rawResults: RawResult[],
  {},
  callback: Function
) {
  callback(createEarlReport(rawResults))
}

export function createEarlReport(
  rawResults: RawResult[]
): EarlResult {
  return {
    '@context': context,
    '@type': EarlType.WebPage,
    url: window.location.href,
    assertions: axeResultToAssertion(rawResults)
  }
}
