// 範例輸入: ChatBot_Interactive_MessageCycle.in
// 範例輸出: ChatBot_Interactive_MessageCycle.out

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { login, newMessage, started } from './utils'

const testcaseDir = dirname(fileURLToPath(import.meta.url))
const baseName = 'ChatBot_Interactive_MessageCycle'

function readExpectedOutput(): string {
  return readFileSync(join(testcaseDir, `${baseName}.out`), 'utf-8').trimEnd()
}

describe('ChatBot_Interactive_MessageCycle', () => {
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

    // [new message] {"authorId": "1", "content": "Message A", "tags": []}
    newMessage({
      waterballCommunity,
      authorId: members[0].getId(),
      content: 'Message A',
      tags: [],
    })

    // [new message] {"authorId": "1", "content": "Message B", "tags": []}
    newMessage({
      waterballCommunity,
      authorId: members[0].getId(),
      content: 'Message B',
      tags: [],
    })

    // [new message] {"authorId": "1", "content": "Message C", "tags": []}
    newMessage({
      waterballCommunity,
      authorId: members[0].getId(),
      content: 'Message C',
      tags: [],
    })

    // [end]
    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
