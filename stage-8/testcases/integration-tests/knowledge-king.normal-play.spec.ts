// 範例輸入: knowledge-king.normal-play.in
// 範例輸出: knowledge-king.normal-play.out

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
const baseName = 'knowledge-king.normal-play'

function readExpectedOutput(): string {
  return readFileSync(join(testcaseDir, `${baseName}.out`), 'utf-8').trimEnd()
}

describe('knowledge-king.normal-play', () => {
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
    const member5 = login({
      waterballCommunity,
      userId: '5',
      isAdmin: false,
    })

    // [new message] {"authorId": "2", "content": "king", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member2.getId(),
      content: 'king',
      tags: ['bot'],
    })

    // [new message] {"authorId": "1", "content": "king", "tags": ["2"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: 'king',
      tags: ['2'],
    })

    // [3 seconds elapsed]
    timeElapsed({ n: 3, unit: TimeUnit.seconds })

    // [new message] {"authorId": "2", "content": "怎麼不能用", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member2.getId(),
      content: '怎麼不能用',
      tags: ['bot'],
    })

    // [new message] {"authorId": "4", "content": "要 admin 才能用這個指令吧", "tags": ["2"]}
    newMessage({
      waterballCommunity,
      authorId: member4.getId(),
      content: '要 admin 才能用這個指令吧',
      tags: ['2'],
    })

    // [new message] {"authorId": "1", "content": "king", "tags": ["2", "bot"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: 'king',
      tags: ['2', 'bot'],
    })

    // [new message] {"authorId": "3", "content": "開始遊戲了！", "tags": ["1","2","3","4","5"]}
    newMessage({
      waterballCommunity,
      authorId: member3.getId(),
      content: '開始遊戲了！',
      tags: ['1', '2', '3', '4', '5'],
    })

    // [new message] answers without @bot
    newMessage({
      waterballCommunity,
      authorId: member2.getId(),
      content: 'A',
      tags: [],
    })
    newMessage({
      waterballCommunity,
      authorId: member3.getId(),
      content: 'B',
      tags: [],
    })

    // [new message] {"authorId": "1", "content": "record", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: 'record',
      tags: ['bot'],
    })

    // [new message] {"authorId": "5", "content": "D", "tags": []}
    newMessage({
      waterballCommunity,
      authorId: member5.getId(),
      content: 'D',
      tags: [],
    })

    // [3 seconds elapsed]
    timeElapsed({ n: 3, unit: TimeUnit.seconds })

    // [new message] {"authorId": "1", "content": "你們要標他才行", "tags": ["2", "3", "5"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: '你們要標他才行',
      tags: ['2', '3', '5'],
    })

    // [new message] {"authorId": "1", "content": "A", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: 'A',
      tags: ['bot'],
    })

    // [new message] {"authorId": "4", "content": "可惡！！", "tags": ["1"]}
    newMessage({
      waterballCommunity,
      authorId: member4.getId(),
      content: '可惡！！',
      tags: ['1'],
    })

    // [3 seconds elapsed]
    timeElapsed({ n: 3, unit: TimeUnit.seconds })

    // [new message] {"authorId": "2", "content": "看我一個鬥智鬥勇！", "tags": []}
    newMessage({
      waterballCommunity,
      authorId: member2.getId(),
      content: '看我一個鬥智鬥勇！',
      tags: [],
    })

    // [3 seconds elapsed]
    timeElapsed({ n: 3, unit: TimeUnit.seconds })

    // [new message] {"authorId": "2", "content": "C", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member2.getId(),
      content: 'C',
      tags: ['bot'],
    })

    // [new message] {"authorId": "1", "content": "C", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: 'C',
      tags: ['bot'],
    })

    // [3 seconds elapsed]
    timeElapsed({ n: 3, unit: TimeUnit.seconds })

    // [new message] {"authorId": "2", "content": "A", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member2.getId(),
      content: 'A',
      tags: ['bot'],
    })

    // [3 seconds elapsed]
    timeElapsed({ n: 3, unit: TimeUnit.seconds })

    // [new message] {"authorId": "2", "content": "哈我贏了", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member2.getId(),
      content: '哈我贏了',
      tags: ['bot'],
    })

    // [3 seconds elapsed]
    timeElapsed({ n: 3, unit: TimeUnit.seconds })

    // [new message] {"authorId": "4", "content": "再玩一次啦", "tags": ["1", "2", "3", "4", "5"]}
    newMessage({
      waterballCommunity,
      authorId: member4.getId(),
      content: '再玩一次啦',
      tags: ['1', '2', '3', '4', '5'],
    })

    // [3 seconds elapsed]
    timeElapsed({ n: 3, unit: TimeUnit.seconds })

    // [new message] {"authorId": "2", "content": "好啊", "tags": ["4"]}
    newMessage({
      waterballCommunity,
      authorId: member2.getId(),
      content: '好啊',
      tags: ['4'],
    })

    // [new message] {"authorId": "2", "content": "play again", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member2.getId(),
      content: 'play again',
      tags: ['bot'],
    })

    // [3 minutes elapsed]
    timeElapsed({ n: 3, unit: TimeUnit.minutes })

    // [new message] {"authorId": "3", "content": "A", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member3.getId(),
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

    // [new message] {"authorId": "2", "content": "A", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member2.getId(),
      content: 'A',
      tags: ['bot'],
    })

    // [10 seconds elapsed]
    timeElapsed({ n: 10, unit: TimeUnit.seconds })

    // [new message] {"authorId": "3", "content": "你也太快了吧", "tags": ["2"]}
    newMessage({
      waterballCommunity,
      authorId: member3.getId(),
      content: '你也太快了吧',
      tags: ['2'],
    })

    // [10 seconds elapsed]
    timeElapsed({ n: 10, unit: TimeUnit.seconds })

    // [new message] {"authorId": "2", "content": "還好啦", "tags": ["3"]}
    newMessage({
      waterballCommunity,
      authorId: member2.getId(),
      content: '還好啦',
      tags: ['3'],
    })

    // [new message] {"authorId": "4", "content": "可惡，沒玩到⋯⋯", "tags": []}
    newMessage({
      waterballCommunity,
      authorId: member4.getId(),
      content: '可惡，沒玩到⋯⋯',
      tags: [],
    })

    // [end]
    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
