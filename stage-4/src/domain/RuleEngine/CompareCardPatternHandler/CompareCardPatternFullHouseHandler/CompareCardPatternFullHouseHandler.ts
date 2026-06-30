import { isFullHouse } from '../../../../utils/ruleEngineUtils'
import type { Card } from '../../../Card/Card'
import type { CardPattern } from '../../../CardPattern/CardPattern'
import { CompareCardPatternHandler } from '../CompareCardPatternHandler'

function findTripleRank(cards: Card[]): number {
  const rankCounts = new Map<number, number>()
  for (const card of cards) {
    const rank = card.getRank()
    rankCounts.set(rank, (rankCounts.get(rank) ?? 0) + 1)
  }
  for (const [rank, count] of rankCounts) {
    if (count === 3) {
      return rank
    }
  }
  return cards[0].getRank()
}

function compareCards(a: CardPattern, b: CardPattern): number {
  // 大小比較規則：以三張數字相同的牌中，數字最大的牌作為比較基準
  // 例如：A-A-A-3-3 > 5-5-5-2-2

  // 已經確認 a 和 b 都是 Full house，所以可以取出三張數字相同的牌
  // 例如：A-A-A-3-3，取出 A-A-A
  // 然後直接比較這三張牌的大小
  const cardsA = a.getCards()
  const cardsB = b.getCards()

  const tripleRankA = findTripleRank(cardsA)
  const tripleRankB = findTripleRank(cardsB)

  return tripleRankA - tripleRankB
}

export class CompareCardPatternFullHouseHandler extends CompareCardPatternHandler {
  compareCardPattern(a: CardPattern, b: CardPattern): number {
    // 葫蘆 (Full house)

    // a 和 b 都是 Full house，比較大小
    if (isFullHouse(a.getCards()) && isFullHouse(b.getCards())) {
      return compareCards(a, b)
    }

    // a 或 b 不是 Full house，交給下一個處理器
    if (this.next) {
      return this.next.compareCardPattern(a, b)
    }

    return -1
  }
}
