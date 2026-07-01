import type { Card } from '../../Card/Card'
import { type ChooseCardsContext, Player } from '../Player'

export class AI extends Player {
  /**
   * 自動從可出的牌型中隨機選擇一組，或選擇 PASS。
   * @param context - 選牌上下文，使用其中的 playablePatterns 與 canPass。
   * @returns 選擇的牌，null 表示 PASS。
   * @throws 新回合中無可出的牌型時拋出錯誤。
   */
  async chooseCards({
    playablePatterns,
    canPass,
  }: ChooseCardsContext): Promise<Card[] | null> {
    if (playablePatterns.length === 0) {
      if (!canPass) {
        throw new Error('AI cannot pass in a new round')
      }
      // 新回合中無可出的牌型時，選擇 PASS
      return null
    }

    // 隨機選擇一組可出的牌型
    const randomIndex = Math.floor(Math.random() * playablePatterns.length)
    return playablePatterns[randomIndex].getCards()
  }
}
