// 範例輸入: ChatBot_Default_InitialMessageResponse.in
// 範例輸出: ChatBot_Default_InitialMessageResponse.out

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { BotFacade } from '../../BotFacade/BotFacade'
import {
  Member,
  MemberRole,
  WaterballCommunity,
} from '../../WaterballCommunity/src'

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

    const bot = new BotFacade({
      hasRecordFSM: true,
      hasKnowledgeKingFSM: true,
    })

    // [started] {"time": "2023-08-07 00:00:00", "quota": 20}
    const waterballCommunity = new WaterballCommunity({
      bot,
      quota: 20,
      members: [],
    })

    waterballCommunity.handleEnterNormalEvent()

    // [login] {"userId": "3", "isAdmin": false}
    const member3 = new Member({
      id: '3',
      role: MemberRole.MEMBER,
    })
    waterballCommunity.addMember(member3)
    waterballCommunity.login(member3.getId())

    // [new message] {"authorId": "3", "content": "Halo Bot!", "tags": []}
    waterballCommunity.sendMessage({
      authorId: member3.getId(),
      content: 'Halo Bot!',
      tags: [bot.getId()],
    })

    // [end]
    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
