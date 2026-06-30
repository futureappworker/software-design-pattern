import { isPair } from '../../../../utils/ruleEngineUtils'
import type { CardPattern } from '../../../CardPattern/CardPattern'
import { CompareCardPatternHandler } from '../CompareCardPatternHandler'

function compareCards(a: CardPattern, b: CardPattern): number {
  // 大小比較規則：
  // 將兩張牌中較大的牌作為比較基準
  // 例如：A-A > 7-7
  const cardsA = a.getCards()
  const cardsB = b.getCards()

  const rankDiff = cardsA[0].getRank() - cardsB[0].getRank()
  if (rankDiff !== 0) {
    return rankDiff
  }

  const suitA = Math.max(cardsA[0].getSuit(), cardsA[1].getSuit())
  const suitB = Math.max(cardsB[0].getSuit(), cardsB[1].getSuit())
  return suitA - suitB
}

export class CompareCardPatternPairHandler extends CompareCardPatternHandler {
  compareCardPattern(a: CardPattern, b: CardPattern): number {
    // 對子 (Pair)

    // a 和 b 都是 Pair，比較大小
    if (isPair(a.getCards()) && isPair(b.getCards())) {
      return compareCards(a, b)
    }

    // a 或 b 不是 Pair，交給下一個處理器
    if (this.next) {
      return this.next.compareCardPattern(a, b)
    }

    return -1
  }
}
