// 範例輸入: Broadcast_Record_ActiveSpeaker.in
// 範例輸出: Broadcast_Record_ActiveSpeaker.out

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
const baseName = 'Broadcast_Record_ActiveSpeaker'

function readExpectedOutput(): string {
  return readFileSync(join(testcaseDir, `${baseName}.out`), 'utf-8').trimEnd()
}

describe('Broadcast_Record_ActiveSpeaker', () => {
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

    // [go broadcasting] {"speakerId": "4"}
    goBroadcasting({ waterballCommunity, speakerId: member4.getId() })

    // [new message] {"authorId": "3", "content": "record", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member3.getId(),
      content: 'record',
      tags: ['bot'],
    })

    // [speak] {"speakerId": "4", "content": "Hello, this is broadcast test."}
    speak({
      waterballCommunity,
      speakerId: member4.getId(),
      content: 'Hello, this is broadcast test.',
    })

    // [stop broadcasting] {"speakerId": "4"}
    stopBroadcasting({ waterballCommunity, speakerId: member4.getId() })

    // [end]
    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
