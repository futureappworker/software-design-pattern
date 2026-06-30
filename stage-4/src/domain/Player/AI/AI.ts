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
