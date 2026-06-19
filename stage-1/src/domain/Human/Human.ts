import { stdin as input, stdout as output } from 'node:process'
import {
  createInterface,
  type Interface as ReadlineInterface,
} from 'node:readline/promises'
import type { Card } from '../Card/Card'
import { rankLabels } from '../Card/Rank'
import { suitLabels } from '../Card/Suit'
import { Player } from '../Player/Player'

let readlineInterface: ReadlineInterface | null = null

function getReadline() {
  if (!readlineInterface) {
    readlineInterface = createInterface({ input, output })
  }
  return readlineInterface
}

export function resetReadline() {
  readlineInterface = null
}

export class Human extends Player {
  /**
   * 透過 CLI 詢問使用者是否要交換手牌
   * 輸入 1 表示要交換，2 表示不交換；無效輸入會重新詢問
   * @returns true 表示要交換，false 表示不交換
   */
  async decideExchange(): Promise<boolean> {
    const rl = getReadline()

    while (true) {
      const answer = await rl.question(
        `${this.getName()} 是否要交換手牌？(1) 是 (2) 否: `,
      )

      switch (Number(answer.trim())) {
        case 1:
          return true
        case 2:
          return false
        default:
          console.log('只能輸入範圍 1~2 的數字, 請再輸入一次')
      }
    }
  }

  /**
   * 透過 CLI 詢問使用者要從手牌中拿出哪一張卡
   * 輸入手牌編號（1 起始）選擇要出的卡，並從手牌中移除；無效輸入會重新詢問
   * @returns 要拿出的卡
   * @throws 如果手牌為空
   */
  async decideShowCardFromHand(): Promise<Card> {
    const rl = getReadline()

    while (true) {
      const hand = this.getHand()

      if (hand.length === 0) {
        throw new Error('Hand is empty')
      }

      hand.forEach((card, index) => {
        console.log(
          `(${index + 1}) ${suitLabels[card.getSuit()]} ${rankLabels[card.getRank()]}`,
        )
      })

      const answer = await rl.question(
        `${this.getName()} 請選擇要出的手牌 (1~${hand.length}): `,
      )

      const selectedIndex = Number(answer.trim()) - 1
      const currentHand = this.getHand()

      if (
        selectedIndex >= 0 &&
        selectedIndex < currentHand.length &&
        currentHand.length > 0
      ) {
        return this.removeCardFromHandAt(selectedIndex)
      }

      console.log(
        `只能輸入範圍 1~${currentHand.length || hand.length} 的數字, 請再輸入一次`,
      )
    }
  }

  /**
   * 透過 CLI 詢問使用者要與哪個玩家交換
   * 輸入玩家編號（1 起始）選擇交換對象；無效輸入會重新詢問
   * @param players 可選擇的交換對象
   * @returns 選擇的玩家
   * @throws 如果候選玩家為空
   */
  async chooseExchangeTarget(players: Player[]): Promise<Player> {
    if (players.length === 0) {
      throw new Error('No exchange target available')
    }

    const rl = getReadline()

    while (true) {
      players.forEach((player, index) => {
        console.log(`(${index + 1}) ${player.getName()}`)
      })

      const answer = await rl.question(
        `${this.getName()} 請選擇要交換的玩家 (1~${players.length}): `,
      )

      const selectedIndex = Number(answer.trim()) - 1

      if (selectedIndex >= 0 && selectedIndex < players.length) {
        return players[selectedIndex]
      }

      console.log(`只能輸入範圍 1~${players.length} 的數字, 請再輸入一次`)
    }
  }
}
