import { isSingle } from '../../../../utils/ruleEngineUtils'
import type { Card } from '../../../Card/Card'
import type { CardPattern } from '../../../CardPattern/CardPattern'
import { IsPlayableHandler } from '../IsPlayableHandler'

export class IsPlayableSingleHandler extends IsPlayableHandler {
  isPlayable(cards: Card[], topPlay: CardPattern): boolean {
    // 單張 (Single)：一張牌

    // 是 Single，回傳 true
    if (isSingle(cards)) {
      return true
    }

    // 不是 Single，交給下一個處理器
    if (this.next) {
      return this.next.isPlayable(cards, topPlay)
    }

    // 鏈尾仍無法處理
    return false
  }
}
