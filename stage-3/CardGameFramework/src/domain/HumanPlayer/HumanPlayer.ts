import type { Card } from '../Card/Card'
import type { Game } from '../Game/Game'
import { Player } from '../Player/Player'
import type { HumanChooseCardStrategy } from './HumanChooseCardStrategy'

type AIPlayerProps = {
  game: Game
  name: string
  humanChooseCardStrategy: HumanChooseCardStrategy
}

export class HumanPlayer extends Player {
  private game: Game
  private humanChooseCardStrategy: HumanChooseCardStrategy

  constructor({ game, name, humanChooseCardStrategy }: AIPlayerProps) {
    super({ name })
    this.game = game
    this.humanChooseCardStrategy = humanChooseCardStrategy
  }

  getGame(): Game {
    return this.game
  }

  async chooseCard(): Promise<Card[]> {
    return this.humanChooseCardStrategy.chooseCard(this.getGame())
  }
}
