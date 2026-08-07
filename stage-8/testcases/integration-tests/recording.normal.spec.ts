// 範例輸入: recording.normal.in
// 範例輸出: recording.normal.out

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  goBroadcasting,
  login,
  newMessage,
  speak,
  started,
  stopBroadcasting,
  TimeUnit,
  timeElapsed,
} from '../test-utils'

const testcaseDir = dirname(fileURLToPath(import.meta.url))
const baseName = 'recording.normal'

function readExpectedOutput(): string {
  return readFileSync(join(testcaseDir, `${baseName}.out`), 'utf-8').trimEnd()
}

describe('recording.normal', () => {
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

    // [new message] {"authorId": "3", "content": "等等有演講，我來幫忙錄音一下", "tags": []}
    newMessage({
      waterballCommunity,
      authorId: member3.getId(),
      content: '等等有演講，我來幫忙錄音一下',
      tags: [],
    })

    // [3 seconds elapsed]
    timeElapsed({ n: 3, unit: TimeUnit.seconds })

    // [new message] {"authorId": "3", "content": "record", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member3.getId(),
      content: 'record',
      tags: ['bot'],
    })

    // [new message] {"authorId": "2", "content": "現在應該就正在錄音了？", "tags": ["1", "bot"]}
    newMessage({
      waterballCommunity,
      authorId: member2.getId(),
      content: '現在應該就正在錄音了？',
      tags: ['1', 'bot'],
    })

    // [new message] {"authorId": "1", "content": "對，等演講開始！", "tags": ["2"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: '對，等演講開始！',
      tags: ['2'],
    })

    // [40 minutes elapsed]
    timeElapsed({ n: 40, unit: TimeUnit.minutes })

    // [go broadcasting] {"speakerId": "4"}
    goBroadcasting({ waterballCommunity, speakerId: member4.getId() })

    // [new message] {"authorId": "4", "content": "我要開始演講囉！", "tags": ["1", "2", "3", "5", "bot"]}
    newMessage({
      waterballCommunity,
      authorId: member4.getId(),
      content: '我要開始演講囉！',
      tags: ['1', '2', '3', '5', 'bot'],
    })

    // [new message] {"authorId": "2", "content": "期待很久", "tags": ["4"]}
    newMessage({
      waterballCommunity,
      authorId: member2.getId(),
      content: '期待很久',
      tags: ['4'],
    })

    // [speak] {"speakerId": "4", "content": "大家好，我是小華！"}
    speak({
      waterballCommunity,
      speakerId: member4.getId(),
      content: '大家好，我是小華！',
    })

    // [4 seconds elapsed]
    timeElapsed({ n: 4, unit: TimeUnit.seconds })

    // [speak] {"speakerId": "4", "content": "歡迎來到小華脫口秀"}
    speak({
      waterballCommunity,
      speakerId: member4.getId(),
      content: '歡迎來到小華脫口秀',
    })

    // [4 seconds elapsed]
    timeElapsed({ n: 4, unit: TimeUnit.seconds })

    // [speak] {"speakerId": "4", "content": "請問大家⋯⋯軟體工程師最常說的謊言有哪些？"}
    speak({
      waterballCommunity,
      speakerId: member4.getId(),
      content: '請問大家⋯⋯軟體工程師最常說的謊言有哪些？',
    })

    // [3 seconds elapsed]
    timeElapsed({ n: 3, unit: TimeUnit.seconds })

    // [speak] {"speakerId": "4", "content": "是 TODO 註解！！"}
    speak({
      waterballCommunity,
      speakerId: member4.getId(),
      content: '是 TODO 註解！！',
    })

    // [new message] {"authorId": "3", "content": "哈哈哈太白癡了", "tags": ["4"]}
    newMessage({
      waterballCommunity,
      authorId: member3.getId(),
      content: '哈哈哈太白癡了',
      tags: ['4'],
    })

    // [speak] {"speakerId": "4", "content": "身為IT從業人員，你覺得有什麼工具大大提高了工作效率？"}
    speak({
      waterballCommunity,
      speakerId: member4.getId(),
      content: '身為IT從業人員，你覺得有什麼工具大大提高了工作效率？',
    })

    // [4 seconds elapsed]
    timeElapsed({ n: 4, unit: TimeUnit.seconds })

    // [speak] {"speakerId": "4", "content": "單身"}
    speak({
      waterballCommunity,
      speakerId: member4.getId(),
      content: '單身',
    })

    // [4 seconds elapsed]
    timeElapsed({ n: 4, unit: TimeUnit.seconds })

    // [new message] {"authorId": "2", "content": "QQQ", "tags": ["4"]}
    newMessage({
      waterballCommunity,
      authorId: member2.getId(),
      content: 'QQQ',
      tags: ['4'],
    })

    // [speak] {"speakerId": "4", "content": "感謝大家的支持，這就是今晚的小華脫口秀啦！"}
    speak({
      waterballCommunity,
      speakerId: member4.getId(),
      content: '感謝大家的支持，這就是今晚的小華脫口秀啦！',
    })

    // [4 seconds elapsed]
    timeElapsed({ n: 4, unit: TimeUnit.seconds })

    // [stop broadcasting] {"speakerId": "4"}
    stopBroadcasting({ waterballCommunity, speakerId: member4.getId() })

    // [new message] {"authorId": "1", "content": "讚讚讚，好笑好笑！", "tags": ["4"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: '讚讚讚，好笑好笑！',
      tags: ['4'],
    })

    // [new message] {"authorId": "4", "content": "謝謝！", "tags": ["1"]}
    newMessage({
      waterballCommunity,
      authorId: member4.getId(),
      content: '謝謝！',
      tags: ['1'],
    })

    // [go broadcasting] {"speakerId": "3"}
    goBroadcasting({ waterballCommunity, speakerId: member3.getId() })

    // [speak] sessions for member 3
    speak({
      waterballCommunity,
      speakerId: member3.getId(),
      content: '我再來補一個笑話！',
    })
    speak({
      waterballCommunity,
      speakerId: member3.getId(),
      content: '這個世界上有 10 種人啊',
    })
    speak({
      waterballCommunity,
      speakerId: member3.getId(),
      content: '懂二進制的人⋯⋯',
    })
    speak({
      waterballCommunity,
      speakerId: member3.getId(),
      content: '和不懂二進制的人！！',
    })

    // [new message] {"authorId": "4", "content": "唉唷讚喔，哈哈哈", "tags": ["3"]}
    newMessage({
      waterballCommunity,
      authorId: member4.getId(),
      content: '唉唷讚喔，哈哈哈',
      tags: ['3'],
    })

    // [stop broadcasting] {"speakerId": "3"}
    stopBroadcasting({ waterballCommunity, speakerId: member3.getId() })

    // [new message] {"authorId": "2", "content": "stop-recording", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member2.getId(),
      content: 'stop-recording',
      tags: ['bot'],
    })

    // [new message] {"authorId": "3", "content": "只有原本下達 record 指令的人可以停止錄音", "tags": ["2"]}
    newMessage({
      waterballCommunity,
      authorId: member3.getId(),
      content: '只有原本下達 record 指令的人可以停止錄音',
      tags: ['2'],
    })

    // [new message] {"authorId": "3", "content": "stop-recording", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member3.getId(),
      content: 'stop-recording',
      tags: ['bot'],
    })

    // [new message] {"authorId": "3", "content": "謝謝！", "tags": ["4"]}
    newMessage({
      waterballCommunity,
      authorId: member3.getId(),
      content: '謝謝！',
      tags: ['4'],
    })

    // [end]
    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
