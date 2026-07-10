// 範例輸入: poison.in
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

// 範例輸出: poison.out

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { createInterface } from 'node:readline/promises'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PoisonSkill } from '../domain/AttackAction/Skill/PoisonSkill/PoisonSkill'
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

function createPoisonBattle(): RPG {
  const allies = new Troop({ name: '1', units: [] })
  const enemies = new Troop({ name: '2', units: [] })

  const hero = new Hero({
    hp: 1000,
    mp: 500,
    str: 0,
    name: '英雄',
    skills: [new PoisonSkill()],
    troop: allies,
  })

  const slime1 = new AI({
    hp: 120,
    mp: 90,
    str: 50,
    name: 'Slime1',
    skills: [],
    troop: enemies,
    actionSelectionStrategy: new SeedAIActionSelectionStrategy(),
    targetSelectionStrategy: new SeedAITargetSelectionStrategy(),
  })

  const slime2 = new AI({
    hp: 120,
    mp: 90,
    str: 50,
    name: 'Slime2',
    skills: [],
    troop: enemies,
    actionSelectionStrategy: new SeedAIActionSelectionStrategy(),
    targetSelectionStrategy: new SeedAITargetSelectionStrategy(),
  })

  const slime3 = new AI({
    hp: 120,
    mp: 9000,
    str: 50,
    name: 'Slime3',
    skills: [],
    troop: enemies,
    actionSelectionStrategy: new SeedAIActionSelectionStrategy(),
    targetSelectionStrategy: new SeedAITargetSelectionStrategy(),
  })

  allies.addUnit(hero)
  enemies.addUnit(slime1)
  enemies.addUnit(slime2)
  enemies.addUnit(slime3)

  return new RPG({
    allies,
    enemies,
  })
}

describe('poison testcase', () => {
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
    const actions = readHeroActions('poison')
    const expectedOutput = readExpectedOutput('poison')

    for (const action of actions) {
      mockQuestion.mockResolvedValueOnce(action)
    }

    const outputLines: string[] = []
    vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
      outputLines.push(args.map(String).join(' '))
    })

    const rpg = createPoisonBattle()
    await rpg.battle()

    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
