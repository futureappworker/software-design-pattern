// 範例輸入: KnowledgeKing_TimeOut.in
// 範例輸出: KnowledgeKing_TimeOut.out

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  login,
  newMessage,
  started,
  TimeUnit,
  timeElapsed,
} from '../test-utils'

const testcaseDir = dirname(fileURLToPath(import.meta.url))
const baseName = 'KnowledgeKing_TimeOut'

function readExpectedOutput(): string {
  return readFileSync(join(testcaseDir, `${baseName}.out`), 'utf-8').trimEnd()
}

describe('KnowledgeKing_TimeOut', () => {
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

    // [1 hours elapsed]
    timeElapsed({ n: 1, unit: TimeUnit.hours })

    // [20 seconds elapsed]
    timeElapsed({ n: 20, unit: TimeUnit.seconds })

    // [end]
    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
