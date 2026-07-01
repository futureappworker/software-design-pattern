import type { Card } from '../../Card/Card'
import type { CardPattern } from '../../CardPattern/CardPattern'

export abstract class FindPlayablePatternsHandler {
  next: FindPlayablePatternsHandler | null

  /**
   * 建立可出牌型查找處理器。
   * @param next - 責任鏈中的下一個處理器。
   */
  constructor(next: FindPlayablePatternsHandler | null) {
    this.next = next
  }

  /**
   * 從手牌中找出可出的牌型。
   * @param cards - 玩家的手牌。
   * @param topPlay - 可選的頂牌，未提供時回傳所有合法牌型。
   * @returns 可出的牌型陣列。
   */
  abstract findPlayablePatterns(
    cards: Card[],
    topPlay?: CardPattern | null,
  ): CardPattern[]
}
