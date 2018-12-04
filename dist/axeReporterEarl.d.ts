import { RawResult, EarlResult } from './types'
export default function axeReporterEarl(
  rawResults: RawResult[],
  {  }: {},
  callback: Function
): void
export declare function createEarlReport(
  rawResults: RawResult[],
  url?: string
): EarlResult
