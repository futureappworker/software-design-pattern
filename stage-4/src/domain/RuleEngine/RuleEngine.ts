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

  /**
   * 建立規則引擎。
   * @param props - 牌型解析、比較與可出牌型查找的責任鏈處理器。
   */
  constructor({
    parseCardPatternHandler,
    compareCardPatternHandler,
    findPlayablePatternsHandler,
  }: RuleEngineProps) {
    this.parseCardPatternHandler = parseCardPatternHandler
    this.compareCardPatternHandler = compareCardPatternHandler
    this.findPlayablePatternsHandler = findPlayablePatternsHandler
  }

  /**
   * 檢查所選的牌是否能壓過檯面上的頂牌。
   * @param cards - 玩家選擇的牌。
   * @param topPlay - 目前檯面上的頂牌。
   * @returns 可出牌時回傳 true，否則回傳 false。
   */
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

  /**
   * 將所選的牌解析為牌型。
   * @param cards - 要解析的牌。
   * @returns 解析後的牌型。
   */
  parseCardPattern(cards: Card[]): CardPattern {
    return this.parseCardPatternHandler.parseCardPattern(cards)
  }

  /**
   * 比較兩個牌型的大小。
   * @param a - 第一個牌型。
   * @param b - 第二個牌型。
   * @returns 正數表示 a 較大，負數表示 b 較大，0 表示相等。
   */
  compareCardPattern(a: CardPattern, b: CardPattern): number {
    return this.compareCardPatternHandler.compareCardPattern(a, b)
  }

  /**
   * 從手牌中找出所有可出的牌型。
   * @param cards - 玩家的手牌。
   * @param topPlay - 可選的頂牌，未提供時回傳所有合法牌型。
   * @returns 可出的牌型陣列。
   */
  findPlayablePatterns(
    cards: Card[],
    topPlay?: CardPattern | null,
  ): CardPattern[] {
    return this.findPlayablePatternsHandler.findPlayablePatterns(cards, topPlay)
  }
}
