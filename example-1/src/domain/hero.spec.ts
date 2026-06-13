import { describe, expect, it } from 'vitest'
import { Hero } from './hero'
import { LevelSheet } from './level.sheet'

describe('Hero（英雄領域模型）', () => {
  describe('constructor（建構時驗證）', () => {
    it('當 totalExp 小於 0 時應拋出錯誤', () => {
      expect(() => {
        new Hero({
          totalExp: -1,
          hp: 0,
          level: 1,
        })
      }).toThrow('totalExp 必須 >= 0')
    })

    it('當 hp 小於 0 時應拋出錯誤', () => {
      expect(() => {
        new Hero({
          totalExp: 0,
          hp: -1,
          level: 1,
        })
      }).toThrow('hp 必須 >= 0')
    })

    it('當 level 小於等於 0 時應拋出錯誤', () => {
      expect(() => {
        new Hero({
          totalExp: 0,
          hp: 0,
          level: 0,
        })
      }).toThrow('level 必須 > 0')
    })

    it('應正確建立 Hero', () => {
      const hero = new Hero({
        totalExp: 0,
        hp: 100,
        level: 1,
      })

      expect(hero.getTotalExp()).toBe(0)
      expect(hero.getHp()).toBe(100)
      expect(hero.getLevel()).toBe(1)
    })
  })

  describe('gainExp（獲得經驗值）', () => {
    it('當 exp 小於 0 時應拋出錯誤', () => {
      const hero = new Hero({
        totalExp: 0,
        hp: 0,
        level: 1,
      })

      const levelSheet = new LevelSheet()

      expect(() => {
        hero.gainExp(-1, levelSheet)
      }).toThrow('exp 必須 >= 0')
    })

    it('應增加 totalExp', () => {
      const hero = new Hero({
        totalExp: 0,
        hp: 0,
        level: 1,
      })

      const levelSheet = new LevelSheet()

      hero.gainExp(10, levelSheet)

      expect(hero.getTotalExp()).toBe(10)
    })

    it('應根據 LevelSheet 正確更新 level', () => {
      const hero = new Hero({
        totalExp: 0,
        hp: 0,
        level: 1,
      })

      const levelSheet = new LevelSheet()

      hero.gainExp(0, levelSheet)
      expect(hero.getLevel()).toBe(1)

      hero.gainExp(1000, levelSheet)
      expect(hero.getLevel()).toBe(2)
    })

    it('應隨 totalExp 累積正確升級', () => {
      const hero = new Hero({
        totalExp: 0,
        hp: 0,
        level: 1,
      })

      const levelSheet = new LevelSheet()

      hero.gainExp(2500, levelSheet)

      expect(hero.getTotalExp()).toBe(2500)
      expect(hero.getLevel()).toBe(3)
    })
  })
})
