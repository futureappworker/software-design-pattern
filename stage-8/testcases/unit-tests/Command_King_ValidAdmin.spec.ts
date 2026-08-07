// 範例輸入: Command_King_ValidAdmin.in
// 範例輸出: Command_King_ValidAdmin.out

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { login, newMessage, started } from '../test-utils'

const testcaseDir = dirname(fileURLToPath(import.meta.url))
const baseName = 'Command_King_ValidAdmin'

function readExpectedOutput(): string {
  return readFileSync(join(testcaseDir, `${baseName}.out`), 'utf-8').trimEnd()
}

describe('Command_King_ValidAdmin', () => {
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

    // [login] {"userId": "admin", "isAdmin": true}
    const admin = login({
      waterballCommunity,
      userId: 'admin',
      isAdmin: true,
    })

    // [new message] {"authorId": "admin", "content": "king", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: admin.getId(),
      content: 'king',
      tags: ['bot'],
    })

    // [end]
    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
