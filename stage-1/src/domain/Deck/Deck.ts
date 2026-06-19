import { Card } from '../Card/Card'
import { Rank } from '../Card/Rank'
import { Suit } from '../Card/Suit'

type DeckProps = {
  cards?: Card[]
}

export class Deck {
  private cards: Card[] = []

  /**
   * 初始化牌組
   * @param cards 初始卡片列表
   */
  constructor({ cards = [] }: DeckProps) {
    this.cards = [...cards]
  }

  initialize() {
    // 建立 52 張卡
    for (let rank = Rank.TWO; rank <= Rank.ACE; rank++) {
      for (let suit = Suit.CLUB; suit <= Suit.SPADE; suit++) {
        this.cards.push(new Card({ rank, suit }))
      }
    }
  }

  /**
   * 獲取牌組中所有卡的副本
   * @returns 卡片副本（修改不會影響原始牌組）
   */
  getCards() {
    return [...this.cards]
  }

  /**
   * 隨機洗牌
   * 使用 Fisher-Yates 演算法打亂牌的順序
   */
  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]]
    }
  }

  /**
   * 從牌組中隨機抽取一張卡
   * @returns 抽取的卡
   * @throws 如果牌組已無卡可抽
   */
  drawCard(): Card {
    if (this.cards.length === 0) {
      throw new Error('No cards left in deck')
    }
    const randomIndex = Math.floor(Math.random() * this.cards.length)
    const card = this.cards[randomIndex]
    this.cards.splice(randomIndex, 1)
    return card
  }
}
