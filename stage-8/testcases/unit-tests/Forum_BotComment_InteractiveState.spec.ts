// 範例輸入: Forum_BotComment_InteractiveState.in
// 範例輸出: Forum_BotComment_InteractiveState.out

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { login, newPost, started } from '../test-utils'

const testcaseDir = dirname(fileURLToPath(import.meta.url))
const baseName = 'Forum_BotComment_InteractiveState'

function readExpectedOutput(): string {
  return readFileSync(join(testcaseDir, `${baseName}.out`), 'utf-8').trimEnd()
}

describe('Forum_BotComment_InteractiveState', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('matches expected output', () => {
    const expectedOutput = readExpectedOutput()
    const outputLines: string[] = []

    vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
      outputLines.push(args.map(String).join(' '))
    })

    // [started] {"time": "2023-08-07 00:00:00", "quota": 1}
    const waterballCommunity = started({
      time: '2023-08-07 00:00:00',
      quota: 1,
    })

    // [login] {"userId": "1".."10", "isAdmin": false}
    const members = Array.from({ length: 10 }, (_, i) =>
      login({
        waterballCommunity,
        userId: String(i + 1),
        isAdmin: false,
      }),
    )

    // [new post] {"id": "201", "authorId": "10", "title": "Interactive Post", "content": "Testing interactive forum", "tags": []}
    newPost({
      waterballCommunity,
      id: '201',
      authorId: members[9].getId(),
      title: 'Interactive Post',
      content: 'Testing interactive forum',
      tags: [],
    })

    // [end]
    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
