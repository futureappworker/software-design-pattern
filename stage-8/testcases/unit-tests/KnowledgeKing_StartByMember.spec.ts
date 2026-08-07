// 範例輸入: KnowledgeKing_StartByMember.in
// 範例輸出: KnowledgeKing_StartByMember.out

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { login, newMessage, started } from './utils'

const testcaseDir = dirname(fileURLToPath(import.meta.url))
const baseName = 'KnowledgeKing_StartByMember'

function readExpectedOutput(): string {
  return readFileSync(join(testcaseDir, `${baseName}.out`), 'utf-8').trimEnd()
}

describe('KnowledgeKing_StartByMember', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('matches expected output', () => {
    const expectedOutput = readExpectedOutput()
    const outputLines: string[] = []

    vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
      outputLines.push(args.map(String).join(' '))
    })

    // [started] {"time": "2023-08-07 00:00:00", "quota": 200}
    const waterballCommunity = started({
      time: '2023-08-07 00:00:00',
      quota: 200,
    })

    // [login] {"userId": "5", "isAdmin": false}
    const member5 = login({
      waterballCommunity,
      userId: '5',
      isAdmin: false,
    })

    // [new message] {"authorId": "5", "content": "king", "tags": ["bot"]}
    newMessage({
      waterballCommunity,
      authorId: member5.getId(),
      content: 'king',
      tags: ['bot'],
    })

    // [end]
    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
