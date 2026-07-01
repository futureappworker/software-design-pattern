import { shouldBeWithinRange } from '../../utils/shouldBeWithinRange'
import { Card } from '../Card/Card'
import { Rank } from '../Card/Rank'
import { Suit } from '../Card/Suit'

type DeckProps = {
  cards?: Card[]
}

export class Deck {
  private cards: Card[] = []

  constructor({ cards = [] }: DeckProps) {
    this.cards = cards
  }

  initialize() {
    // 建立 52 張卡
    for (let rank = Rank.Three; rank <= Rank.Two; rank++) {
      for (let suit = Suit.Club; suit <= Suit.Spade; suit++) {
        this.cards.push(new Card({ rank, suit }))
      }
    }
  }

  getCards() {
    return [...this.cards]
  }

  setCards(cards: Card[]) {
    shouldBeWithinRange({
      name: 'Deck cards length',
      num: cards.length,
      inclusiveMin: 0,
      inclusiveMax: 52,
    })

    this.cards = cards
  }

  draw(): Card {
    const card = this.cards.pop()
    if (card === undefined) {
      throw new Error('No cards left in deck')
    }
    return card
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]]
    }
  }

  isEmpty() {
    return this.cards.length === 0
  }

  size() {
    return this.cards.length
  }
}
