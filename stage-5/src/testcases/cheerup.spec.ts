// 範例輸入: cheerup.in
// 輸入格式:
// #軍隊-1-開始
// <軍隊-1>
// #軍隊-1-結束
// #軍隊-2-開始
// <軍隊-2>
// #軍隊-2-結束
// <英雄決策-1>
// <英雄決策-2>
// <英雄決策-3>
// ...

// 範例輸出: cheerup.out

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { createInterface } from 'node:readline/promises'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheerupSkill } from '../domain/AttackAction/Skill/CheerupSkill/CheerupSkill'
import { RPG } from '../domain/RPG/RPG'
import { Troop } from '../domain/Troop/Troop'
import { AI } from '../domain/Unit/AI/AI'
import { SeedAIActionSelectionStrategy } from '../domain/Unit/AI/AIActionSelectionStrategy/SeedAIActionSelectionStrategy/SeedAIActionSelectionStrategy'
import { SeedAITargetSelectionStrategy } from '../domain/Unit/AI/AITargetSelectionStrategy/SeedAITargetSelectionStrategy/SeedAITargetSelectionStrategy'
import { Hero } from '../domain/Unit/Hero/Hero'
import { resetReadline } from '../utils/readline'

vi.mock('node:readline/promises', () => ({
  createInterface: vi.fn(),
}))

const testcaseDir = dirname(fileURLToPath(import.meta.url))

function readHeroActions(baseName: string): string[] {
  const content = readFileSync(join(testcaseDir, `${baseName}.in`), 'utf-8')
  const lines = content
    .trimEnd()
    .split('\n')
    .map((line) => line.trim())

  const army2EndIndex = lines.indexOf('#軍隊-2-結束')
  return lines.slice(army2EndIndex + 1)
}

function readExpectedOutput(baseName: string): string {
  return readFileSync(join(testcaseDir, `${baseName}.out`), 'utf-8').trimEnd()
}

function createCheerupBattle(): RPG {
  const allies = new Troop({ name: '1', units: [] })
  const enemies = new Troop({ name: '2', units: [] })

  const hero = new Hero({
    hp: 500,
    mp: 10000,
    str: 30,
    name: '英雄',
    skills: [new CheerupSkill()],
    troop: allies,
  })

  const createServant = (name: string) =>
    new AI({
      hp: 1000,
      mp: 0,
      str: 0,
      name,
      skills: [],
      troop: allies,
      actionSelectionStrategy: new SeedAIActionSelectionStrategy(),
      targetSelectionStrategy: new SeedAITargetSelectionStrategy(),
    })

  const servant1 = createServant('Servant1')
  const servant2 = createServant('Servant2')
  const servant3 = createServant('Servant3')
  const servant4 = createServant('Servant4')
  const servant5 = createServant('Servant5')

  const slime1 = new AI({
    hp: 500,
    mp: 0,
    str: 0,
    name: 'Slime1',
    skills: [],
    troop: enemies,
    actionSelectionStrategy: new SeedAIActionSelectionStrategy(),
    targetSelectionStrategy: new SeedAITargetSelectionStrategy(),
  })

  allies.addUnit(hero)
  allies.addUnit(servant1)
  allies.addUnit(servant2)
  allies.addUnit(servant3)
  allies.addUnit(servant4)
  allies.addUnit(servant5)
  enemies.addUnit(slime1)

  return new RPG({
    allies,
    enemies,
  })
}

describe('cheerup testcase', () => {
  const mockQuestion = vi.fn()

  beforeEach(() => {
    resetReadline()
    vi.mocked(createInterface).mockReturnValue({
      question: mockQuestion,
      close: vi.fn(),
    } as never)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    mockQuestion.mockReset()
    resetReadline()
  })

  it('should match the expected battle output', async () => {
    const actions = readHeroActions('cheerup')
    const expectedOutput = readExpectedOutput('cheerup')

    for (const action of actions) {
      mockQuestion.mockResolvedValueOnce(action)
    }

    const outputLines: string[] = []
    vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
      outputLines.push(args.map(String).join(' '))
    })

    const rpg = createCheerupBattle()
    await rpg.battle()

    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
