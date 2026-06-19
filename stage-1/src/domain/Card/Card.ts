import { type Rank, rankLabels } from './Rank'
import { type Suit, suitLabels } from './Suit'

type CardProps = {
  rank: Rank
  suit: Suit
}

export class Card {
  private rank
  private suit

  /**
   * 初始化卡片
   * @param rank 卡的等級（2-ACE）
   * @param suit 卡的花色（CLUB、DIAMOND、HEART、SPADE）
   */
  constructor({ rank, suit }: CardProps) {
    this.rank = rank
    this.suit = suit
  }

  /**
   * 獲取卡的等級
   * @returns 卡的等級值
   */
  getRank() {
    return this.rank
  }

  /**
   * 獲取卡的花色
   * @returns 卡的花色值
   */
  getSuit() {
    return this.suit
  }

  toString() {
    return `${rankLabels[this.rank]} of ${suitLabels[this.suit]}`
  }
}
