import type { Card } from '../Card/Card'
import type { CardPatternType } from './CardPatternType'

type CardPatternProps = {
  type: CardPatternType
  cards: Card[]
}

export class CardPattern {
  private type!: CardPatternType
  private cards!: Card[]

  /**
   * 建立一個牌型。
   * @param props - 牌型種類與組成牌。
   */
  constructor({ type, cards }: CardPatternProps) {
    this.setType(type)
    this.setCards(cards)
  }

  /**
   * 取得牌型種類。
   * @returns 牌型種類。
   */
  getType() {
    return this.type
  }

  /**
   * 設定牌型種類。
   * @param type - 牌型種類。
   */
  setType(type: CardPatternType) {
    this.type = type
  }

  /**
   * 取得組成此牌型的牌。
   * @returns 組成牌型的牌陣列。
   */
  getCards() {
    return this.cards
  }

  /**
   * 設定組成此牌型的牌。
   * @param cards - 組成牌型的牌陣列。
   */
  setCards(cards: Card[]) {
    this.cards = cards
  }
}
