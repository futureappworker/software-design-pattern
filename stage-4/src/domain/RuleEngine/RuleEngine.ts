import type { Card } from '../Card/Card'
import type { CardPattern } from '../CardPattern/CardPattern'
import type { CompareCardPatternHandler } from './CompareCardPatternHandler/CompareCardPatternHandler'
import type { FindPlayablePatternsHandler } from './FindPlayablePatternsHandler/FindPlayablePatternsHandler'
import type { IsPlayableHandler } from './IsPlayableHandler/IsPlayableHandler'
import type { ParseCardPatternHandler } from './ParseCardPatternHandler/ParseCardPatternHandler'

type RuleEngineProps = {
  isPlayableHandler: IsPlayableHandler
  parseCardPatternHandler: ParseCardPatternHandler
  compareCardPatternHandler: CompareCardPatternHandler
  findPlayablePatternsHandler: FindPlayablePatternsHandler
}

export class RuleEngine {
  private isPlayableHandler: IsPlayableHandler
  private parseCardPatternHandler: ParseCardPatternHandler
  private compareCardPatternHandler: CompareCardPatternHandler
  private findPlayablePatternsHandler: FindPlayablePatternsHandler

  constructor({
    isPlayableHandler,
    parseCardPatternHandler,
    compareCardPatternHandler,
    findPlayablePatternsHandler,
  }: RuleEngineProps) {
    this.isPlayableHandler = isPlayableHandler
    this.parseCardPatternHandler = parseCardPatternHandler
    this.compareCardPatternHandler = compareCardPatternHandler
    this.findPlayablePatternsHandler = findPlayablePatternsHandler
  }

  isPlayable(cards: Card[], topPlay: CardPattern): boolean {
    return this.isPlayableHandler.isPlayable(cards, topPlay)
  }

  parseCardPattern(cards: Card[]): CardPattern {
    return this.parseCardPatternHandler.parseCardPattern(cards)
  }

  compareCardPattern(a: CardPattern, b: CardPattern): number {
    return this.compareCardPatternHandler.compareCardPattern(a, b)
  }

  findPlayablePatterns(
    cards: Card[],
    topPlay?: CardPattern | null,
  ): CardPattern[] {
    return this.findPlayablePatternsHandler.findPlayablePatterns(cards, topPlay)
  }
}
