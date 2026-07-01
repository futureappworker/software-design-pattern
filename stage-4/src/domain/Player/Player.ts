import { shouldBeAlphanumericOrChinese } from '../../utils/shouldBeAlphanumericOrChinese'
import type { Card } from '../Card/Card'
import type { CardPattern } from '../CardPattern/CardPattern'
import { Hand } from './Hand/Hand'

export type ChooseCardsContext = {
  sortedHand: Card[]
  playablePatterns: CardPattern[]
  canPass: boolean
}

type PlayerProps = {
  name: string
}

export abstract class Player {
  private name!: string
  private hand: Hand

  /**
   * 建立一位玩家。
   * @param props - 玩家名稱。
   */
  constructor({ name }: PlayerProps) {
    this.hand = new Hand({})
    this.setName(name)
  }

  /**
   * 取得玩家名稱。
   * @returns 玩家名稱。
   */
  getName() {
    return this.name
  }

  /**
   * 設定玩家名稱。
   * @param name - 玩家名稱，須為字母、數字或中文字組成。
   */
  private setName(name: string) {
    // 名字為字母或數字的組成 （A-Z+a-z+0-9+中文字，有區分大小寫）
    shouldBeAlphanumericOrChinese({ name: 'Name', str: name })

    this.name = name
  }

  /**
   * 取得玩家的手牌。
   * @returns 玩家的手牌。
   */
  getHand() {
    return this.hand
  }

  /**
   * 接收一張牌加入手牌。
   * @param card - 要接收的牌。
   */
  take(card: Card) {
    this.hand.addCard(card)
  }

  /**
   * 選擇要出的牌或 PASS。
   * @param context - 選牌所需的上下文，包含手牌、可出牌型與是否可 PASS。
   * @returns 選擇的牌，null 表示 PASS。
   */
  abstract chooseCards(context: ChooseCardsContext): Promise<Card[] | null>
}
