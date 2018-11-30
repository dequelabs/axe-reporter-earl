import { RawResult, EarlResult, EarlType } from './types'
import * as context from './context.json'
import axeResultToAssertion from './axeResultToEarl'

export default function axeReporterEarl(
  rawResults: RawResult[],
  {},
  callback: Function
) {
  callback(createEarlReport(rawResults))
}

export function createEarlReport(
  rawResults: RawResult[],
  url?: string
): EarlResult {
  debugger
  return {
    '@context': context,
    '@type': EarlType.WebPage,
    url: url ? url : window.location.href,
    assertions: axeResultToAssertion(rawResults)
  }
}
