import { isPair } from '../../../../utils/ruleEngineUtils'
import type { Card } from '../../../Card/Card'
import { CardPattern } from '../../../CardPattern/CardPattern'
import { CardPatternType } from '../../../CardPattern/CardPatternType'
import { ParseCardPatternHandler } from '../ParseCardPatternHandler'

export class ParseCardPatternPairHandler extends ParseCardPatternHandler {
  parseCardPattern(cards: Card[]): CardPattern {
    // 對子 (Pair)

    // 是 Pair CardPattern
    if (isPair(cards)) {
      return new CardPattern({
        type: CardPatternType.Pair,
        cards,
      })
    }

    // 不是 Pair，交給下一個處理器
    if (this.next) {
      return this.next.parseCardPattern(cards)
    }

    // 鏈尾仍無法處理
    throw new Error('Cannot parse card pattern')
  }
}
