import { Deck as CardGameFrameworkDeck } from '../../../../CardGameFramework/src/index'
import { PlayingCard } from '../PlayingCard/PlayingCard'
import { PlayingCardRank } from '../PlayingCard/PlayingCardRank'
import { PlayingCardSuit } from '../PlayingCard/PlayingCardSuit'

type PlayingCardDeckProps = {
  cards?: PlayingCard[]
}

export class PlayingCardDeck extends CardGameFrameworkDeck {
  constructor({ cards = [] }: PlayingCardDeckProps) {
    super({ cards: [...cards] })
    this.initialize()
  }

  initialize() {
    // 建立 52 張卡
    for (let rank = PlayingCardRank.TWO; rank <= PlayingCardRank.ACE; rank++) {
      for (let suit = PlayingCardSuit.CLUB; suit <= PlayingCardSuit.SPADE; suit++) {
        this.addCards([new PlayingCard({ rank, suit })])
      }
    }
  }
}
