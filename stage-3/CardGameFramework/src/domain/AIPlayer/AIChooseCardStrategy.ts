import type { Card } from '../Card/Card'
import type { Game } from '../Game/Game'

export interface AIChooseCardStrategy {
  chooseCard(game: Game): Card
}
