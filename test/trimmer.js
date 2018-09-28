import test from 'ava'

import constants from '../src/_constants'
import trimmer from '../src/trimmer'
const trim = trimmer()

const strings = [
  {
    initial: ' leading/trailing whitespace \n',
    expected: 'leading/trailing whitespace'
  },
  {
    initial: ` @${constants.HANDLE} \nadd go running `,
    expected: 'add go running'
  },
  {
    initial: `that's so sad @${constants.HANDLE} add cry for a long time`,
    expected: 'add cry for a long time'
  },
  {
    initial: `@dad check this out @${constants.HANDLE} add get @mom a present`,
    expected: 'add get @mom a present'
  },
  {
    initial: `@_tudubot @_tudubot check off running`,
    expected: `check off running`
  }
]

test('trims each string correctly', t => {
  t.plan(strings.length)

  for (var str of strings) {
    t.is(trim(str.initial), str.expected)
  }
})