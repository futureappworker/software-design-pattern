import type { Rank } from './Rank'
import type { Suit } from './Suit'

type CardProps = {
  rank: Rank
  suit: Suit
}

export class Card {
  private rank: Rank
  private suit: Suit

  constructor({ rank, suit }: CardProps) {
    this.rank = rank
    this.suit = suit
  }

  getRank() {
    return this.rank
  }

  getSuit() {
    return this.suit
  }

  toString() {
    return `${this.rank} of ${this.suit}`
  }
}
