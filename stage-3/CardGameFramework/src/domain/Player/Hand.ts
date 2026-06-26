import type { Card } from '../Card/Card'
import type { Deck } from '../Deck/Deck'

type HandProps = {
  cards?: Card[]
}

export class Hand {
  private cards: Card[] = []

  constructor({ cards = [] }: HandProps) {
    this.cards = [...cards]
  }

  drawCardFromDeck(deck: Deck): Card {
    const card = deck.drawCard()
    this.addCard(card)
    return card
  }

  addCard(card: Card) {
    this.cards.push(card)
  }

  getCards() {
    return [...this.cards]
  }

  removeCardAt(index: number): Card {
    if (this.cards.length === 0) {
      throw new Error('Hand is empty')
    }

    const card = this.cards[index]
    if (card === undefined) {
      throw new Error('Hand index out of range')
    }

    this.cards.splice(index, 1)
    return card
  }
}
