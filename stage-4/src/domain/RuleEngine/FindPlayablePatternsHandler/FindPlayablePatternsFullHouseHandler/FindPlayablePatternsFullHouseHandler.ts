import {
  isFullHouse,
  sortFullHouseCards,
} from '../../../../utils/ruleEngineUtils'
import type { Card } from '../../../Card/Card'
import { CardPattern } from '../../../CardPattern/CardPattern'
import { CardPatternType } from '../../../CardPattern/CardPatternType'
import { FindPlayablePatternsHandler } from '../FindPlayablePatternsHandler'

function combinations(cards: Card[], size: number): Card[][] {
  const result: Card[][] = []

  function backtrack(start: number, current: Card[]) {
    if (current.length === size) {
      result.push([...current])
      return
    }

    for (let i = start; i < cards.length; i++) {
      current.push(cards[i])
      backtrack(i + 1, current)
      current.pop()
    }
  }

  backtrack(0, [])
  return result
}

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

function beatsTopPlay(fullHouseCards: Card[], topPlay: CardPattern): boolean {
  const tripleRank = findTripleRank(fullHouseCards)
  const topTripleRank = findTripleRank(topPlay.getCards())
  return tripleRank > topTripleRank
}

function findAllFullHouses(cards: Card[]): Card[][] {
  return combinations(cards, 5).filter((combo) => isFullHouse(combo))
}

function toFullHousePatterns(fullHouses: Card[][]): CardPattern[] {
  return fullHouses.map(
    (combo) =>
      new CardPattern({
        type: CardPatternType.FullHouse,
        cards: sortFullHouseCards(combo),
      }),
  )
}

export class FindPlayablePatternsFullHouseHandler extends FindPlayablePatternsHandler {
  findPlayablePatterns(
    cards: Card[],
    topPlay?: CardPattern | null,
  ): CardPattern[] {
    if (topPlay == null) {
      return toFullHousePatterns(findAllFullHouses(cards))
    }

    // topPlay 是 Full house，所以可以壓過 topPlay 的牌型也是 Full house
    // cards 可能是一堆 card 的陣列，要找所有 Full house 可能性的牌型
    if (topPlay.getType() === CardPatternType.FullHouse) {
      // 葫蘆 (Full house)： 五張牌，其中以兩部分構成——三張數字相同的牌，和兩張數字相同的牌；例如： 3-3-3-2-2、A-A-A-7-7。
      // 大小比較規則：以三張數字相同的牌中，數字最大的牌作為比較基準；例如：A-A-A-3-3 > 5-5-5-2-2。
      return toFullHousePatterns(
        findAllFullHouses(cards).filter((combo) =>
          beatsTopPlay(combo, topPlay),
        ),
      )
    }

    if (this.next) {
      return this.next.findPlayablePatterns(cards, topPlay)
    }

    return []
  }
}
