// 範例輸入: Command_Record_StopByRecorder.in
// 範例輸出: Command_Record_StopByRecorder.out

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
} from './utils'

const testcaseDir = dirname(fileURLToPath(import.meta.url))
const baseName = 'Command_Record_StopByRecorder'

function readExpectedOutput(): string {
  return readFileSync(join(testcaseDir, `${baseName}.out`), 'utf-8').trimEnd()
}

describe('Command_Record_StopByRecorder', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('matches expected output', () => {
    const expectedOutput = readExpectedOutput()
    const outputLines: string[] = []

    vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
      outputLines.push(args.map(String).join(' '))
    })

    // [started] {"time": "2023-08-07 00:00:00", "quota": 10}
    const waterballCommunity = started({
      time: '2023-08-07 00:00:00',
      quota: 10,
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

    // [speak] {"speakerId": "4", "content": "Test"}
    speak({
      waterballCommunity,
      speakerId: member4.getId(),
      content: 'Test',
    })

    // [new message] {"authorId": "3", "content": "stop-recording", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member3.getId(),
      content: 'stop-recording',
      tags: ['bot'],
    })

    // [end]
    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
