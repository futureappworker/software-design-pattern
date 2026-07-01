import { isStraight } from '../../../../utils/ruleEngineUtils'
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

function getMaxCard(cards: Card[]): Card {
  return cards.reduce((max, card) =>
    card.getRank() > max.getRank() ? card : max,
  )
}

function beatsTopPlay(straightCards: Card[], topPlay: CardPattern): boolean {
  const card = getMaxCard(straightCards)
  const topCard = getMaxCard(topPlay.getCards())

  const rankDiff = card.getRank() - topCard.getRank()
  if (rankDiff !== 0) {
    return rankDiff > 0
  }

  return card.getSuit() > topCard.getSuit()
}

function findAllStraights(cards: Card[]): Card[][] {
  return combinations(cards, 5).filter((combo) => isStraight(combo))
}

function toStraightPatterns(straights: Card[][]): CardPattern[] {
  return straights.map(
    (combo) =>
      new CardPattern({
        type: CardPatternType.Straight,
        cards: combo,
      }),
  )
}

export class FindPlayablePatternsStraightHandler extends FindPlayablePatternsHandler {
  /**
   * 從手牌中找出可出的順子牌型，否則交給下一個處理器。
   * @param cards - 玩家的手牌。
   * @param topPlay - 可選的頂牌，未提供時回傳所有順子牌型。
   * @returns 可出的順子牌型陣列。
   */
  findPlayablePatterns(
    cards: Card[],
    topPlay?: CardPattern | null,
  ): CardPattern[] {
    if (topPlay == null) {
      return toStraightPatterns(findAllStraights(cards))
    }

    // topPlay 是 Straight，所以可以壓過 topPlay 的牌型也是 Straight
    // cards 可能是一堆 card 的陣列，要找所有 Straight 可能性的牌型
    if (topPlay.getType() === CardPatternType.Straight) {
      // 順子 (Straight)： 任何連續數字的五張牌；例如：3-4-5-6-7、10-J-Q-K-A、J-Q-K-A-2，或是 K-A-2-3-4
      // 大小比較規則：將五張牌中最大的牌作為比較基準；例如：2-3-4-5-6 > 10-J-Q-K-A
      return toStraightPatterns(
        findAllStraights(cards).filter((combo) => beatsTopPlay(combo, topPlay)),
      )
    }

    if (this.next) {
      return this.next.findPlayablePatterns(cards, topPlay)
    }

    return []
  }
}
