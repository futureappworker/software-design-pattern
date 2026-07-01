import type { Card } from '../../../Card/Card'
import { CardPattern } from '../../../CardPattern/CardPattern'
import { CardPatternType } from '../../../CardPattern/CardPatternType'
import { FindPlayablePatternsHandler } from '../FindPlayablePatternsHandler'

function findAllPairs(cards: Card[]): Card[][] {
  const pairs: Card[][] = []
  const byRank = new Map<number, Card[]>()

  for (const card of cards) {
    const rank = card.getRank()
    const group = byRank.get(rank) ?? []
    group.push(card)
    byRank.set(rank, group)
  }

  for (const group of byRank.values()) {
    if (group.length < 2) {
      continue
    }

    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        pairs.push([group[i], group[j]])
      }
    }
  }

  return pairs
}

function beatsTopPlay(pairCards: Card[], topPlay: CardPattern): boolean {
  const topCards = topPlay.getCards()

  const rankDiff = pairCards[0].getRank() - topCards[0].getRank()
  if (rankDiff !== 0) {
    return rankDiff > 0
  }

  const suitA = Math.max(pairCards[0].getSuit(), pairCards[1].getSuit())
  const suitB = Math.max(topCards[0].getSuit(), topCards[1].getSuit())
  return suitA > suitB
}

function toPairPatterns(pairs: Card[][]): CardPattern[] {
  return pairs.map(
    (pair) =>
      new CardPattern({
        type: CardPatternType.Pair,
        cards: pair,
      }),
  )
}

export class FindPlayablePatternsPairHandler extends FindPlayablePatternsHandler {
  /**
   * 從手牌中找出可出的對子牌型，否則交給下一個處理器。
   * @param cards - 玩家的手牌。
   * @param topPlay - 可選的頂牌，未提供時回傳所有對子牌型。
   * @returns 可出的對子牌型陣列。
   */
  findPlayablePatterns(
    cards: Card[],
    topPlay?: CardPattern | null,
  ): CardPattern[] {
    if (topPlay == null) {
      return toPairPatterns(findAllPairs(cards))
    }

    // topPlay 是 Pair，所以可以壓過 topPlay 的牌型也是 Pair
    // cards 可能是一堆 card 的陣列，要找所有 Pair 可能性的牌型
    if (topPlay.getType() === CardPatternType.Pair) {
      // 大小比較規則：將兩張牌中較大的牌作為比較基準；例如：A-A > 7-7
      return toPairPatterns(
        findAllPairs(cards).filter((pair) => beatsTopPlay(pair, topPlay)),
      )
    }

    if (this.next) {
      return this.next.findPlayablePatterns(cards, topPlay)
    }

    return []
  }
}
