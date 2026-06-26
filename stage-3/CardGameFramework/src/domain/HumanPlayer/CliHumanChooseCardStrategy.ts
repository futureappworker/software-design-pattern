import { stdin as input, stdout as output } from 'node:process'
import { createInterface } from 'node:readline/promises'
import type { Card } from '../Card/Card'
import type { Game } from '../Game/Game'
import type { HumanChooseCardStrategy } from './HumanChooseCardStrategy'

export class CliHumanChooseCardStrategy implements HumanChooseCardStrategy {
  async chooseCard(game: Game): Promise<Card[]> {
    const rl = createInterface({ input, output })
    const player = game.getCurrentPlayer()

    while (true) {
      const hand = player.getHand()

      if (hand.length === 0) {
        rl.close()
        throw new Error('Hand is empty')
      }

      hand.forEach((card, index) => {
        console.log(`(${index + 1}) ${card}`)
      })

      const answer = await rl.question(
        `${player.getName()} 請選擇要出的手牌 (1~${hand.length}): `,
      )

      const selectedIndex = Number(answer.trim()) - 1
      const currentHand = player.getHand()

      if (selectedIndex >= 0 && selectedIndex < currentHand.length) {
        rl.close()
        return [player.removeCardFromHandAt(selectedIndex)]
      }

      console.log(`只能輸入範圍 1~${currentHand.length} 的數字, 請再輸入一次`)
    }
  }
}
