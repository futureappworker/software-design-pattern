import { Card as CardGameFrameworkCard } from '../../../../CardGameFramework/src/index'

import { type PlayingCardRank, playingCardRankLabels } from './PlayingCardRank'
import { type PlayingCardSuit, playingCardSuitLabels } from './PlayingCardSuit'

type PlayingCardProps = {
  rank: PlayingCardRank
  suit: PlayingCardSuit
}

export class PlayingCard extends CardGameFrameworkCard {
  private rank
  private suit

  constructor({ rank, suit }: PlayingCardProps) {
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
    return `${playingCardRankLabels[this.rank]} of ${playingCardSuitLabels[this.suit]}`
  }
}
