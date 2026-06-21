import { afterEach, describe, expect, it, vi } from 'vitest'

import { Hero } from '../Hero'
import { Earth } from './Earth'
import { Waterball } from './Waterball'

describe('Earth', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('attack', () => {
    it('應該連續造成十次 20 點傷害', () => {
      vi.spyOn(console, 'log').mockImplementation(() => {})

      const earth = new Earth()
      const attacker = new Hero({
        name: 'Attacker',
        attackTypeStrategy: earth,
        hp: 500,
      })
      const defender = new Hero({
        name: 'Defender',
        attackTypeStrategy: new Waterball(),
        hp: 500,
      })

      earth.attack(attacker, defender)

      expect(defender.getHp()).toBe(300)
    })
  })
})
