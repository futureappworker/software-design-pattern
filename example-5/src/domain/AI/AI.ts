import { Decision } from '../Player/Decision'
import { Player } from '../Player/Player'

type AIProps = {
  number: number
}

export class AI extends Player {
  constructor({ number }: AIProps) {
    super({ number })
  }

  async decide(): Promise<Decision> {
    const decisions = Object.values(Decision)
    const randomIndex = Math.floor(Math.random() * decisions.length)

    return decisions[randomIndex]
  }
}
