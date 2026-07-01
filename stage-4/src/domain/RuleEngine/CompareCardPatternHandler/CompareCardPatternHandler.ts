import type { CardPattern } from '../../CardPattern/CardPattern'

export abstract class CompareCardPatternHandler {
  next: CompareCardPatternHandler | null = null

  /**
   * 建立牌型比較處理器。
   * @param next - 責任鏈中的下一個處理器。
   */
  constructor(next: CompareCardPatternHandler | null = null) {
    this.next = next
  }

  /**
   * 比較兩個牌型的大小。
   * @param a - 第一個牌型。
   * @param b - 第二個牌型。
   * @returns 正數表示 a 較大，負數表示 b 較大，0 表示相等。
   */
  abstract compareCardPattern(a: CardPattern, b: CardPattern): number
}
