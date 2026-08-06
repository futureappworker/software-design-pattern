// 範例輸入: Command_Record_QuotaLimit.in
// 範例輸出: Command_Record_QuotaLimit.out

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
} from './utils'

const testcaseDir = dirname(fileURLToPath(import.meta.url))
const baseName = 'Command_Record_QuotaLimit'

function readExpectedOutput(): string {
  return readFileSync(join(testcaseDir, `${baseName}.out`), 'utf-8').trimEnd()
}

describe('Command_Record_QuotaLimit', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('matches expected output', () => {
    const expectedOutput = readExpectedOutput()
    const outputLines: string[] = []

    vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
      outputLines.push(args.map(String).join(' '))
    })

    // [started] {"time": "2023-08-07 00:00:00", "quota": 2}
    const waterballCommunity = started({
      time: '2023-08-07 00:00:00',
      quota: 2,
    })

    // [login] {"userId": "2", "isAdmin": false}
    const member2 = login({ waterballCommunity, userId: '2', isAdmin: false })

    // [new message] {"authorId": "2", "content": "record", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member2.getId(),
      content: 'record',
      tags: ['bot'],
    })

    // [go broadcasting] {"speakerId": "2"}
    goBroadcasting({ waterballCommunity, speakerId: member2.getId() })

    // [speak] {"speakerId": "2", "content": "測試是否進入錄音"}
    speak({
      waterballCommunity,
      speakerId: member2.getId(),
      content: '測試是否進入錄音',
    })

    // [stop broadcasting] {"speakerId": "2"}
    stopBroadcasting({ waterballCommunity, speakerId: member2.getId() })

    // [end]
    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
