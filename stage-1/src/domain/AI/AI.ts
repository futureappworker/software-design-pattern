import type { Card } from '../Card/Card'
import { Player } from '../Player/Player'

export class AI extends Player {
  /**
   * 隨機決定是否要交換手牌
   * @returns true 表示要交換，false 表示不交換
   */
  async decideExchange(): Promise<boolean> {
    return Math.random() < 0.5
  }

  /**
   * 隨機從手牌中選擇一張卡並移除
   * @returns 要拿出的卡
   * @throws 如果手牌為空
   */
  async decideShowCardFromHand(): Promise<Card> {
    const hand = this.getHand()

    if (hand.length === 0) {
      throw new Error('Hand is empty')
    }

    const randomIndex = Math.floor(Math.random() * hand.length)

    return this.removeCardFromHandAt(randomIndex)
  }

  /**
   * 隨機從候選玩家中選擇交換對象
   * @param players 可選擇的交換對象
   * @returns 選擇的玩家
   * @throws 如果候選玩家為空
   */
  async chooseExchangeTarget(players: Player[]): Promise<Player> {
    if (players.length === 0) {
      throw new Error('No exchange target available')
    }

    const randomIndex = Math.floor(Math.random() * players.length)

    return players[randomIndex]
  }
}
