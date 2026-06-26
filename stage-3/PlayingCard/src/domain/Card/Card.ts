import { Card as CardGameFrameworkCard } from '../../../../CardGameFramework/src/index'

import { type Rank, rankLabels } from './Rank'
import { type Suit, suitLabels } from './Suit'

type CardProps = {
  rank: Rank
  suit: Suit
}

export class Card extends CardGameFrameworkCard {
  private rank
  private suit

  constructor({ rank, suit }: CardProps) {
    super()
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
    return `${rankLabels[this.rank]} of ${suitLabels[this.suit]}`
  }
}
