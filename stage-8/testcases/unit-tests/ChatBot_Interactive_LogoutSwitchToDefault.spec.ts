// 範例輸入: ChatBot_Interactive_LogoutSwitchToDefault.in
// 範例輸出: ChatBot_Interactive_LogoutSwitchToDefault.out

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { login, logout, newMessage, started } from '../test-utils'

const testcaseDir = dirname(fileURLToPath(import.meta.url))
const baseName = 'ChatBot_Interactive_LogoutSwitchToDefault'

function readExpectedOutput(): string {
  return readFileSync(join(testcaseDir, `${baseName}.out`), 'utf-8').trimEnd()
}

describe('ChatBot_Interactive_LogoutSwitchToDefault', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('matches expected output', () => {
    const expectedOutput = readExpectedOutput()
    const outputLines: string[] = []

    vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
      outputLines.push(args.map(String).join(' '))
    })

    // [started] {"time": "2023-08-07 00:00:00", "quota": 20}
    const waterballCommunity = started({
      time: '2023-08-07 00:00:00',
      quota: 20,
    })

    // [login] {"userId": "1".."9", "isAdmin": false}
    const members = Array.from({ length: 9 }, (_, i) =>
      login({
        waterballCommunity,
        userId: String(i + 1),
        isAdmin: false,
      }),
    )

    // [logout] {"userId": "9"}
    logout({ waterballCommunity, userId: members[8].getId() })

    // [new message] {"authorId": "1", "content": "Now we only have 9 people online", "tags": []}
    newMessage({
      waterballCommunity,
      authorId: members[0].getId(),
      content: 'Now we only have 9 people online',
      tags: [],
    })

    // [end]
    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
