import { afterEach, describe, expect, it, vi } from 'vitest'

import { Earth } from './AttackTypes/Earth'
import { Fireball } from './AttackTypes/Fireball'
import { Waterball } from './AttackTypes/Waterball'
import { Hero } from './Hero'

describe('Hero', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('constructor', () => {
    it('應該正確初始化 name 與預設 hp', () => {
      const hero = new Hero({
        name: 'Warrior',
        attackTypeStrategy: new Waterball(),
      })

      expect(hero.getName()).toBe('Warrior')
      expect(hero.getHp()).toBe(500)
    })

    it('應該可以使用自訂 hp', () => {
      const hero = new Hero({
        name: 'Mage',
        attackTypeStrategy: new Fireball(),
        hp: 300,
      })

      expect(hero.getHp()).toBe(300)
    })

    it('當 hp 小於 0, 應該拋出錯誤', () => {
      expect(() => {
        new Hero({
          name: 'Invalid',
          attackTypeStrategy: new Earth(),
          hp: -1,
        })
      }).toThrow()
    })
  })

  describe('isDead', () => {
    it('當 hp 大於 0, 應該回傳 false', () => {
      const hero = new Hero({
        name: 'Alive',
        attackTypeStrategy: new Waterball(),
        hp: 100,
      })

      expect(hero.isDead()).toBe(false)
    })

    it('當 hp 等於 0, 應該回傳 true', () => {
      const hero = new Hero({
        name: 'Dead',
        attackTypeStrategy: new Waterball(),
        hp: 0,
      })

      expect(hero.isDead()).toBe(true)
    })
  })

  describe('setHp', () => {
    it('應該可以設置有效的 hp', () => {
      const hero = new Hero({
        name: 'Hero',
        attackTypeStrategy: new Waterball(),
        hp: 500,
      })

      hero.setHp(200)

      expect(hero.getHp()).toBe(200)
    })

    it('應該可以設置 hp 為 0', () => {
      const hero = new Hero({
        name: 'Hero',
        attackTypeStrategy: new Waterball(),
        hp: 500,
      })

      hero.setHp(0)

      expect(hero.getHp()).toBe(0)
    })

    it('當 hp 小於 0, 應該拋出錯誤', () => {
      const hero = new Hero({
        name: 'Hero',
        attackTypeStrategy: new Waterball(),
        hp: 500,
      })

      expect(() => {
        hero.setHp(-1)
      }).toThrow()
    })
  })

  describe('attackHero', () => {
    it('應該委派 attackTypeStrategy 執行攻擊', () => {
      const attack = vi.fn()
      const attacker = new Hero({
        name: 'Attacker',
        attackTypeStrategy: { getName: () => 'Mock', attack },
        hp: 500,
      })
      const target = new Hero({
        name: 'Target',
        attackTypeStrategy: new Waterball(),
        hp: 500,
      })

      attacker.attackHero(target)

      expect(attack).toHaveBeenCalledWith(attacker, target)
    })

    it('Waterball 應該造成自身血量 x 0.5 的傷害', () => {
      vi.spyOn(console, 'log').mockImplementation(() => {})

      const attacker = new Hero({
        name: 'Attacker',
        attackTypeStrategy: new Waterball(),
        hp: 200,
      })
      const target = new Hero({
        name: 'Target',
        attackTypeStrategy: new Earth(),
        hp: 500,
      })

      attacker.attackHero(target)

      expect(target.getHp()).toBe(400)
    })

    it('Fireball 應該連續造成三次 50 點傷害', () => {
      vi.spyOn(console, 'log').mockImplementation(() => {})

      const attacker = new Hero({
        name: 'Attacker',
        attackTypeStrategy: new Fireball(),
        hp: 500,
      })
      const target = new Hero({
        name: 'Target',
        attackTypeStrategy: new Waterball(),
        hp: 500,
      })

      attacker.attackHero(target)

      expect(target.getHp()).toBe(350)
    })

    it('Earth 應該連續造成十次 20 點傷害', () => {
      vi.spyOn(console, 'log').mockImplementation(() => {})

      const attacker = new Hero({
        name: 'Attacker',
        attackTypeStrategy: new Earth(),
        hp: 500,
      })
      const target = new Hero({
        name: 'Target',
        attackTypeStrategy: new Waterball(),
        hp: 500,
      })

      attacker.attackHero(target)

      expect(target.getHp()).toBe(300)
    })
  })

  describe('takeDamage', () => {
    it('應該減少血量', () => {
      const hero = new Hero({
        name: 'Hero',
        attackTypeStrategy: new Waterball(),
        hp: 100,
      })

      hero.takeDamage(30)

      expect(hero.getHp()).toBe(70)
    })

    it('血量不應該低於 0', () => {
      const hero = new Hero({
        name: 'Hero',
        attackTypeStrategy: new Waterball(),
        hp: 50,
      })

      hero.takeDamage(100)

      expect(hero.getHp()).toBe(0)
    })

    it('當傷害使血量歸零時, isDead 應該回傳 true', () => {
      const hero = new Hero({
        name: 'Hero',
        attackTypeStrategy: new Waterball(),
        hp: 50,
      })

      hero.takeDamage(50)

      expect(hero.isDead()).toBe(true)
    })
  })
})
