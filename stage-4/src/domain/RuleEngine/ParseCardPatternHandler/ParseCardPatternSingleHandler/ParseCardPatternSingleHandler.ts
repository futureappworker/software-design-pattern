import { isSingle } from '../../../../utils/ruleEngineUtils'
import type { Card } from '../../../Card/Card'
import { CardPattern } from '../../../CardPattern/CardPattern'
import { CardPatternType } from '../../../CardPattern/CardPatternType'
import { ParseCardPatternHandler } from '../ParseCardPatternHandler'

export class ParseCardPatternSingleHandler extends ParseCardPatternHandler {
  parseCardPattern(cards: Card[]): CardPattern {
    // 單張 (Single)：一張牌

    // 是 Single，回傳 CardPattern
    if (isSingle(cards)) {
      return new CardPattern({
        type: CardPatternType.Single,
        cards,
      })
    }

    // 不是 Single，交給下一個處理器
    if (this.next) {
      return this.next.parseCardPattern(cards)
    }

    // 鏈尾仍無法處理
    throw new Error('Cannot parse card pattern')
  }
}
