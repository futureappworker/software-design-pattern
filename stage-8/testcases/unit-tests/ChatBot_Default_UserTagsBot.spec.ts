// 範例輸入: ChatBot_Default_UserTagsBot.in
// 範例輸出: ChatBot_Default_UserTagsBot.out

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { login, newMessage, started } from '../test-utils'

const testcaseDir = dirname(fileURLToPath(import.meta.url))
const baseName = 'ChatBot_Default_UserTagsBot'

function readExpectedOutput(): string {
  return readFileSync(join(testcaseDir, `${baseName}.out`), 'utf-8').trimEnd()
}

describe('ChatBot_Default_UserTagsBot', () => {
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

    // [new message] {"authorId": "3", "content": "Halo Bot!", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member3.getId(),
      content: 'Halo Bot!',
      tags: [waterballCommunity.getBot().getId()],
    })

    // [end]
    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
