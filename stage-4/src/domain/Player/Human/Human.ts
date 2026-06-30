import { stdin as input, stdout as output } from 'node:process'
import {
  createInterface,
  type Interface as ReadlineInterface,
} from 'node:readline/promises'
import { Rank } from '../../Card/Rank'
import { Suit } from '../../Card/Suit'
import type { CardPattern } from '../../CardPattern/CardPattern'
import type { GameLogger } from '../../GameLogger/GameLogger'
import type { RuleEngine } from '../../RuleEngine/RuleEngine'
import { type ChooseResult, ChooseResultType, Player } from '../Player'

let readlineInterface: ReadlineInterface | null = null

function getReadline() {
  if (!readlineInterface) {
    readlineInterface = createInterface({ input, output })
  }
  return readlineInterface
}

export class Human extends Player {
  async chooseCards(
    topPlay: CardPattern | null,
    topPlayerIndex: number,
    ruleEngine: RuleEngine,
    gameLogger: GameLogger,
  ): Promise<ChooseResult> {
    // 取得手牌
    const hand = this.getHand()
    const cards = hand.getCards()

    // cli 讀取玩家輸入
    // 一連串以空白隔開的非負整數，表達玩家欲從手牌中出牌的索引值。
    // 舉例來說：如果玩家有三張手牌：♠A、♦J和♥A，則他可以透過索引值 0 2 來打出 ♠A ♥A 對子

    const rl = getReadline()
    const answer = (await rl.question('')).trim()

    // -1：表達此玩家喊 PASS 了
    if (answer === '-1') {
      if (topPlay === null) {
        gameLogger.logInvalidPass()
        return this.chooseCards(topPlay, topPlayerIndex, ruleEngine, gameLogger)
      } else {
        return { type: ChooseResultType.Pass }
      }
    }

    const indices = answer.split(' ').map(Number)
    const selectedCards = indices.map((index) => cards[index])

    // 如果 topPlay 存在，則檢查選的 cards 是否合法
    if (topPlay) {
      // 如果選的 cards 不合法，則重新選擇
      if (!ruleEngine.isPlayable(selectedCards, topPlay)) {
        gameLogger.logInvalidPlay()
        return this.chooseCards(topPlay, topPlayerIndex, ruleEngine, gameLogger)
      }
    }

    // 如果 topPlay 不存在，則檢查選的 cards 是否合法
    if (!topPlay) {
      try {
        ruleEngine.parseCardPattern(selectedCards)
      } catch {
        gameLogger.logInvalidPlay()
        return this.chooseCards(topPlay, topPlayerIndex, ruleEngine, gameLogger)
      }
    }

    // 整局第一手，必須含梅花 3
    if (topPlay === null && topPlayerIndex === -1) {
      const hasClubThree = selectedCards.some(
        (card) => card.getSuit() === Suit.Club && card.getRank() === Rank.Three,
      )
      if (!hasClubThree) {
        gameLogger.logInvalidPlay()
        return this.chooseCards(topPlay, topPlayerIndex, ruleEngine, gameLogger)
      }
    }

    // 回傳選擇的 cardPattern
    return {
      type: ChooseResultType.Play,
      cardPattern: ruleEngine.parseCardPattern(selectedCards),
    }
  }
}
