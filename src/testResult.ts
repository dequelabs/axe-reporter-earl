import {
  RawResult,
  RawNodeResult,
  TestResult,
  Selector
} from './types'

export default function testResult(
  { description }: RawResult,
  outcomes: RawNodeResult[] = []
): TestResult[] {
  return outcomes.map(
    ({ node, result }): TestResult => {
      return {
        '@type': 'TestResult',
        info: description,
        outcome: 'earl:' + result,
        pointer: cssToPointer(node.selector)
      }
    }
  )
}

export function cssToPointer(selector: Selector): string {
  const item = selector[0]
  if (Array.isArray(item)) {
    return item[0]
  }
  return item
}
