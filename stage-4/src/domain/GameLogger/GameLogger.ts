import type { Card } from '../Card/Card'
import { rankSymbols } from '../Card/Rank'
import { suitSymbols } from '../Card/Suit'

export class GameLogger {
  logRoundStart() {
    // 輸出單行：
    // 新的回合開始了。
    console.log('新的回合開始了。')
  }

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

    const cardLabels = sortedCards.map((card) => {
      const suit = suitSymbols[card.getSuit()]
      const rank = rankSymbols[card.getRank()]
      return `${suit}[${rank}]`
    })

    const indexLine = cardLabels
      .map((label, index) => String(index).padEnd(label.length))
      .join(' ')

    console.log(indexLine)
    console.log(cardLabels.join(' '))
  }

  logInvalidPlay() {
    console.log('此牌型不合法，請再嘗試一次。')
  }

  logPlayerPass(playerName: string) {
    console.log(`玩家 ${playerName} PASS.`)
  }

  logInvalidPass() {
    console.log('你不能在新的回合中喊 PASS')
  }

  logGameOver(winnerName: string) {
    console.log(`遊戲結束，遊戲的勝利者為 ${winnerName}`)
  }
}
