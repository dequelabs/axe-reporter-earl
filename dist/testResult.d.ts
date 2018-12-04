import {
  RawResult,
  RawNodeResult,
  TestResult,
  Selector
} from './types'
export default function testResult(
  { description }: RawResult,
  outcomes?: RawNodeResult[]
): TestResult[]
export declare function cssToPointer(selector: Selector): string
