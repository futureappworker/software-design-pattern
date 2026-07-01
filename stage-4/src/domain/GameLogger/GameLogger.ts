import type { Card } from '../Card/Card'
import { rankSymbols } from '../Card/Rank'
import { suitSymbols } from '../Card/Suit'
import type { CardPattern } from '../CardPattern/CardPattern'
import { cardPatternTypeSymbols } from '../CardPattern/CardPatternType'

export class GameLogger {
  /**
   * 輸出新回合開始的訊息。
   */
  logRoundStart() {
    // 輸出單行：
    // 新的回合開始了。
    console.log('新的回合開始了。')
  }

  /**
   * 以索引對齊格式輸出手牌。
   * @param sortedCards - 已排序的手牌。
   */
  logHand(sortedCards: Card[]) {
    const cardLabels = sortedCards.map((card) => {
      const suit = suitSymbols[card.getSuit()]
      const rank = rankSymbols[card.getRank()]
      return `${suit}[${rank}]`
    })

    const indexLine = cardLabels
      .map((label, index) => String(index).padEnd(label.length))
      .join(' ')
      .trimEnd()

    console.log(indexLine)
    console.log(cardLabels.join(' '))
  }

  /**
   * 輸出玩家回合開始訊息及手牌。
   * @param playerName - 玩家名稱。
   * @param sortedCards - 已排序的手牌。
   */
  logPlayerTurnStart(playerName: string, sortedCards: Card[]) {
    // 首先輸出：
    // 輪到<玩家的名字>了

    console.log(`輪到${playerName}了`)

    // 然後再使用漂亮的格式輸出玩家的手牌，如下：
    // 0    1    2    3    4    5    6     7 ...
    // S[3] H[4] S[4] H[6] H[7] C[8] C[10] S[K] ...
    // --------------------------------
    // 在第二行中，手牌由小到大依序由左至右排序
    // 並且每一張牌之間都隔了一個空白，
    // 然後在第一行中，每一個手牌索引都置左對齊了每一張手牌的花色。

    this.logHand(sortedCards)
  }

  /**
   * 輸出玩家出牌訊息。
   * @param playerName - 玩家名稱。
   * @param cardPattern - 打出的牌型。
   */
  logPlay(playerName: string, cardPattern: CardPattern) {
    // 玩家 <玩家的名字> 打出了 <牌型名稱> <花色>[<數字>] <花色>[<數字>] <花色>[<數字>] ...

    // <牌型名稱> 為該牌型的中文名稱，可能為單張、對子、順子或是葫蘆。
    // <牌型名稱> 隨後接著的是牌型中包含的牌，以小到大依序由左至右排序。

    const cardLabels = cardPattern.getCards().map((card) => {
      const suit = suitSymbols[card.getSuit()]
      const rank = rankSymbols[card.getRank()]
      return `${suit}[${rank}]`
    })

    console.log(
      `玩家 ${playerName} 打出了 ${cardPatternTypeSymbols[cardPattern.getType()]} ${cardLabels.join(' ')}`,
    )
  }

  /**
   * 輸出不合法牌型的錯誤訊息。
   */
  logInvalidPlay() {
    console.log('此牌型不合法，請再嘗試一次。')
  }

  /**
   * 輸出玩家 PASS 訊息。
   * @param playerName - 玩家名稱。
   */
  logPlayerPass(playerName: string) {
    console.log(`玩家 ${playerName} PASS.`)
  }

  /**
   * 輸出在新回合中 PASS 不合法的錯誤訊息。
   */
  logInvalidPass() {
    console.log('你不能在新的回合中喊 PASS')
  }

  /**
   * 輸出遊戲結束及勝利者訊息。
   * @param winnerName - 勝利者名稱。
   */
  logGameOver(winnerName: string) {
    console.log(`遊戲結束，遊戲的勝利者為 ${winnerName}`)
  }
}
