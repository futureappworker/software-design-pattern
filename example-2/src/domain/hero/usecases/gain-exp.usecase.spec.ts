import { nanoid } from 'nanoid'
import { describe, expect, it } from 'vitest'
import { LevelSheet } from '../../level-sheet/level-sheet'
import { Hero } from '../hero'
import { GainExpUseCase } from './gain-exp.usecase'

describe('gain-exp.usecase', () => {
  it('當獲得 1000 經驗時, 應該 hero 的 level 是 2', () => {
    const hero = new Hero({
      id: nanoid(),
      pet: null,
    })
    const levelSheet = new LevelSheet()
    const useCase = new GainExpUseCase(levelSheet)

    useCase.execute({
      hero,
      exp: 1000,
    })

    expect(hero.getLevel()).toBe(2)
  })
})
