// 範例輸入: knowledge-king.stop.in
// 範例輸出: knowledge-king.stop.out

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
const baseName = 'knowledge-king.stop'

function readExpectedOutput(): string {
  return readFileSync(join(testcaseDir, `${baseName}.out`), 'utf-8').trimEnd()
}

describe('knowledge-king.stop', () => {
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

    // [login] {"userId": "2".."5", "isAdmin": false}
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
    login({ waterballCommunity, userId: '5', isAdmin: false })

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

    // [new message] {"authorId": "2", "content": "king-stop", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member2.getId(),
      content: 'king-stop',
      tags: ['bot'],
    })

    // [30 minutes elapsed]
    timeElapsed({ n: 30, unit: TimeUnit.minutes })

    // [new message] {"authorId": "4", "content": "king-stop", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member4.getId(),
      content: 'king-stop',
      tags: ['bot'],
    })

    // [new message] {"authorId": "4", "content": "喔喔只能 admin 才能下這指令嗎", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member4.getId(),
      content: '喔喔只能 admin 才能下這指令嗎',
      tags: ['bot'],
    })

    // [new message] {"authorId": "1", "content": "king-stop", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: 'king-stop',
      tags: ['bot'],
    })

    // [new message] {"authorId": "1", "content": "對啊", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: '對啊',
      tags: ['bot'],
    })

    // [new message] {"authorId": "1", "content": "不客氣", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: '不客氣',
      tags: ['bot'],
    })

    // [new message] {"authorId": "1", "content": "play-again", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: 'play-again',
      tags: ['bot'],
    })

    // [end]
    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
