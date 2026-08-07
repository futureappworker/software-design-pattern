// 範例輸入: Broadcast_SingleUser.in
// 範例輸出: Broadcast_SingleUser.out

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { goBroadcasting, login, started, stopBroadcasting } from '../test-utils'

const testcaseDir = dirname(fileURLToPath(import.meta.url))
const baseName = 'Broadcast_SingleUser'

function readExpectedOutput(): string {
  return readFileSync(join(testcaseDir, `${baseName}.out`), 'utf-8').trimEnd()
}

describe('Broadcast_SingleUser', () => {
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

    // [go broadcasting] {"speakerId": "1"}
    goBroadcasting({ waterballCommunity, speakerId: member1.getId() })

    // [stop broadcasting] {"speakerId": "1"}
    stopBroadcasting({ waterballCommunity, speakerId: member1.getId() })

    // [end]
    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
