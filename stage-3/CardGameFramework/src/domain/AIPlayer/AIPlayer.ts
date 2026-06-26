import type { Card } from '../Card/Card'
import type { Game } from '../Game/Game'
import { Player } from '../Player/Player'
import type { AIChooseCardStrategy } from './AIChooseCardStrategy'

type AIPlayerProps = {
  game: Game
  name: string
  aiChooseCardStrategy: AIChooseCardStrategy
}

export class AIPlayer extends Player {
  private game: Game
  private aiChooseCardStrategy: AIChooseCardStrategy

  constructor({ game, name, aiChooseCardStrategy }: AIPlayerProps) {
    super({ name })
    this.game = game
    this.aiChooseCardStrategy = aiChooseCardStrategy
  }

  getGame(): Game {
    return this.game
  }

  async chooseCard(): Promise<Card> {
    return this.aiChooseCardStrategy.chooseCard(this.getGame())
  }
}
