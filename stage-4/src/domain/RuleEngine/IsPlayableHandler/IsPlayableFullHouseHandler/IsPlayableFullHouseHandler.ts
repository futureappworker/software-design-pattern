import { isFullHouse } from '../../../../utils/ruleEngineUtils'
import type { Card } from '../../../Card/Card'
import type { CardPattern } from '../../../CardPattern/CardPattern'
import { IsPlayableHandler } from '../IsPlayableHandler'

export class IsPlayableFullHouseHandler extends IsPlayableHandler {
  isPlayable(cards: Card[], topPlay: CardPattern): boolean {
    // 葫蘆 (Full house)： 五張牌，其中以兩部分構成——三張數字相同的牌，和兩張數字相同的牌
    // 例如： 3-3-3-2-2、A-A-A-7-7

    // 是 Full house，回傳 true
    if (isFullHouse(cards)) {
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
