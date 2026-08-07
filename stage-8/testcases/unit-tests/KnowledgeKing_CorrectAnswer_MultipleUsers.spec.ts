// 範例輸入: KnowledgeKing_CorrectAnswer_MultipleUsers.in
// 範例輸出: KnowledgeKing_CorrectAnswer_MultipleUsers.out

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { login, newMessage, started } from './utils'

const testcaseDir = dirname(fileURLToPath(import.meta.url))
const baseName = 'KnowledgeKing_CorrectAnswer_MultipleUsers'

function readExpectedOutput(): string {
  return readFileSync(join(testcaseDir, `${baseName}.out`), 'utf-8').trimEnd()
}

describe('KnowledgeKing_CorrectAnswer_MultipleUsers', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('matches expected output', () => {
    const expectedOutput = readExpectedOutput()
    const outputLines: string[] = []

    vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
      outputLines.push(args.map(String).join(' '))
    })

    // [started] {"time": "2023-08-07 00:00:00", "quota": 10}
    const waterballCommunity = started({
      time: '2023-08-07 00:00:00',
      quota: 10,
    })

    // [login] {"userId": "admin", "isAdmin": true}
    const admin = login({
      waterballCommunity,
      userId: 'admin',
      isAdmin: true,
    })

    // [new message] {"authorId": "admin", "content": "king", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: admin.getId(),
      content: 'king',
      tags: ['bot'],
    })

    // [login] {"userId": "1", "isAdmin": false}
    const member1 = login({
      waterballCommunity,
      userId: '1',
      isAdmin: false,
    })

    // [login] {"userId": "2", "isAdmin": false}
    const member2 = login({
      waterballCommunity,
      userId: '2',
      isAdmin: false,
    })

    // [login] {"userId": "3", "isAdmin": false}
    const member3 = login({
      waterballCommunity,
      userId: '3',
      isAdmin: false,
    })

    // [new message] {"authorId": "1", "content": "B", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: 'B',
      tags: ['bot'],
    })

    // [new message] {"authorId": "2", "content": "A", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member2.getId(),
      content: 'A',
      tags: ['bot'],
    })

    // [new message] {"authorId": "3", "content": "A", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member3.getId(),
      content: 'A',
      tags: ['bot'],
    })

    // [end]
    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
