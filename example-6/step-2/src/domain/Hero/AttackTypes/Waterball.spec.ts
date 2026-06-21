import { afterEach, describe, expect, it, vi } from 'vitest'

import { Hero } from '../Hero'
import { Fireball } from './Fireball'
import { Waterball } from './Waterball'

describe('Waterball', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('attack', () => {
    it('應該造成自身血量 x 0.5 的傷害', () => {
      vi.spyOn(console, 'log').mockImplementation(() => {})

      const waterball = new Waterball()
      const attacker = new Hero({
        name: 'Attacker',
        attackTypeStrategy: waterball,
        hp: 200,
      })
      const defender = new Hero({
        name: 'Defender',
        attackTypeStrategy: new Fireball(),
        hp: 500,
      })

      waterball.attack(attacker, defender)

      expect(defender.getHp()).toBe(400)
    })
  })
})
