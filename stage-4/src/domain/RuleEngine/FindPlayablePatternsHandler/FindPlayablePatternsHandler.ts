import type { Card } from '../../Card/Card'
import type { CardPattern } from '../../CardPattern/CardPattern'

export abstract class FindPlayablePatternsHandler {
  next: FindPlayablePatternsHandler | null

  constructor(next: FindPlayablePatternsHandler | null) {
    this.next = next
  }

  abstract findPlayablePatterns(
    cards: Card[],
    topPlay?: CardPattern | null,
  ): CardPattern[]
}
