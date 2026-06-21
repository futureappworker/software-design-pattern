import type { AttackTypeStrategy } from '../AttackTypeStrategy'
import type { Hero } from '../Hero'

type FireballProps = {
  name?: string
}

const defaultProps = {
  name: 'Fireball',
}

export class Fireball implements AttackTypeStrategy {
  private name: string

  constructor({ name = defaultProps.name }: FireballProps = {}) {
    this.name = name
  }

  getName() {
    return this.name
  }

  attack(attacker: Hero, defender: Hero) {
    // 連續造成三次傷害, 每次的傷害值為 50
    for (let i = 0; i < 3; i++) {
      const damage = 50
      defender.takeDamage(damage)
      console.log(
        `${attacker.getName()} 使用 ${this.getName()} 攻擊 ${defender.getName()}，造成 ${damage} 點傷害`,
      )
    }
  }
}
