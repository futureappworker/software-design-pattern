import { shouldBeAlphanumericOrChinese } from '../../utils/shouldBeAlphanumericOrChinese'
import type { Card } from '../Card/Card'
import type { CardPattern } from '../CardPattern/CardPattern'
import type { GameLogger } from '../GameLogger/GameLogger'
import type { RuleEngine } from '../RuleEngine/RuleEngine'
import { Hand } from './Hand/Hand'

export enum ChooseResultType {
  Play = 'Play',
  Pass = 'Pass',
}

export type ChooseResult = {
  type: ChooseResultType
  cardPattern?: CardPattern
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
   * @param topPlay - 目前檯面上的頂牌，新回合時為 null。
   * @param topPlayerIndex - 出頂牌的玩家索引，新回合時為 -1。
   * @param ruleEngine - 規則引擎，用於驗證與解析牌型。
   * @param gameLogger - 遊戲日誌，用於輸出提示訊息。
   * @returns 玩家的選擇結果。
   */
  abstract chooseCards(
    topPlay: CardPattern | null,
    topPlayerIndex: number,
    ruleEngine: RuleEngine,
    gameLogger: GameLogger,
  ): Promise<ChooseResult>
}
