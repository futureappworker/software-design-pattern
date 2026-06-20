import { afterEach, describe, expect, it, vi } from 'vitest'

import { Hero } from './Hero'

describe('Hero', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('constructor', () => {
    it('應該正確初始化 name、attackType 與預設 hp', () => {
      const hero = new Hero({
        name: 'Warrior',
        attackType: 'Waterball',
      })

      expect(hero.getName()).toBe('Warrior')
      expect(hero.getAttackType()).toBe('Waterball')
      expect(hero.getHp()).toBe(500)
    })

    it('應該可以使用自訂 hp', () => {
      const hero = new Hero({
        name: 'Mage',
        attackType: 'Fireball',
        hp: 300,
      })

      expect(hero.getHp()).toBe(300)
    })

    it('當 hp 小於 0, 應該拋出錯誤', () => {
      expect(() => {
        new Hero({
          name: 'Invalid',
          attackType: 'Earth',
          hp: -1,
        })
      }).toThrow()
    })
  })

  describe('isDead', () => {
    it('當 hp 大於 0, 應該回傳 false', () => {
      const hero = new Hero({
        name: 'Alive',
        attackType: 'Waterball',
        hp: 100,
      })

      expect(hero.isDead()).toBe(false)
    })

    it('當 hp 等於 0, 應該回傳 true', () => {
      const hero = new Hero({
        name: 'Dead',
        attackType: 'Waterball',
        hp: 0,
      })

      expect(hero.isDead()).toBe(true)
    })
  })

  describe('setHp', () => {
    it('應該可以設置有效的 hp', () => {
      const hero = new Hero({
        name: 'Hero',
        attackType: 'Waterball',
        hp: 500,
      })

      hero.setHp(200)

      expect(hero.getHp()).toBe(200)
    })

    it('應該可以設置 hp 為 0', () => {
      const hero = new Hero({
        name: 'Hero',
        attackType: 'Waterball',
        hp: 500,
      })

      hero.setHp(0)

      expect(hero.getHp()).toBe(0)
    })

    it('當 hp 小於 0, 應該拋出錯誤', () => {
      const hero = new Hero({
        name: 'Hero',
        attackType: 'Waterball',
        hp: 500,
      })

      expect(() => {
        hero.setHp(-1)
      }).toThrow()
    })
  })

  describe('attackHero', () => {
    it('Waterball 應該造成自身血量 x 0.5 的傷害', () => {
      vi.spyOn(console, 'log').mockImplementation(() => {})

      const attacker = new Hero({
        name: 'Attacker',
        attackType: 'Waterball',
        hp: 200,
      })
      const target = new Hero({
        name: 'Target',
        attackType: 'Earth',
        hp: 500,
      })

      attacker.attackHero(target)

      expect(target.getHp()).toBe(400)
    })

    it('Fireball 應該連續造成三次 50 點傷害', () => {
      vi.spyOn(console, 'log').mockImplementation(() => {})

      const attacker = new Hero({
        name: 'Attacker',
        attackType: 'Fireball',
        hp: 500,
      })
      const target = new Hero({
        name: 'Target',
        attackType: 'Waterball',
        hp: 500,
      })

      attacker.attackHero(target)

      expect(target.getHp()).toBe(350)
    })

    it('Earth 應該連續造成十次 20 點傷害', () => {
      vi.spyOn(console, 'log').mockImplementation(() => {})

      const attacker = new Hero({
        name: 'Attacker',
        attackType: 'Earth',
        hp: 500,
      })
      const target = new Hero({
        name: 'Target',
        attackType: 'Waterball',
        hp: 500,
      })

      attacker.attackHero(target)

      expect(target.getHp()).toBe(300)
    })

    it('當 attackType 無效, 應該拋出錯誤', () => {
      vi.spyOn(console, 'log').mockImplementation(() => {})

      const attacker = new Hero({
        name: 'Attacker',
        attackType: 'Invalid',
        hp: 500,
      })
      const target = new Hero({
        name: 'Target',
        attackType: 'Waterball',
        hp: 500,
      })

      expect(() => {
        attacker.attackHero(target)
      }).toThrow('Invalid attack type')
    })
  })
})
