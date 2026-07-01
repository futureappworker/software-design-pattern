import type { Card } from '../../Card/Card'
import type { CardPattern } from '../../CardPattern/CardPattern'

export abstract class ParseCardPatternHandler {
  next: ParseCardPatternHandler | null = null

  /**
   * 建立牌型解析處理器。
   * @param next - 責任鏈中的下一個處理器。
   */
  constructor(next: ParseCardPatternHandler | null = null) {
    this.next = next
  }

  /**
   * 將所選的牌解析為牌型。
   * @param cards - 要解析的牌。
   * @returns 解析後的牌型。
   */
  abstract parseCardPattern(cards: Card[]): CardPattern
}
