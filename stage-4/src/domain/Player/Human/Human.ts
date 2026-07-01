import { getReadline } from '../../../utils/readline'
import type { Card } from '../../Card/Card'
import { type ChooseCardsContext, Player } from '../Player'

export class Human extends Player {
  /**
   * 透過 CLI 輸入選擇要出的牌或 PASS。
   * @param context - 選牌上下文，使用其中的 sortedHand。
   * @returns 選擇的牌，null 表示 PASS。
   */
  async chooseCards({
    sortedHand,
  }: ChooseCardsContext): Promise<Card[] | null> {
    const rl = getReadline()
    const answer = (await rl.question('')).trim()

    // 如果輸入 -1，則表示要 pass
    if (answer === '-1') {
      return null
    }

    // 解析輸入的索引
    const indices = answer
      .split(' ')
      .filter((part) => part.length > 0)
      .map(Number)

    const hasInvalidIndex =
      indices.length === 0 ||
      indices.some(
        (index) =>
          !Number.isInteger(index) || index < 0 || index >= sortedHand.length,
      )

    // 如果有無效的索引，則不合法
    if (hasInvalidIndex) {
      return []
    }

    // 返回選擇的牌
    return indices.map((index) => sortedHand[index])
  }
}
