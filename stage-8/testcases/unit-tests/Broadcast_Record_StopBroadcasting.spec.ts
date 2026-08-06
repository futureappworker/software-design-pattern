// 範例輸入: Broadcast_Record_StopBroadcasting.in
// 範例輸出: Broadcast_Record_StopBroadcasting.out

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
const baseName = 'Broadcast_Record_StopBroadcasting'

function readExpectedOutput(): string {
  return readFileSync(join(testcaseDir, `${baseName}.out`), 'utf-8').trimEnd()
}

describe('Broadcast_Record_StopBroadcasting', () => {
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

    // [login] {"userId": "3", "isAdmin": false}
    const member3 = login({ waterballCommunity, userId: '3', isAdmin: false })

    // [login] {"userId": "4", "isAdmin": false}
    const member4 = login({ waterballCommunity, userId: '4', isAdmin: false })

    // [new message] {"authorId": "3", "content": "record", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member3.getId(),
      content: 'record',
      tags: ['bot'],
    })

    // [go broadcasting] {"speakerId": "4"}
    goBroadcasting({ waterballCommunity, speakerId: member4.getId() })

    // [speak] {"speakerId": "4", "content": "Line1"}
    speak({
      waterballCommunity,
      speakerId: member4.getId(),
      content: 'Line1',
    })

    // [speak] {"speakerId": "4", "content": "Line2"}
    speak({
      waterballCommunity,
      speakerId: member4.getId(),
      content: 'Line2',
    })

    // [stop broadcasting] {"speakerId": "4"}
    stopBroadcasting({ waterballCommunity, speakerId: member4.getId() })

    // [end]
    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
