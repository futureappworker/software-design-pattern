import {
  isFullHouse,
  sortFullHouseCards,
} from '../../../../utils/ruleEngineUtils'
import type { Card } from '../../../Card/Card'
import { CardPattern } from '../../../CardPattern/CardPattern'
import { CardPatternType } from '../../../CardPattern/CardPatternType'
import { ParseCardPatternHandler } from '../ParseCardPatternHandler'

export class ParseCardPatternFullHouseHandler extends ParseCardPatternHandler {
  /**
   * 嘗試將牌解析為葫蘆牌型，否則交給下一個處理器。
   * @param cards - 要解析的牌。
   * @returns 解析後的牌型。
   * @throws 責任鏈末端仍無法解析時拋出錯誤。
   */
  parseCardPattern(cards: Card[]): CardPattern {
    // 葫蘆 (Full house)

    // 是 Full house，回傳 CardPattern
    if (isFullHouse(cards)) {
      return new CardPattern({
        type: CardPatternType.FullHouse,
        cards: sortFullHouseCards(cards),
      })
    }

    // 不是 Full house，交給下一個處理器
    if (this.next) {
      return this.next.parseCardPattern(cards)
    }

    // 鏈尾仍無法處理
    throw new Error('Cannot parse card pattern')
  }
}
