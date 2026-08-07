// 範例輸入: knowledge-king.timeout.in
// 範例輸出: knowledge-king.timeout.out

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
const baseName = 'knowledge-king.timeout'

function readExpectedOutput(): string {
  return readFileSync(join(testcaseDir, `${baseName}.out`), 'utf-8').trimEnd()
}

describe('knowledge-king.timeout', () => {
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

    // [login] {"userId": "2".."4", "isAdmin": false}
    const member2 = login({
      waterballCommunity,
      userId: '2',
      isAdmin: false,
    })
    const member3 = login({
      waterballCommunity,
      userId: '3',
      isAdmin: false,
    })
    const member4 = login({
      waterballCommunity,
      userId: '4',
      isAdmin: false,
    })

    // [new message] {"authorId": "1", "content": "king", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: 'king',
      tags: ['bot'],
    })

    // [3 seconds elapsed]
    timeElapsed({ n: 3, unit: TimeUnit.seconds })

    // [new message] {"authorId": "3", "content": "開始遊戲了！", "tags": ["1","2","3","4","5"]}
    newMessage({
      waterballCommunity,
      authorId: member3.getId(),
      content: '開始遊戲了！',
      tags: ['1', '2', '3', '4', '5'],
    })

    // [new message] {"authorId": "2", "content": "A", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member2.getId(),
      content: 'A',
      tags: ['bot'],
    })

    // [new message] {"authorId": "1", "content": "我先去吃飯好了", "tags": ["1", "2", "3", "4", "5"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: '我先去吃飯好了',
      tags: ['1', '2', '3', '4', '5'],
    })

    // [3 minutes elapsed]
    timeElapsed({ n: 3, unit: TimeUnit.minutes })

    // [new message] {"authorId": "3", "content": "也是，先吃飯", "tags": ["1", "2", "3", "4", "5"]}
    newMessage({
      waterballCommunity,
      authorId: member3.getId(),
      content: '也是，先吃飯',
      tags: ['1', '2', '3', '4', '5'],
    })

    // [3 minutes elapsed]
    timeElapsed({ n: 3, unit: TimeUnit.minutes })

    // [new message] {"authorId": "2", "content": "好啦，先吃飯", "tags": []}
    newMessage({
      waterballCommunity,
      authorId: member2.getId(),
      content: '好啦，先吃飯',
      tags: [],
    })

    // [30 minutes elapsed]
    timeElapsed({ n: 30, unit: TimeUnit.minutes })

    // [new message] {"authorId": "4", "content": "好好，先吃飯", "tags": []}
    newMessage({
      waterballCommunity,
      authorId: member4.getId(),
      content: '好好，先吃飯',
      tags: [],
    })

    // [27 minutes elapsed] — Q1 answer window (1 hour) ends; winner is 2
    timeElapsed({ n: 27, unit: TimeUnit.minutes })

    // [new message] {"authorId": "2", "content": "哈，好險我有偷回答，又是我贏。", "tags": ["1", "2", "3", "4", "5"]}
    newMessage({
      waterballCommunity,
      authorId: member2.getId(),
      content: '哈，好險我有偷回答，又是我贏。',
      tags: ['1', '2', '3', '4', '5'],
    })

    // [end]
    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
