// 範例輸入: KnowledgeKing_PlayAgain.in
// 範例輸出: KnowledgeKing_PlayAgain.out

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { login, newMessage, started, TimeUnit, timeElapsed } from './utils'

const testcaseDir = dirname(fileURLToPath(import.meta.url))
const baseName = 'KnowledgeKing_PlayAgain'

function readExpectedOutput(): string {
  return readFileSync(join(testcaseDir, `${baseName}.out`), 'utf-8').trimEnd()
}

describe('KnowledgeKing_PlayAgain', () => {
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

    // [started] {"time": "2023-08-07 00:00:00", "quota": 20}
    const waterballCommunity = started({
      time: '2023-08-07 00:00:00',
      quota: 20,
    })

    // [login] {"userId": "1", "isAdmin": true}
    const member1 = login({
      waterballCommunity,
      userId: '1',
      isAdmin: true,
    })

    // [new message] {"authorId": "1", "content": "king", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: 'king',
      tags: ['bot'],
    })

    // [1 hours elapsed]
    timeElapsed({ n: 1, unit: TimeUnit.hours })

    // [5 seconds elapsed]
    timeElapsed({ n: 5, unit: TimeUnit.seconds })

    // [new message] {"authorId": "1", "content": "play again", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: 'play again',
      tags: ['bot'],
    })

    // [end]
    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
