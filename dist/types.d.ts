export declare enum EarlType {
  WebPage = 'WebPage',
  Assertion = 'Assertion',
  TestCase = 'TestCase',
  TestResult = 'TestResult'
}
export interface EarlResult {
  '@context': object
  '@type': EarlType.WebPage
  url: string
  assertions: Assertion[]
}
export interface Assertion {
  '@type': EarlType.Assertion
  mode: 'earl:automatic'
  assertedBy: Object
  test: {
    '@type': EarlType.TestCase
    '@id': string
  }
  result: TestResult
}
export interface TestResult {
  '@type': EarlType.TestResult
  outcome: string
  pointer?: string
  info?: string
}
export interface RawResult {
  id: string
  helpUrl: string
  description: string
  violations?: RawNodeResult[]
  passes?: RawNodeResult[]
  incomplete?: RawNodeResult[]
}
export interface RawNodeResult {
  node: {
    selector: Selector
  }
  result?: 'passed' | 'failed' | 'inapplicable' | 'incomplete'
}
export declare type SelectorItem = string[] | string
export declare type Selector = SelectorItem[]
