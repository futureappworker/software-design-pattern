import type { Card } from '../../../Card/Card'
import { CardPattern } from '../../../CardPattern/CardPattern'
import { CardPatternType } from '../../../CardPattern/CardPatternType'
import { FindPlayablePatternsHandler } from '../FindPlayablePatternsHandler'

function beatsTopPlay(card: Card, topPlay: CardPattern): boolean {
  const topCard = topPlay.getCards()[0]
  const rankDiff = card.getRank() - topCard.getRank()
  if (rankDiff !== 0) {
    return rankDiff > 0
  }

  return card.getSuit() > topCard.getSuit()
}

function toSinglePatterns(cards: Card[]): CardPattern[] {
  return cards.map(
    (card) =>
      new CardPattern({
        type: CardPatternType.Single,
        cards: [card],
      }),
  )
}

export class FindPlayablePatternsSingleHandler extends FindPlayablePatternsHandler {
  findPlayablePatterns(
    cards: Card[],
    topPlay?: CardPattern | null,
  ): CardPattern[] {
    if (topPlay == null) {
      return toSinglePatterns(cards)
    }

    // topPlay 是 Single，所以可以壓過 topPlay 的牌型也是 Single
    // cards 可能是一堆 card 的陣列，要找所有 single 可能性的牌型
    if (topPlay.getType() === CardPatternType.Single) {
      // 大小比較規則：先比數字再比花色
      // 數字由小到大依序為：3<4<5<...<10<J<Q<K<A<2
      // 花色由小到大依序為：梅花 < 菱形 < 愛心 < 黑桃
      return toSinglePatterns(
        cards.filter((card) => beatsTopPlay(card, topPlay)),
      )
    }

    if (this.next) {
      return this.next.findPlayablePatterns(cards, topPlay)
    }

    return []
  }
}
