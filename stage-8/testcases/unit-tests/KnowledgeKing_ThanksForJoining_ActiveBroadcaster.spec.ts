// 範例輸入: KnowledgeKing_ThanksForJoining_ActiveBroadcaster.in
// 範例輸出: KnowledgeKing_ThanksForJoining_ActiveBroadcaster.out

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  goBroadcasting,
  login,
  newMessage,
  started,
  TimeUnit,
  timeElapsed,
} from './utils'

const testcaseDir = dirname(fileURLToPath(import.meta.url))
const baseName = 'KnowledgeKing_ThanksForJoining_ActiveBroadcaster'

function readExpectedOutput(): string {
  return readFileSync(join(testcaseDir, `${baseName}.out`), 'utf-8').trimEnd()
}

describe('KnowledgeKing_ThanksForJoining_ActiveBroadcaster', () => {
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

    // [go broadcasting] {"speakerId": "2"}
    goBroadcasting({ waterballCommunity, speakerId: member2.getId() })

    // [new message] {"authorId": "admin", "content": "king", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: admin.getId(),
      content: 'king',
      tags: ['bot'],
    })

    // [new message] {"authorId": "1", "content": "A", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: 'A',
      tags: ['bot'],
    })

    // [new message] {"authorId": "1", "content": "C", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: 'C',
      tags: ['bot'],
    })

    // [new message] {"authorId": "1", "content": "A", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: 'A',
      tags: ['bot'],
    })

    // [20 seconds elapsed]
    timeElapsed({ n: 20, unit: TimeUnit.seconds })

    // [end]
    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
