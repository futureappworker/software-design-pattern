import { isStraight } from '../../../../utils/ruleEngineUtils'
import type { Card } from '../../../Card/Card'
import type { CardPattern } from '../../../CardPattern/CardPattern'
import { IsPlayableHandler } from '../IsPlayableHandler'

export class IsPlayableStraightHandler extends IsPlayableHandler {
  isPlayable(cards: Card[], topPlay: CardPattern): boolean {
    // 順子 (Straight)： 任何連續數字的五張牌
    // 例如：3-4-5-6-7、10-J-Q-K-A、J-Q-K-A-2，或是 K-A-2-3-4

    // 是 Straight，回傳 true
    // 注意: Two 要在 Ace 之後
    if (isStraight(cards)) {
      return true
    }

    // 不是 Straight，交給下一個處理器
    if (this.next) {
      return this.next.isPlayable(cards, topPlay)
    }

    // 鏈尾仍無法處理
    return false
  }
}
