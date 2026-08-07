// 範例輸入: interaction.chit-chat.in
// 範例輸出: interaction.chit-chat.out

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  login,
  logout,
  newMessage,
  newPost,
  started,
  TimeUnit,
  timeElapsed,
} from '../test-utils'

const testcaseDir = dirname(fileURLToPath(import.meta.url))
const baseName = 'interaction.chit-chat'

function readExpectedOutput(): string {
  return readFileSync(join(testcaseDir, `${baseName}.out`), 'utf-8').trimEnd()
}

describe('interaction.chit-chat', () => {
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

    // [login] {"userId": "2".."6", "isAdmin": false}
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
    const member6 = login({
      waterballCommunity,
      userId: '6',
      isAdmin: false,
    })

    // [new message] {"authorId": "1", "content": "大家早安，今天我第一天上班呢", "tags": []}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: '大家早安，今天我第一天上班呢',
      tags: [],
    })

    // [login] {"userId": "7", "isAdmin": false}
    const member7 = login({
      waterballCommunity,
      userId: '7',
      isAdmin: false,
    })

    // [new message] {"authorId": "4", "content": "祝大家今天事事順利", "tags": ["1"]}
    newMessage({
      waterballCommunity,
      authorId: member4.getId(),
      content: '祝大家今天事事順利',
      tags: ['1'],
    })

    // [login] {"userId": "8", "isAdmin": false}
    const member8 = login({
      waterballCommunity,
      userId: '8',
      isAdmin: false,
    })

    // [10 seconds elapsed]
    timeElapsed({ n: 10, unit: TimeUnit.seconds })

    // [login] {"userId": "9", "isAdmin": false}
    const member9 = login({
      waterballCommunity,
      userId: '9',
      isAdmin: false,
    })

    // [new message] {"authorId": "1", "content": "wow 有 10 個人在線上了呢（包含機器人）", "tags": []}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: 'wow 有 10 個人在線上了呢（包含機器人）',
      tags: [],
    })

    // [new message] {"authorId": "1", "content": "大家早安，今天要吃麥當勞嗎？", "tags": []}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: '大家早安，今天要吃麥當勞嗎？',
      tags: [],
    })

    // [7 seconds elapsed]
    timeElapsed({ n: 7, unit: TimeUnit.seconds })

    // [new message] {"authorId": "4", "content": "是啊大家早安喔", "tags": ["1"]}
    newMessage({
      waterballCommunity,
      authorId: member4.getId(),
      content: '是啊大家早安喔',
      tags: ['1'],
    })

    // [new message] {"authorId": "5", "content": "別吧，吃肯德基好了", "tags": ["1"]}
    newMessage({
      waterballCommunity,
      authorId: member5.getId(),
      content: '別吧，吃肯德基好了',
      tags: ['1'],
    })

    // [3 seconds elapsed]
    timeElapsed({ n: 3, unit: TimeUnit.seconds })

    // [new message] {"authorId": "7", "content": "還行啊", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member7.getId(),
      content: '還行啊',
      tags: ['bot'],
    })

    // [new post] {"id": "1", "authorId": "9", ...}
    newPost({
      waterballCommunity,
      id: '1',
      authorId: member9.getId(),
      title: '物件導向冷知識',
      content:
        '和大家分享一個冷知識，其實是先有「物件」才有「類別」喔！大家學會了嗎？',
      tags: [],
    })

    // [new message] {"authorId": "6", "content": "哈哈哈，今天有點疲憊呢，不想上班", "tags": ["1", "2", "4"]}
    newMessage({
      waterballCommunity,
      authorId: member6.getId(),
      content: '哈哈哈，今天有點疲憊呢，不想上班',
      tags: ['1', '2', '4'],
    })

    // [new message] {"authorId": "2", "content": "你看看機器人同意你呢，別上班了", "tags": ["6", "bot"]}
    newMessage({
      waterballCommunity,
      authorId: member2.getId(),
      content: '你看看機器人同意你呢，別上班了',
      tags: ['6', 'bot'],
    })

    // [new post] {"id": "2", "authorId": "8", ...}
    newPost({
      waterballCommunity,
      id: '2',
      authorId: member8.getId(),
      title:
        '分享一個關於 單一職責原則 的笑話，每次講起來都還是覺得很好笑',
      content:
        '(1) 欸你這個類別這樣做太多事了吧，違反單一職責原則啊，每個類別只能有一個職責，只能做一件事。 (2) 這個類別，確實只做一件事，那就是實現需求！',
      tags: ['1', '2', '3'],
    })

    // [new message] {"authorId": "8", "content": "發了一個文，分享笑話，哈哈", "tags": []}
    newMessage({
      waterballCommunity,
      authorId: member8.getId(),
      content: '發了一個文，分享笑話，哈哈',
      tags: [],
    })

    // [logout] {"userId": "9"}..{"userId": "6"}
    logout({ waterballCommunity, userId: member9.getId() })
    logout({ waterballCommunity, userId: member8.getId() })
    logout({ waterballCommunity, userId: member7.getId() })
    logout({ waterballCommunity, userId: member6.getId() })

    // [new message] {"authorId": "1", "content": "呀，大家下線了", "tags": []}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: '呀，大家下線了',
      tags: [],
    })

    // [new message] {"authorId": "3", "content": "是啊～！", "tags": []}
    newMessage({
      waterballCommunity,
      authorId: member3.getId(),
      content: '是啊～！',
      tags: [],
    })

    // [end]
    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
