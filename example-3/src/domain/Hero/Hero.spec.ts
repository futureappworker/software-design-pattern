import { nanoid } from 'nanoid'
import { describe, expect, it } from 'vitest'
import { LevelSheet } from '../LevelSheet/LevelSheet'
import { Hero } from './Hero'

describe('Hero', () => {
  describe('constructor', () => {
    it('當 totalExp 小於 0, 應該拋出錯誤', () => {
      expect(() => {
        new Hero({
          id: nanoid(),
          totalExp: -1,
        })
      }).toThrow()
    })

    it('當 level 小於等於 0, 應該拋出錯誤', () => {
      expect(() => {
        new Hero({
          id: nanoid(),
          level: -1,
        })
      }).toThrow()
    })

    it('當 hp 小於 0, 應該拋出錯誤', () => {
      expect(() => {
        new Hero({
          id: nanoid(),
          hp: -1,
        })
      }).toThrow()
    })
  })

  describe('gainExp', () => {
    it('當 exp 小於 0, 應該拋出錯誤', () => {
      const hero = new Hero({
        id: nanoid(),
      })
      const levelSheet = new LevelSheet()
      expect(() => {
        hero.gainExp(-1, levelSheet)
      }).toThrow()
    })
  })
})
