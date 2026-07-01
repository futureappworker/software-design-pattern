import { shouldBeWithinRange } from '../../../utils/shouldBeWithinRange'
import type { Card } from '../../Card/Card'

type HandProps = {
  cards?: Card[]
}

export class Hand {
  private cards: Card[] = []

  /**
   * 建立一手牌。
   * @param props - 可選的初始手牌。
   */
  constructor({ cards = [] }: HandProps) {
    this.setCards(cards)
    this.sortCards()
  }

  /**
   * 取得手牌的副本。
   * @returns 手牌陣列。
   */
  getCards() {
    return [...this.cards]
  }

  /**
   * 設定手牌。
   * @param cards - 新的手牌陣列，長度須為 0 至 13。
   */
  setCards(cards: Card[]) {
    shouldBeWithinRange({
      name: 'Hand cards length',
      num: cards.length,
      inclusiveMin: 0,
      inclusiveMax: 13,
    })

    this.cards = [...cards]
  }

  /**
   * 加入一張牌並重新排序。
   * @param card - 要加入的牌。
   */
  addCard(card: Card) {
    this.cards.push(card)
    this.sortCards()
  }

  /**
   * 加入多張牌並重新排序。
   * @param cards - 要加入的牌陣列。
   */
  addCards(cards: Card[]) {
    this.cards.push(...cards)
    this.sortCards()
  }

  /**
   * 從手牌中移除一張牌。
   * @param card - 要移除的牌。
   * @returns 被移除的牌。
   * @throws 手牌中找不到該牌時拋出錯誤。
   */
  removeCard(card: Card): Card {
    const index = this.cards.indexOf(card)
    if (index === -1) {
      throw new Error('Card not found in hand')
    }
    return this.cards.splice(index, 1)[0]
  }

  /**
   * 從手牌中移除多張牌。
   * @param cards - 要移除的牌陣列。
   * @returns 被移除的牌陣列。
   */
  removeCards(cards: Card[]): Card[] {
    return cards.map((card) => this.removeCard(card))
  }

  /**
   * 取得手牌中的牌數。
   * @returns 手牌中的牌數。
   */
  size(): number {
    return this.cards.length
  }

  /**
   * 檢查手牌是否為空。
   * @returns 手牌為空時回傳 true。
   */
  isEmpty(): boolean {
    return this.cards.length === 0
  }

  /**
   * 取得依點數與花色排序後的手牌副本。
   * @returns 排序後的手牌陣列。
   */
  getSortedCards(): Card[] {
    return [...this.cards].sort((a, b) => {
      const rankDiff = a.getRank() - b.getRank()
      if (rankDiff !== 0) {
        return rankDiff
      }
      return a.getSuit() - b.getSuit()
    })
  }

  /**
   * 將手牌就地排序。
   */
  sortCards() {
    this.cards = this.getSortedCards()
  }
}
