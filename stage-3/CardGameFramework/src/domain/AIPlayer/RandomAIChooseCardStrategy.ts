import type { Card } from '../Card/Card'
import type { Game } from '../Game/Game'
import type { AIChooseCardStrategy } from './AIChooseCardStrategy'

export class RandomAIChooseCardStrategy implements AIChooseCardStrategy {
  chooseCard(game: Game): Card {
    const hand = game.getCurrentPlayer().getHand()

    if (hand.length === 0) {
      throw new Error('Hand is empty')
    }

    const index = Math.floor(Math.random() * hand.length)
    return game.getCurrentPlayer().removeCardFromHandAt(index)
  }
}
