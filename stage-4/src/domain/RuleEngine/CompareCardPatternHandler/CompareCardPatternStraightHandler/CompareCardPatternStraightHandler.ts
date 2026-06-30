import { isStraight } from '../../../../utils/ruleEngineUtils'
import type { CardPattern } from '../../../CardPattern/CardPattern'
import { CompareCardPatternHandler } from '../CompareCardPatternHandler'

function compareCards(a: CardPattern, b: CardPattern): number {
  // 大小比較規則：將五張牌中最大的牌作為比較基準
  // 例如：2-3-4-5-6 > 10-J-Q-K-A
  const cardsA = a.getCards()
  const cardsB = b.getCards()

  const cardA = cardsA.reduce((max, card) =>
    card.getRank() > max.getRank() ? card : max,
  )
  const cardB = cardsB.reduce((max, card) =>
    card.getRank() > max.getRank() ? card : max,
  )

  const rankDiff = cardA.getRank() - cardB.getRank()
  if (rankDiff !== 0) {
    return rankDiff
  }

  return cardA.getSuit() - cardB.getSuit()
}

export class CompareCardPatternStraightHandler extends CompareCardPatternHandler {
  compareCardPattern(a: CardPattern, b: CardPattern): number {
    // 順子 (Straight)

    // a 和 b 都是 Straight，比較大小
    if (isStraight(a.getCards()) && isStraight(b.getCards())) {
      return compareCards(a, b)
    }

    // a 或 b 不是 Straight，交給下一個處理器
    if (this.next) {
      return this.next.compareCardPattern(a, b)
    }

    return -1
  }
}
