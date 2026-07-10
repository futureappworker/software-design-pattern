// 範例輸入: waterball-and-fireball-1v2.in
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

// 範例輸出: waterball-and-fireball-1v2.out

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { createInterface } from 'node:readline/promises'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FireballSkill } from '../domain/AttackAction/Skill/FireballSkill/FireballSkill'
import { WaterballSkill } from '../domain/AttackAction/Skill/WaterballSkill/WaterballSkill'
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

function createWaterballAndFireballBattle(): RPG {
  const allies = new Troop({ name: '1', units: [] })
  const enemies = new Troop({ name: '2', units: [] })

  const hero = new Hero({
    hp: 300,
    mp: 500,
    str: 100,
    name: '英雄',
    skills: [new FireballSkill(), new WaterballSkill()],
    troop: allies,
  })

  const slime1 = new AI({
    hp: 200,
    mp: 60,
    str: 49,
    name: 'Slime1',
    skills: [new FireballSkill()],
    troop: enemies,
    actionSelectionStrategy: new SeedAIActionSelectionStrategy(),
    targetSelectionStrategy: new SeedAITargetSelectionStrategy(),
  })

  const slime2 = new AI({
    hp: 200,
    mp: 200,
    str: 50,
    name: 'Slime2',
    skills: [new FireballSkill(), new WaterballSkill()],
    troop: enemies,
    actionSelectionStrategy: new SeedAIActionSelectionStrategy(),
    targetSelectionStrategy: new SeedAITargetSelectionStrategy(),
  })

  allies.addUnit(hero)
  enemies.addUnit(slime1)
  enemies.addUnit(slime2)

  return new RPG({
    allies,
    enemies,
  })
}

describe('waterball-and-fireball-1v2 testcase', () => {
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
    const actions = readHeroActions('waterball-and-fireball-1v2')
    const expectedOutput = readExpectedOutput('waterball-and-fireball-1v2')

    for (const action of actions) {
      mockQuestion.mockResolvedValueOnce(action)
    }

    const outputLines: string[] = []
    vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
      outputLines.push(args.map(String).join(' '))
    })

    const rpg = createWaterballAndFireballBattle()
    await rpg.battle()

    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
