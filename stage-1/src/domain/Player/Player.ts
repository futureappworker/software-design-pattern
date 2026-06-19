import { shouldBeGreaterThanOrEqual } from '../../utils/shouldBeGreaterThanOrEqual'
import { shouldBeWithinRange } from '../../utils/shouldBeWithinRange'
import { shouldNotBeNull } from '../../utils/shouldNotBeNull'
import type { Card } from '../Card/Card'
import type { Deck } from '../Deck/Deck'

export type PlayerProps = {
  name: string
  hand: Card[]
  point: number
  hasUsedExchange: boolean
}

export const defaultProps = {
  name: '',
  point: 0,
  hasUsedExchange: false,
}

export abstract class Player {
  private name: string = defaultProps.name
  private hand: Card[] = []
  private point: number = defaultProps.point
  private hasUsedExchange: boolean = defaultProps.hasUsedExchange

  /**
   * 初始化玩家
   * @param name 玩家名稱（不能為空、不能有首尾空格）
   * @param hand 初始手牌（0~13 張卡）
   * @param point 初始點數（必須 >= 0）
   * @param hasUsedExchange 是否已使用過交換
   * @throws 如果名稱、手牌或點數驗證失敗
   */
  constructor({
    name,
    hand = [],
    point = defaultProps.point,
    hasUsedExchange = defaultProps.hasUsedExchange,
  }: PlayerProps) {
    this.setName(name)
    this.hand = [...hand]
    this.setPoint(point)
    this.hasUsedExchange = hasUsedExchange
  }

  /**
   * 獲取玩家名稱
   * @returns 玩家名稱
   */
  getName() {
    return this.name
  }

  /**
   * 獲取玩家手牌副本
   * @returns 手牌副本（修改不會影響原始手牌）
   */
  getHand() {
    return [...this.hand]
  }

  /**
   * 獲取玩家點數
   * @returns 玩家點數
   */
  getPoint() {
    return this.point
  }

  /**
   * 設置玩家名稱
   * @param name 新的名稱（不能為空、不能有首尾空格）
   * @throws 如果名稱為空或有首尾空格
   */
  setName(name: string) {
    shouldNotBeNull({
      name: 'Name',
      obj: name,
    })
    if (name.trim() === '') {
      throw new Error('Name must not be empty')
    }
    if (name !== name.trim()) {
      throw new Error('Name must not have leading or trailing spaces')
    }
    this.name = name
  }

  /**
   * 設置玩家手牌
   * @param cards 新的手牌（0~13 張卡）
   * @throws 如果手牌數量超過 13 張
   */
  setHand(cards: Card[]) {
    shouldBeWithinRange({
      name: 'Hand',
      num: cards.length,
      inclusiveMin: 0,
      inclusiveMax: 13,
    })
    this.hand = [...cards]
  }

  /**
   * 設置玩家的點數
   * @param point 要設置的點數（必須 >= 0）
   * @throws 如果點數小於 0
   */
  setPoint(point: number) {
    shouldBeGreaterThanOrEqual({
      name: 'Point',
      num: point,
      target: 0,
    })
    this.point = point
  }

  /**
   * 檢查玩家是否已使用過交換
   * @returns true 表示已使用過交換，false 表示未使用
   */
  isUsedExchange() {
    return this.hasUsedExchange
  }

  /**
   * 設置玩家是否已使用過交換
   * @param hasUsedExchange 是否已使用過交換
   */
  setUsedExchange(hasUsedExchange: boolean) {
    this.hasUsedExchange = hasUsedExchange
  }

  /**
   * 添加一張卡到手牌
   * @param card 要添加的卡
   * @throws 如果手牌已達 13 張上限
   */
  addCardToHand(card: Card) {
    shouldBeWithinRange({
      name: 'Hand',
      num: this.hand.length + 1,
      inclusiveMin: 0,
      inclusiveMax: 13,
    })
    this.hand.push(card)
  }

  /**
   * 從牌組中抽取一張卡並加入手牌
   * @param deck 要抽卡的牌組
   * @throws 如果手牌已達 13 張上限或牌組為空
   */
  drawCardFromDeck(deck: Deck) {
    const card = deck.drawCard()
    this.addCardToHand(card)
  }

  /**
   * 從手牌中移除指定位置的卡
   * @param index 手牌索引（0 起始）
   * @returns 被移除的卡
   * @throws 如果手牌為空或索引超出範圍
   */
  protected removeCardFromHandAt(index: number): Card {
    if (this.hand.length === 0) {
      throw new Error('Hand is empty')
    }
    shouldBeWithinRange({
      name: 'Hand index',
      num: index,
      inclusiveMin: 0,
      inclusiveMax: this.hand.length - 1,
    })
    const [card] = this.hand.splice(index, 1)
    return card
  }

  /**
   * 決定是否要交換手牌
   * 由子類別實作各自的決策方式
   * @returns true 表示要交換，false 表示不交換
   */
  abstract decideExchange(): Promise<boolean>

  /**
   * 決定要從手牌中拿出哪一張卡
   * 由子類別實作各自的決策方式，並從手牌中移除該卡
   * @returns 要拿出的卡
   * @throws 如果手牌為空
   */
  abstract decideShowCardFromHand(): Promise<Card>

  /**
   * 從候選玩家中選擇交換對象
   * 由子類別實作各自的決策方式
   * @param players 可選擇的交換對象
   * @returns 選擇的玩家
   * @throws 如果候選玩家為空
   */
  abstract chooseExchangeTarget(players: Player[]): Promise<Player>
}
