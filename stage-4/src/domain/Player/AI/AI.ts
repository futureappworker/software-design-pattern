import { Rank } from '../../Card/Rank'
import { Suit } from '../../Card/Suit'
import type { CardPattern } from '../../CardPattern/CardPattern'
import type { GameLogger } from '../../GameLogger/GameLogger'
import type { RuleEngine } from '../../RuleEngine/RuleEngine'
import { type ChooseResult, ChooseResultType, Player } from '../Player'

function includesClubThree(pattern: CardPattern): boolean {
  return pattern
    .getCards()
    .some(
      (card) => card.getSuit() === Suit.Club && card.getRank() === Rank.Three,
    )
}

export class AI extends Player {
  /**
   * 自動從可出的牌型中隨機選擇一組，或選擇 PASS。
   * @param topPlay - 目前檯面上的頂牌，新回合時為 null。
   * @param topPlayerIndex - 出頂牌的玩家索引，新回合時為 -1。
   * @param ruleEngine - 規則引擎，用於找出可出的牌型。
   * @param _gameLogger - 遊戲日誌（AI 不使用）。
   * @returns 玩家的選擇結果。
   * @throws 新回合中無可出的牌型時拋出錯誤。
   */
  async chooseCards(
    topPlay: CardPattern | null,
    topPlayerIndex: number,
    ruleEngine: RuleEngine,
    _gameLogger: GameLogger,
  ): Promise<ChooseResult> {
    if (!topPlay) {
      let playablePatterns = ruleEngine.findPlayablePatterns(
        this.getHand().getCards(),
      )

      // 整局第一手，必須含梅花 3
      if (topPlayerIndex === -1) {
        playablePatterns = playablePatterns.filter(includesClubThree)
      }

      if (playablePatterns.length === 0) {
        throw new Error('AI cannot pass in a new round')
      }
      const randomIndex = Math.floor(Math.random() * playablePatterns.length)
      return {
        type: ChooseResultType.Play,
        cardPattern: playablePatterns[randomIndex],
      }
    }

    const playablePatterns = ruleEngine.findPlayablePatterns(
      this.getHand().getCards(),
      topPlay,
    )
    if (playablePatterns.length === 0) {
      return { type: ChooseResultType.Pass }
    }
    const randomIndex = Math.floor(Math.random() * playablePatterns.length)
    return {
      type: ChooseResultType.Play,
      cardPattern: playablePatterns[randomIndex],
    }
  }
}
