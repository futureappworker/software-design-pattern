// 範例輸入: Forum_BotComment_DefaultState.in
// 範例輸出: Forum_BotComment_DefaultState.out

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { login, newPost, started } from '../test-utils'

const testcaseDir = dirname(fileURLToPath(import.meta.url))
const baseName = 'Forum_BotComment_DefaultState'

function readExpectedOutput(): string {
  return readFileSync(join(testcaseDir, `${baseName}.out`), 'utf-8').trimEnd()
}

describe('Forum_BotComment_DefaultState', () => {
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

    // [login] {"userId": "2", "isAdmin": false}
    const member2 = login({ waterballCommunity, userId: '2', isAdmin: false })

    // [new post] {"id": "101", "authorId": "2", "title": "Hello Forum", "content": "This is my first post", "tags": []}
    newPost({
      waterballCommunity,
      id: '101',
      authorId: member2.getId(),
      title: 'Hello Forum',
      content: 'This is my first post',
      tags: [],
    })

    // [end]
    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
