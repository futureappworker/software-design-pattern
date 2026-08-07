// 範例輸入: Command_King_InvalidMember.in
// 範例輸出: Command_King_InvalidMember.out

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { login, newMessage, started } from '../test-utils'

const testcaseDir = dirname(fileURLToPath(import.meta.url))
const baseName = 'Command_King_InvalidMember'

function readExpectedOutput(): string {
  return readFileSync(join(testcaseDir, `${baseName}.out`), 'utf-8').trimEnd()
}

describe('Command_King_InvalidMember', () => {
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
    const member1 = login({
      waterballCommunity,
      userId: '1',
      isAdmin: false,
    })

    // [new message] {"authorId": "1", "content": "king", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member1.getId(),
      content: 'king',
      tags: ['bot'],
    })

    // [end]
    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
