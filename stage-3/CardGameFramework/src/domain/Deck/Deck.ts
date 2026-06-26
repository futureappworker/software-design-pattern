import type { Card } from '../Card/Card'

type DeckProps = {
  cards: Card[]
}

export class Deck {
  private cards: Card[] = []

  constructor({ cards = [] }: DeckProps) {
    this.setCards(cards)
  }

  /**
   * 獲取牌組中所有卡的副本
   * @returns 卡片副本（修改不會影響原始牌組）
   */
  getCards() {
    return [...this.cards]
  }

  /**
   * 設定牌組中的所有卡
   * @param cards 要設定的卡片列表
   */
  setCards(cards: Card[]) {
    this.cards = [...cards]
  }

  /**
   * 將卡片加入牌組末尾
   * @param cards 要加入的卡片列表
   */
  addCards(cards: Card[]) {
    this.cards.push(...cards)
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
   * 從牌組頂端抽取一張卡
   * @returns 抽取的卡
   * @throws 如果牌組已無卡可抽
   */
  drawCard(): Card {
    const card = this.cards.shift()
    if (card === undefined) {
      throw new Error('No cards left in deck')
    }
    return card
  }

  /**
   * 取走牌組中剩餘的所有卡並清空牌組
   * @returns 剩餘的卡片列表
   */
  takeRemainingCards() {
    const remainingCards = this.cards
    this.cards = []
    return remainingCards
  }
}
