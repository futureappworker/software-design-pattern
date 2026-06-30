import { isPair } from '../../../../utils/ruleEngineUtils'
import type { Card } from '../../../Card/Card'
import type { CardPattern } from '../../../CardPattern/CardPattern'
import { IsPlayableHandler } from '../IsPlayableHandler'

export class IsPlayablePairHandler extends IsPlayableHandler {
  isPlayable(cards: Card[], topPlay: CardPattern): boolean {
    // 對子 (Pair)：
    // 兩張數字相同的牌；例如：J-J、3-3

    // 是 Pair，回傳 true
    if (isPair(cards)) {
      return true
    }

    // 不是 Pair，交給下一個處理器
    if (this.next) {
      return this.next.isPlayable(cards, topPlay)
    }

    // 鏈尾仍無法處理
    return false
  }
}
