// 範例輸入: self-explosion.in
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

// 範例輸出: self-explosion.out

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { createInterface } from 'node:readline/promises'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SelfExplosionSkill } from '../domain/AttackAction/Skill/SelfExplosionSkill/SelfExplosionSkill'
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

function createAlly(name: string, troop: Troop): AI {
  return new AI({
    hp: 100,
    mp: 1000,
    str: 15,
    name,
    skills: [],
    troop,
    actionSelectionStrategy: new SeedAIActionSelectionStrategy(),
    targetSelectionStrategy: new SeedAITargetSelectionStrategy(),
  })
}

function createSelfExplosionBattle(): RPG {
  const allies = new Troop({ name: '1', units: [] })
  const enemies = new Troop({ name: '2', units: [] })

  const hero = new Hero({
    hp: 999999,
    mp: 500,
    str: 30,
    name: '英雄',
    skills: [new SelfExplosionSkill()],
    troop: allies,
  })

  const allyNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
  const enemyNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']

  allies.addUnit(hero)
  for (const name of allyNames) {
    allies.addUnit(createAlly(name, allies))
  }
  for (const name of enemyNames) {
    enemies.addUnit(createAlly(name, enemies))
  }

  return new RPG({
    allies,
    enemies,
  })
}

describe('self-explosion testcase', () => {
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
    const actions = readHeroActions('self-explosion')
    const expectedOutput = readExpectedOutput('self-explosion')

    for (const action of actions) {
      mockQuestion.mockResolvedValueOnce(action)
    }

    const outputLines: string[] = []
    vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
      outputLines.push(args.map(String).join(' '))
    })

    const rpg = createSelfExplosionBattle()
    await rpg.battle()

    expect(outputLines.join('\n')).toBe(expectedOutput)
  })
})
