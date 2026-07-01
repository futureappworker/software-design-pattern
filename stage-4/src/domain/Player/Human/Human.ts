import { getReadline } from '../../../utils/readline'
import { Rank } from '../../Card/Rank'
import { Suit } from '../../Card/Suit'
import type { CardPattern } from '../../CardPattern/CardPattern'
import type { GameLogger } from '../../GameLogger/GameLogger'
import type { RuleEngine } from '../../RuleEngine/RuleEngine'
import { type ChooseResult, ChooseResultType, Player } from '../Player'

export class Human extends Player {
  async chooseCards(
    topPlay: CardPattern | null,
    topPlayerIndex: number,
    ruleEngine: RuleEngine,
    gameLogger: GameLogger,
  ): Promise<ChooseResult> {
    const hand = this.getHand()
    const sortedCards = hand.getSortedCards()

    const rl = getReadline()
    const answer = (await rl.question('')).trim()

    const retry = () => {
      // 先排序好，再輸出玩家的手牌
      gameLogger.logHand(hand.getSortedCards())
      return this.chooseCards(topPlay, topPlayerIndex, ruleEngine, gameLogger)
    }

    // 如果輸入 -1，則表示要 pass
    if (answer === '-1') {
      // 如果選擇 PASS, 而且 round.topPlay 是空的，則不合法
      if (topPlay === null) {
        gameLogger.logInvalidPass()
        return retry()
      }
      return { type: ChooseResultType.Pass }
    }

    const indices = answer
      .split(' ')
      .filter((part) => part.length > 0)
      .map(Number)

    const hasInvalidIndex =
      indices.length === 0 ||
      indices.some(
        (index) =>
          !Number.isInteger(index) || index < 0 || index >= sortedCards.length,
      )

    // 如果輸入的索引有無效的，則不合法
    if (hasInvalidIndex) {
      gameLogger.logInvalidPlay()
      return retry()
    }

    const selectedCards = indices.map((index) => sortedCards[index])

    // 如果有 topPlay，而且牌型不合法，則不合法
    if (topPlay) {
      if (!ruleEngine.isPlayable(selectedCards, topPlay)) {
        gameLogger.logInvalidPlay()
        return retry()
      }
    }

    // 沒有 topPlay，則檢查是否合法
    if (!topPlay) {
      try {
        ruleEngine.parseCardPattern(selectedCards)
      } catch {
        gameLogger.logInvalidPlay()
        return retry()
      }
    }

    // 整局第一手，必須含梅花 3
    if (topPlay === null && topPlayerIndex === -1) {
      const hasClubThree = selectedCards.some(
        (card) => card.getSuit() === Suit.Club && card.getRank() === Rank.Three,
      )
      // 如果沒有梅花 3，則不合法
      if (!hasClubThree) {
        gameLogger.logInvalidPlay()
        return retry()
      }
    }

    return {
      type: ChooseResultType.Play,
      cardPattern: ruleEngine.parseCardPattern(selectedCards),
    }
  }
}
