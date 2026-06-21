import type { Hero } from '../Hero'

type WaterballProps = {
  name?: string
}

const defaultProps = {
  name: 'Waterball',
}

export class Waterball {
  private name: string

  constructor({ name = defaultProps.name }: WaterballProps = {}) {
    this.name = name
  }

  getName() {
    return this.name
  }

  attack(attacker: Hero, defender: Hero) {
    // 造成一次傷害, 傷害為自身的血量 x 0.5
    const damage = attacker.getHp() * 0.5
    defender.takeDamage(damage)
    console.log(
      `${attacker.getName()} 使用 ${this.getName()} 攻擊 ${defender.getName()}，造成 ${damage} 點傷害`,
    )
  }
}
