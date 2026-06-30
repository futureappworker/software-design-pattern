import type { Card } from '../../Card/Card'
import type { CardPattern } from '../../CardPattern/CardPattern'

export abstract class IsPlayableHandler {
  next: IsPlayableHandler | null = null

  constructor(next: IsPlayableHandler | null) {
    this.next = next
  }

  abstract isPlayable(cards: Card[], topPlay: CardPattern): boolean
}
