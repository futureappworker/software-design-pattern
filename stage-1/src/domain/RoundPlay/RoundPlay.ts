import type { Card } from '../Card/Card'
import type { Player } from '../Player/Player'

type RoundPlayProps = {
  player: Player
  card: Card
}

export class RoundPlay {
  private player: Player
  private card: Card

  constructor({ player, card }: RoundPlayProps) {
    this.player = player
    this.card = card
  }

  getPlayer() {
    return this.player
  }

  getCard() {
    return this.card
  }
}
