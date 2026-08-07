// 範例輸入: KnowledgeKing_TieGame.in
// 範例輸出: KnowledgeKing_TieGame.out

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { login, newMessage, started, TimeUnit, timeElapsed } from './utils'

const testcaseDir = dirname(fileURLToPath(import.meta.url))
const baseName = 'KnowledgeKing_TieGame'

function readExpectedOutput(): string {
  return readFileSync(join(testcaseDir, `${baseName}.out`), 'utf-8').trimEnd()
}

describe('KnowledgeKing_TieGame', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
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

    // [new message] {"authorId": "1", "content": "A", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: 'A',
      tags: ['bot'],
    })

    // [new message] {"authorId": "2", "content": "C", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member2.getId(),
      content: 'C',
      tags: ['bot'],
    })

    // [1 hours elapsed]
    timeElapsed({ n: 1, unit: TimeUnit.hours })

    // [end]
    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
