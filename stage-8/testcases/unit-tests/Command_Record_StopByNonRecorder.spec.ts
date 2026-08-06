// 範例輸入: Command_Record_StopByNonRecorder.in
// 範例輸出: Command_Record_StopByNonRecorder.out

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
const baseName = 'Command_Record_StopByNonRecorder'

function readExpectedOutput(): string {
  return readFileSync(join(testcaseDir, `${baseName}.out`), 'utf-8').trimEnd()
}

describe('Command_Record_StopByNonRecorder', () => {
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

    // [go broadcasting] {"speakerId": "3"}
    goBroadcasting({ waterballCommunity, speakerId: member3.getId() })

    // [speak] {"speakerId": "3", "content": "Record test."}
    speak({
      waterballCommunity,
      speakerId: member3.getId(),
      content: 'Record test.',
    })

    // [new message] {"authorId": "4", "content": "stop-recording", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member4.getId(),
      content: 'stop-recording',
      tags: ['bot'],
    })

    // [end]
    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
