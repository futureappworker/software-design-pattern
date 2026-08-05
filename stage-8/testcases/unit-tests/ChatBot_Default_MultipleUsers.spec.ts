// 範例輸入: ChatBot_Default_MultipleUsers.in
// 範例輸出: ChatBot_Default_MultipleUsers.out

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { login, newMessage, started } from './utils'

const testcaseDir = dirname(fileURLToPath(import.meta.url))
const baseName = 'ChatBot_Default_MultipleUsers'

function readExpectedOutput(): string {
  return readFileSync(join(testcaseDir, `${baseName}.out`), 'utf-8').trimEnd()
}

describe('ChatBot_Default_MultipleUsers', () => {
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
    const waterballCommunity = started({ time: '2023-08-07 00:00:00', quota: 20 })

    // [login] {"userId": "1", "isAdmin": false}
    const member1 = login({ waterballCommunity, userId: '1', isAdmin: false })

    // [login] {"userId": "2", "isAdmin": false}
    const member2 = login({ waterballCommunity, userId: '2', isAdmin: false })

    // [new message] {"authorId": "1", "content": "Hello from user1", "tags": []}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: 'Hello from user1',
      tags: [],
    })

    // [new message] {"authorId": "2", "content": "Hello from user2", "tags": []}
    newMessage({
      waterballCommunity,
      authorId: member2.getId(),
      content: 'Hello from user2',
      tags: [],
    })

    // [end]
    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
