import { isSingle } from '../../../../utils/ruleEngineUtils'
import type { Card } from '../../../Card/Card'
import { CardPattern } from '../../../CardPattern/CardPattern'
import { CardPatternType } from '../../../CardPattern/CardPatternType'
import { ParseCardPatternHandler } from '../ParseCardPatternHandler'

export class ParseCardPatternSingleHandler extends ParseCardPatternHandler {
  /**
   * 嘗試將牌解析為單張牌型，否則交給下一個處理器。
   * @param cards - 要解析的牌。
   * @returns 解析後的牌型。
   * @throws 責任鏈末端仍無法解析時拋出錯誤。
   */
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
