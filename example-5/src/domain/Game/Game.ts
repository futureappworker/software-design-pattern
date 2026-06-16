import { Decision } from '../Player/Decision'
import type { Player } from '../Player/Player'

type GameProps = {
  p1: Player
  p2: Player
}

export class Game {
  private p1: Player
  private p2: Player

  private counterMap = new Map<Decision, Decision>([
    [Decision.SCISSORS, Decision.PAPER], // 剪刀 -> 布
    [Decision.PAPER, Decision.STONE], // 布 -> 石頭
    [Decision.STONE, Decision.SCISSORS], // 石頭 -> 剪刀
  ])

  constructor({ p1, p2 }: GameProps) {
    if (p1.getNumber() === p2.getNumber()) {
      throw new Error('player 的 number 必須唯一')
    }
    this.p1 = p1
    this.p2 = p2
  }

  async start() {
    const d1 = await this.p1.decide()
    const d2 = await this.p2.decide()

    console.log(`玩家 ${this.p1.getNumber()} 出了 ${d1}`)
    console.log(`玩家 ${this.p2.getNumber()} 出了 ${d2}`)

    if (d1 === d2) {
      console.log('平手!')
      return
    }

    if (this.counterMap.get(d1) === d2) {
      console.log(`玩家 ${this.p1.getNumber()} 獲勝`)
      return
    }

    console.log(`玩家 ${this.p2.getNumber()} 獲勝`)
    return
  }
}
