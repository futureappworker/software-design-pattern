import { Deck as CardGameFrameworkDeck } from '../../../../CardGameFramework/src/index'
import { Card } from '../Card/Card'
import { Rank } from '../Card/Rank'
import { Suit } from '../Card/Suit'

type DeckProps = {
  cards?: Card[]
}

export class Deck extends CardGameFrameworkDeck {
  constructor({ cards = [] }: DeckProps) {
    super({ cards: [...cards] })
    this.initialize()
  }

  initialize() {
    // 建立 52 張卡
    for (let rank = Rank.TWO; rank <= Rank.ACE; rank++) {
      for (let suit = Suit.CLUB; suit <= Suit.SPADE; suit++) {
        this.addCards([new Card({ rank, suit })])
      }
    }
  }
}
