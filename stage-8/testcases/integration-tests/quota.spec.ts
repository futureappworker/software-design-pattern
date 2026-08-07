// 範例輸入: quota.in
// 範例輸出: quota.out

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  goBroadcasting,
  login,
  newMessage,
  speak,
  started,
  stopBroadcasting,
} from '../test-utils'

const testcaseDir = dirname(fileURLToPath(import.meta.url))
const baseName = 'quota'

function readExpectedOutput(): string {
  return readFileSync(join(testcaseDir, `${baseName}.out`), 'utf-8').trimEnd()
}

describe('quota', () => {
  afterEach(() => {
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

    // [new message] {"authorId": "1", "content": "king-stop", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: 'king-stop',
      tags: ['bot'],
    })

    // [new message] {"authorId": "1", "content": "測試正常對話，現在 quota 應該剩下 15。", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: '測試正常對話，現在 quota 應該剩下 15。',
      tags: ['bot'],
    })

    // [new message] {"authorId": "1", "content": "king", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: 'king',
      tags: ['bot'],
    })

    // [new message] {"authorId": "1", "content": "king-stop", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: 'king-stop',
      tags: ['bot'],
    })

    // [new message] {"authorId": "1", "content": "測試正常對話，現在 quota 應該剩下 10。", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: '測試正常對話，現在 quota 應該剩下 10。',
      tags: ['bot'],
    })

    // [new message] {"authorId": "1", "content": "king", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: 'king',
      tags: ['bot'],
    })

    // [new message] {"authorId": "1", "content": "king-stop", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: 'king-stop',
      tags: ['bot'],
    })

    // [new message] {"authorId": "1", "content": "測試正常對話，現在 quota 應該剩下 5。", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: '測試正常對話，現在 quota 應該剩下 5。',
      tags: ['bot'],
    })

    // [new message] {"authorId": "1", "content": "record", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: 'record',
      tags: ['bot'],
    })

    // [go broadcasting] {"speakerId": "1"}
    goBroadcasting({ waterballCommunity, speakerId: member1.getId() })

    // [speak] {"speakerId": "1", "content": "測試演講。"}
    speak({
      waterballCommunity,
      speakerId: member1.getId(),
      content: '測試演講。',
    })

    // [new message] {"authorId": "1", "content": "stop-recording", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: 'stop-recording',
      tags: ['bot'],
    })

    // [new message] {"authorId": "1", "content": "測試正常對話，現在 quota 應該剩下 2。", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: '測試正常對話，現在 quota 應該剩下 2。',
      tags: ['bot'],
    })

    // [new message] {"authorId": "1", "content": "record", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: 'record',
      tags: ['bot'],
    })

    // [stop broadcasting] {"speakerId": "1"}
    stopBroadcasting({ waterballCommunity, speakerId: member1.getId() })

    // [go broadcasting] {"speakerId": "1"}
    goBroadcasting({ waterballCommunity, speakerId: member1.getId() })

    // [speak] {"speakerId": "1", "content": "測試演講，現在 quota 應該剩下 2，不能錄音。"}
    speak({
      waterballCommunity,
      speakerId: member1.getId(),
      content: '測試演講，現在 quota 應該剩下 2，不能錄音。',
    })

    // [new message] {"authorId": "1", "content": "king", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: 'king',
      tags: ['bot'],
    })

    // [new message] {"authorId": "1", "content": "測試正常對話，現在 quota 應該剩下 2，不能玩 Knowledge King。", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: '測試正常對話，現在 quota 應該剩下 2，不能玩 Knowledge King。',
      tags: ['bot'],
    })

    // [end]
    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
