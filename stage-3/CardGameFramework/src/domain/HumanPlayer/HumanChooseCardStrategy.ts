import type { Card } from '../Card/Card'
import type { Game } from '../Game/Game'

export interface HumanChooseCardStrategy {
  chooseCard(game: Game): Promise<Card[]>
}
