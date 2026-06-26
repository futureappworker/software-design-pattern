import type { Card } from '../Card/Card'

type DiscardPileProps = {
  cards?: Card[]
}

export class DiscardPile {
  private cards: Card[] = []

  constructor({ cards = [] }: DiscardPileProps) {
    this.cards = [...cards]
  }

  getCards() {
    return [...this.cards]
  }

  addCards(cards: Card[]) {
    this.cards.push(...cards)
  }

  takeAllCards(): Card[] {
    const cards = this.cards
    this.cards = []
    return cards
  }
}
