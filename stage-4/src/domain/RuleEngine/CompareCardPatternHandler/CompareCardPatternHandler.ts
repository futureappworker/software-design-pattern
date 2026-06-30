import type { CardPattern } from '../../CardPattern/CardPattern'

export abstract class CompareCardPatternHandler {
  next: CompareCardPatternHandler | null = null

  constructor(next: CompareCardPatternHandler | null = null) {
    this.next = next
  }

  abstract compareCardPattern(a: CardPattern, b: CardPattern): number
}
