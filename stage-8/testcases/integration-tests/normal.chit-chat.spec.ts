// 範例輸入: normal.chit-chat.in
// 範例輸出: normal.chit-chat.out

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  login,
  newMessage,
  newPost,
  started,
  TimeUnit,
  timeElapsed,
} from '../test-utils'

const testcaseDir = dirname(fileURLToPath(import.meta.url))
const baseName = 'normal.chit-chat'

function readExpectedOutput(): string {
  return readFileSync(join(testcaseDir, `${baseName}.out`), 'utf-8').trimEnd()
}

describe('normal.chit-chat', () => {
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

    // [10 seconds elapsed]
    timeElapsed({ n: 10, unit: TimeUnit.seconds })

    // [new message] {"authorId": "1", "content": "大家早安，今天我第一天上班呢", "tags": []}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: '大家早安，今天我第一天上班呢',
      tags: [],
    })

    // [7 seconds elapsed]
    timeElapsed({ n: 7, unit: TimeUnit.seconds })

    // [new message] {"authorId": "4", "content": "祝大家今天事事順利", "tags": ["1"]}
    newMessage({
      waterballCommunity,
      authorId: member4.getId(),
      content: '祝大家今天事事順利',
      tags: ['1'],
    })

    // [new message] {"authorId": "5", "content": "嗯嗯嗯！", "tags": []}
    newMessage({
      waterballCommunity,
      authorId: member5.getId(),
      content: '嗯嗯嗯！',
      tags: [],
    })

    // [3 seconds elapsed]
    timeElapsed({ n: 3, unit: TimeUnit.seconds })

    // [new message] {"authorId": "5", "content": "還行啊", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member5.getId(),
      content: '還行啊',
      tags: ['bot'],
    })

    // [new post] {"id": "1", "authorId": "2", "title":"物件導向冷知識", ...}
    newPost({
      waterballCommunity,
      id: '1',
      authorId: member2.getId(),
      title: '物件導向冷知識',
      content:
        '和大家分享一個冷知識，其實是先有「物件」才有「類別」喔！大家學會了嗎？',
      tags: [],
    })

    // [new message] {"authorId": "3", "content": "哈哈哈，今天有點疲憊呢，不想上班", "tags": ["1", "2", "4"]}
    newMessage({
      waterballCommunity,
      authorId: member3.getId(),
      content: '哈哈哈，今天有點疲憊呢，不想上班',
      tags: ['1', '2', '4'],
    })

    // [new message] {"authorId": "2", "content": "你看看他和你說謝謝呢，上班加油", "tags": ["3", "bot"]}
    newMessage({
      waterballCommunity,
      authorId: member2.getId(),
      content: '你看看他和你說謝謝呢，上班加油',
      tags: ['3', 'bot'],
    })

    // [new post] {"id": "2", "authorId": "4", ...}
    newPost({
      waterballCommunity,
      id: '2',
      authorId: member4.getId(),
      title: '分享一個關於 單一職責原則 的笑話，每次講起來都還是覺得很好笑',
      content:
        '(1) 欸你這個類別這樣做太多事了吧，違反單一職責原則啊，每個類別只能有一個職責，只能做一件事。 (2) 這個類別，確實只做一件事，那就是實現需求！',
      tags: ['1', '2', '3'],
    })

    // [new message] {"authorId": "2", "content": "發了一個文，分享笑話，哈哈", "tags": []}
    newMessage({
      waterballCommunity,
      authorId: member2.getId(),
      content: '發了一個文，分享笑話，哈哈',
      tags: [],
    })

    // [end]
    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
