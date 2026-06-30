import { isStraight } from '../../../../utils/ruleEngineUtils'
import type { Card } from '../../../Card/Card'
import { CardPattern } from '../../../CardPattern/CardPattern'
import { CardPatternType } from '../../../CardPattern/CardPatternType'
import { ParseCardPatternHandler } from '../ParseCardPatternHandler'

export class ParseCardPatternStraightHandler extends ParseCardPatternHandler {
  parseCardPattern(cards: Card[]): CardPattern {
    // 順子 (Straight)

    // 是 Straight，回傳 CardPattern
    if (isStraight(cards)) {
      return new CardPattern({
        type: CardPatternType.Straight,
        cards,
      })
    }

    // 不是 Straight，交給下一個處理器
    if (this.next) {
      return this.next.parseCardPattern(cards)
    }

    // 鏈尾仍無法處理
    throw new Error('Cannot parse card pattern')
  }
}
