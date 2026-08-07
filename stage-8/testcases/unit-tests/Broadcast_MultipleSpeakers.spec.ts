// 範例輸入: Broadcast_MultipleSpeakers.in
// 範例輸出: Broadcast_MultipleSpeakers.out

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  goBroadcasting,
  login,
  speak,
  started,
  stopBroadcasting,
} from '../test-utils'

const testcaseDir = dirname(fileURLToPath(import.meta.url))
const baseName = 'Broadcast_MultipleSpeakers'

function readExpectedOutput(): string {
  return readFileSync(join(testcaseDir, `${baseName}.out`), 'utf-8').trimEnd()
}

describe('Broadcast_MultipleSpeakers', () => {
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

    // [login] {"userId": "1", "isAdmin": false}
    const member1 = login({ waterballCommunity, userId: '1', isAdmin: false })

    // [login] {"userId": "2", "isAdmin": false}
    const member2 = login({ waterballCommunity, userId: '2', isAdmin: false })

    // [go broadcasting] {"speakerId": "1"}
    goBroadcasting({ waterballCommunity, speakerId: member1.getId() })

    // [speak] {"speakerId": "1", "content": "Test 1"}
    speak({
      waterballCommunity,
      speakerId: member1.getId(),
      content: 'Test 1',
    })

    // [stop broadcasting] {"speakerId": "1"}
    stopBroadcasting({ waterballCommunity, speakerId: member1.getId() })

    // [go broadcasting] {"speakerId": "2"}
    goBroadcasting({ waterballCommunity, speakerId: member2.getId() })

    // [speak] {"speakerId": "2", "content": "Test 2"}
    speak({
      waterballCommunity,
      speakerId: member2.getId(),
      content: 'Test 2',
    })

    // [stop broadcasting] {"speakerId": "2"}
    stopBroadcasting({ waterballCommunity, speakerId: member2.getId() })

    // [end]
    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
