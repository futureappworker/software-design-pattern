import type { Card } from '../../Card/Card'
import type { CardPattern } from '../../CardPattern/CardPattern'

export abstract class ParseCardPatternHandler {
  next: ParseCardPatternHandler | null = null

  constructor(next: ParseCardPatternHandler | null = null) {
    this.next = next
  }

  abstract parseCardPattern(cards: Card[]): CardPattern
}
