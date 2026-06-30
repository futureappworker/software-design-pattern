import type { Card } from '../Card/Card'
import type { CardPatternType } from './CardPatternType'

type CardPatternProps = {
  type: CardPatternType
  cards: Card[]
}

export class CardPattern {
  private type!: CardPatternType
  private cards!: Card[]

  constructor({ type, cards }: CardPatternProps) {
    this.setType(type)
    this.setCards(cards)
  }

  getType() {
    return this.type
  }

  setType(type: CardPatternType) {
    this.type = type
  }

  getCards() {
    return this.cards
  }

  setCards(cards: Card[]) {
    this.cards = cards
  }
}
