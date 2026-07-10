// 範例輸入: self-healing.in
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

// 範例輸出: self-healing.out

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { createInterface } from 'node:readline/promises'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SelfHealingSkill } from '../domain/AttackAction/Skill/SelfHealingSkill/SelfHealingSkill'
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

function createSelfHealingBattle(): RPG {
  const allies = new Troop({ name: '1', units: [] })
  const enemies = new Troop({ name: '2', units: [] })

  const hero = new Hero({
    hp: 500,
    mp: 500,
    str: 40,
    name: '英雄',
    skills: [],
    troop: allies,
  })

  const slime1 = new AI({
    hp: 100,
    mp: 100,
    str: 30,
    name: 'Slime1',
    skills: [new SelfHealingSkill()],
    troop: enemies,
    actionSelectionStrategy: new SeedAIActionSelectionStrategy(),
    targetSelectionStrategy: new SeedAITargetSelectionStrategy(),
  })

  allies.addUnit(hero)
  enemies.addUnit(slime1)

  return new RPG({
    allies,
    enemies,
  })
}

describe('self-healing testcase', () => {
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
    const actions = readHeroActions('self-healing')
    const expectedOutput = readExpectedOutput('self-healing')

    for (const action of actions) {
      mockQuestion.mockResolvedValueOnce(action)
    }

    const outputLines: string[] = []
    vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
      outputLines.push(args.map(String).join(' '))
    })

    const rpg = createSelfHealingBattle()
    await rpg.battle()

    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
