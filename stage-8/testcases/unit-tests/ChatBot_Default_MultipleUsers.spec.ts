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
const baseName = 'ChatBot_Default_MultipleUsers'

function readExpectedOutput(): string {
  return readFileSync(join(testcaseDir, `${baseName}.out`), 'utf-8').trimEnd()
}

describe('ChatBot_Default_MultipleUsers', () => {
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

    // [login] {"userId": "1", "isAdmin": false}
    const member1 = new Member({
      id: '1',
      role: MemberRole.MEMBER,
    })
    waterballCommunity.addMember(member1)
    waterballCommunity.login(member1.getId())

    // [login] {"userId": "2", "isAdmin": false}
    const member2 = new Member({
      id: '2',
      role: MemberRole.MEMBER,
    })
    waterballCommunity.addMember(member2)
    waterballCommunity.login(member2.getId())

    // [new message] {"authorId": "1", "content": "Hello from user1", "tags": []}
    waterballCommunity.sendMessage({
      authorId: member1.getId(),
      content: 'Hello from user1',
      tags: [],
    })

    // [new message] {"authorId": "2", "content": "Hello from user2", "tags": []}
    waterballCommunity.sendMessage({
      authorId: member2.getId(),
      content: 'Hello from user2',
      tags: [],
    })

    // [end]
    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
