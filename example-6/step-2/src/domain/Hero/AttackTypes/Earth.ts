import type { AttackTypeStrategy } from '../AttackTypeStrategy'
import type { Hero } from '../Hero'

type EarthProps = {
  name?: string
}

const defaultProps = {
  name: 'Earth',
}

export class Earth implements AttackTypeStrategy {
  private name: string

  constructor({ name = defaultProps.name }: EarthProps = {}) {
    this.name = name
  }

  getName() {
    return this.name
  }

  attack(attacker: Hero, defender: Hero) {
    // 造成十次傷害, 每次的傷害值為 20
    for (let i = 0; i < 10; i++) {
      const damage = 20
      defender.takeDamage(damage)
      console.log(
        `${attacker.getName()} 使用 ${this.getName()} 攻擊 ${defender.getName()}，造成 ${damage} 點傷害`,
      )
    }
  }
}
