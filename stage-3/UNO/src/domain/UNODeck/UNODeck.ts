import { Deck as CardGameFrameworkDeck } from '../../../../CardGameFramework/src/index'
import { UNOCard } from '../UNOCard/UNOCard'
import { UNOCardColor } from '../UNOCard/UNOCardColor'
import { UNOCardNumber } from '../UNOCard/UNOCardNumber'

type UNODeckProps = {
  cards?: UNOCard[]
}

export class UNODeck extends CardGameFrameworkDeck {
  constructor({ cards = [] }: UNODeckProps) {
    super({ cards: [...cards] })
    this.initialize()
  }

  initialize() {
    // 每張牌都會擁有顏色 (Color) 及數字 (Number)。
    // 牌堆中一開始存有 40 張牌 (Card)：4 種顏色 (BLUE, RED, YELLOW, GREEN) x 10 個數字 (0~9)
    for (let color = UNOCardColor.BLUE; color <= UNOCardColor.GREEN; color++) {
      for (let num = UNOCardNumber.ZERO; num <= UNOCardNumber.NINE; num++) {
        this.addCards([new UNOCard({ color, num })])
      }
    }
  }
}
