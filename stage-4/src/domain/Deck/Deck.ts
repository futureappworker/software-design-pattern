import { shouldBeWithinRange } from '../../utils/shouldBeWithinRange'
import { Card } from '../Card/Card'
import { Rank } from '../Card/Rank'
import { Suit } from '../Card/Suit'

type DeckProps = {
  cards?: Card[]
}

export class Deck {
  private cards: Card[] = []

  /**
   * 建立一副牌堆。
   * @param props - 可選的初始牌組。
   */
  constructor({ cards = [] }: DeckProps) {
    this.cards = cards
  }

  /**
   * 建立 52 張標準撲克牌。
   */
  initialize() {
    // 建立 52 張卡
    for (let rank = Rank.Three; rank <= Rank.Two; rank++) {
      for (let suit = Suit.Club; suit <= Suit.Spade; suit++) {
        this.cards.push(new Card({ rank, suit }))
      }
    }
  }

  /**
   * 取得牌堆中所有牌的副本。
   * @returns 牌堆中的牌陣列。
   */
  getCards() {
    return [...this.cards]
  }

  /**
   * 設定牌堆中的牌。
   * @param cards - 新的牌陣列，長度須為 0 至 52。
   */
  setCards(cards: Card[]) {
    shouldBeWithinRange({
      name: 'Deck cards length',
      num: cards.length,
      inclusiveMin: 0,
      inclusiveMax: 52,
    })

    this.cards = cards
  }

  /**
   * 從牌堆頂端抽一張牌。
   * @returns 抽出的牌。
   * @throws 牌堆為空時拋出錯誤。
   */
  draw(): Card {
    const card = this.cards.pop()
    if (card === undefined) {
      throw new Error('No cards left in deck')
    }
    return card
  }

  /**
   * 以 Fisher-Yates 演算法洗牌。
   */
  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]]
    }
  }

  /**
   * 檢查牌堆是否為空。
   * @returns 牌堆為空時回傳 true。
   */
  isEmpty() {
    return this.cards.length === 0
  }

  /**
   * 取得牌堆中的牌數。
   * @returns 牌堆中的牌數。
   */
  size() {
    return this.cards.length
  }
}
