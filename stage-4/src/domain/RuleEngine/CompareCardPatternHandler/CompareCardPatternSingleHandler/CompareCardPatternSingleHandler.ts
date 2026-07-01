import { isSingle } from '../../../../utils/ruleEngineUtils'
import type { CardPattern } from '../../../CardPattern/CardPattern'
import { CompareCardPatternHandler } from '../CompareCardPatternHandler'

function compareCards(a: CardPattern, b: CardPattern): number {
  // 大小比較規則：
  // 先比數字再比花色
  // 數字由小到大依序為：3<4<5<...<10<J<Q<K<A<2
  // 花色由小到大依序為：梅花 < 菱形 < 愛心 < 黑桃
  const cardA = a.getCards()[0]
  const cardB = b.getCards()[0]

  const rankDiff = cardA.getRank() - cardB.getRank()
  if (rankDiff !== 0) {
    return rankDiff
  }

  return cardA.getSuit() - cardB.getSuit()
}

export class CompareCardPatternSingleHandler extends CompareCardPatternHandler {
  /**
   * 比較兩個單張牌型的大小，否則交給下一個處理器。
   * @param a - 第一個牌型。
   * @param b - 第二個牌型。
   * @returns 正數表示 a 較大，負數表示 b 較大，0 表示相等。
   */
  compareCardPattern(a: CardPattern, b: CardPattern): number {
    // 單張 (Single)

    // a 和 b 都是 Single，比較大小
    if (isSingle(a.getCards()) && isSingle(b.getCards())) {
      return compareCards(a, b)
    }

    // a 或 b 不是 Single，交給下一個處理器
    if (this.next) {
      return this.next.compareCardPattern(a, b)
    }

    return -1
  }
}
