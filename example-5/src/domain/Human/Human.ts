import { stdin as input, stdout as output } from 'node:process'
import { createInterface } from 'node:readline/promises'

import { Decision } from '../Player/Decision'
import { Player } from '../Player/Player'

type HumanProps = {
  number: number
}

export class Human extends Player {
  constructor({ number }: HumanProps) {
    super({ number })
  }

  async decide(): Promise<Decision> {
    const rl = createInterface({ input, output })

    const answer = await rl.question('請出拳 (1) 剪刀 (2) 石頭 (3) 布: ')

    rl.close()

    switch (Number(answer)) {
      case 1:
        return Decision.SCISSORS
      case 2:
        return Decision.STONE
      case 3:
        return Decision.PAPER
      default:
        console.log('只能輸入範圍 1~3 的數字, 請再輸入一次')
        return this.decide()
    }
  }
}
