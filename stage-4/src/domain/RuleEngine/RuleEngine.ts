import type { Card } from '../Card/Card'
import type { CardPattern } from '../CardPattern/CardPattern'
import type { CompareCardPatternHandler } from './CompareCardPatternHandler/CompareCardPatternHandler'
import type { FindPlayablePatternsHandler } from './FindPlayablePatternsHandler/FindPlayablePatternsHandler'
import type { ParseCardPatternHandler } from './ParseCardPatternHandler/ParseCardPatternHandler'

type RuleEngineProps = {
  parseCardPatternHandler: ParseCardPatternHandler
  compareCardPatternHandler: CompareCardPatternHandler
  findPlayablePatternsHandler: FindPlayablePatternsHandler
}

export class RuleEngine {
  private parseCardPatternHandler: ParseCardPatternHandler
  private compareCardPatternHandler: CompareCardPatternHandler
  private findPlayablePatternsHandler: FindPlayablePatternsHandler

  constructor({
    parseCardPatternHandler,
    compareCardPatternHandler,
    findPlayablePatternsHandler,
  }: RuleEngineProps) {
    this.parseCardPatternHandler = parseCardPatternHandler
    this.compareCardPatternHandler = compareCardPatternHandler
    this.findPlayablePatternsHandler = findPlayablePatternsHandler
  }

  isPlayable(cards: Card[], topPlay: CardPattern): boolean {
    try {
      // 解析牌型
      const pattern = this.parseCardPattern(cards)
      // 如果牌型不同，則不合法
      if (pattern.getType() !== topPlay.getType()) {
        return false
      }
      // 如果牌型相同，則比較大小
      return this.compareCardPattern(pattern, topPlay) > 0
    } catch {
      return false
    }
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
