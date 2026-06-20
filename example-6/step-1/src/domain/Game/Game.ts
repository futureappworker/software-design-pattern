import type { Hero } from '../Hero/Hero'

type GameProps = {
  hero1: Hero
  hero2: Hero
}

export class Game {
  private hero1: Hero
  private hero2: Hero

  constructor({ hero1, hero2 }: GameProps) {
    this.hero1 = hero1
    this.hero2 = hero2
  }

  start() {
    let attacker = this.hero1
    let defender = this.hero2
    // 兩個英雄, 互相 攻擊, 直到其中一個英雄死亡
    while (!attacker.isDead() && !defender.isDead()) {
      attacker.attackHero(defender)
      if (defender.isDead()) {
        break
      }
      ;[attacker, defender] = [defender, attacker]
    }
    const winner = this.hero1.isDead() ? this.hero2 : this.hero1
    console.log(`${winner.getName()} 獲勝`)
  }
}
