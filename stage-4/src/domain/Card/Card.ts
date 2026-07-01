import type { Rank } from './Rank'
import type { Suit } from './Suit'

type CardProps = {
  rank: Rank
  suit: Suit
}

export class Card {
  private rank: Rank
  private suit: Suit

  /**
   * 建立一張撲克牌。
   * @param props - 牌的點數與花色。
   */
  constructor({ rank, suit }: CardProps) {
    this.rank = rank
    this.suit = suit
  }

  /**
   * 取得牌的點數。
   * @returns 牌的點數。
   */
  getRank() {
    return this.rank
  }

  /**
   * 取得牌的花色。
   * @returns 牌的花色。
   */
  getSuit() {
    return this.suit
  }

  /**
   * 將牌轉換為字串表示。
   * @returns 牌的字串描述。
   */
  toString() {
    return `${this.rank} of ${this.suit}`
  }
}
