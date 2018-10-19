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
  if (Array.isArray(selector[0])) {
    return selector[0][0]
  }
  // @ts-ignore:
  return selector[0]
}
