import { shouldBeWithinRange } from '../../../utils/shouldBeWithinRange'
import type { Card } from '../../Card/Card'

type HandProps = {
  cards?: Card[]
}

export class Hand {
  private cards: Card[] = []

  constructor({ cards = [] }: HandProps) {
    this.setCards(cards)
    this.sortCards()
  }

  getCards() {
    return [...this.cards]
  }

  setCards(cards: Card[]) {
    shouldBeWithinRange({
      name: 'Hand cards length',
      num: cards.length,
      inclusiveMin: 0,
      inclusiveMax: 13,
    })

    this.cards = [...cards]
  }

  addCard(card: Card) {
    this.cards.push(card)
    this.sortCards()
  }

  addCards(cards: Card[]) {
    this.cards.push(...cards)
    this.sortCards()
  }

  removeCard(card: Card): Card {
    const index = this.cards.indexOf(card)
    if (index === -1) {
      throw new Error('Card not found in hand')
    }
    return this.cards.splice(index, 1)[0]
  }

  removeCards(cards: Card[]): Card[] {
    return cards.map((card) => this.removeCard(card))
  }

  size(): number {
    return this.cards.length
  }

  isEmpty(): boolean {
    return this.cards.length === 0
  }

  getSortedCards(): Card[] {
    return [...this.cards].sort((a, b) => {
      const rankDiff = a.getRank() - b.getRank()
      if (rankDiff !== 0) {
        return rankDiff
      }
      return a.getSuit() - b.getSuit()
    })
  }

  sortCards() {
    this.cards = this.getSortedCards()
  }
}
