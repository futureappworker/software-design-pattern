import { afterEach, describe, expect, it, vi } from 'vitest'

import { Hero } from '../Hero'
import { Fireball } from './Fireball'
import { Waterball } from './Waterball'

describe('Fireball', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('attack', () => {
    it('應該連續造成三次 50 點傷害', () => {
      vi.spyOn(console, 'log').mockImplementation(() => {})

      const fireball = new Fireball()
      const attacker = new Hero({
        name: 'Attacker',
        attackTypeStrategy: fireball,
        hp: 500,
      })
      const defender = new Hero({
        name: 'Defender',
        attackTypeStrategy: new Waterball(),
        hp: 500,
      })

      fireball.attack(attacker, defender)

      expect(defender.getHp()).toBe(350)
    })
  })
})
