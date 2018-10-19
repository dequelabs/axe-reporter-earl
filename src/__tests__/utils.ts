import { RawResult } from '../types'
import * as clone from 'clone'
import * as axe from 'axe-core'

let _dummyData: RawResult[]
export async function getDummyData(version = '3.1') {
  if (!_dummyData) {
    document.body.innerHTML = `
      <h1>My page </h1>
      <main>
        <p>Some page</p>
        <p><input type="text"> Failing input field</p>
      </main>
    `
    axe.configure({
      // @ts-ignore:
      reporter: function(raw, _, callback) {
        callback(JSON.parse(JSON.stringify(raw)))
      }
    })
    // @ts-ignore:
    _dummyData = await axe.run()
  }
  return clone(_dummyData).map((result: RawResult) => {
    result.helpUrl = result.helpUrl.replace(
      /axe\/([1-9][0-9]*\.[1-9][0-9]*)\//,
      `axe/${version}/`
    )
    return result
  })
}
