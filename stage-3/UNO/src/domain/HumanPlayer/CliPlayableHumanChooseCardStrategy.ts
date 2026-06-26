import { stdin as input, stdout as output } from 'node:process'
import { createInterface } from 'node:readline/promises'
import type {
  Game,
  HumanChooseCardStrategy,
} from '../../../../CardGameFramework/src/index'
import type { UNOCard } from '../UNOCard/UNOCard'

export class CliPlayableHumanChooseCardStrategy
  implements HumanChooseCardStrategy
{
  // 玩家出的牌必須與檯面上最新的牌的顏色一樣，或是數字一樣
  // 然後 cli 詢問使用者要出哪一張牌
  // 若沒有，則不出牌
  async chooseCard(game: Game): Promise<UNOCard[]> {
    const player = game.getCurrentPlayer()
    const hand = player.getHand()

    if (hand.length === 0) {
      throw new Error('Hand is empty')
    }

    // 取得檯面最新牌
    const centerPile = game.getTableArea().getCenterPile()
    // 取得檯面最新牌
    const topCard = centerPile.at(-1) as UNOCard | undefined

    if (!topCard) {
      throw new Error('No card on table')
    }

    // 找出可以出牌的牌
    const playableIndices = hand.reduce<number[]>((indices, card, index) => {
      const unoCard = card as UNOCard
      if (
        unoCard.getColor() === topCard.getColor() ||
        unoCard.getNum() === topCard.getNum()
      ) {
        indices.push(index)
      }
      return indices
    }, [])

    // 如果沒有可以出牌的牌，則不出牌
    if (playableIndices.length === 0) {
      return []
    }

    const rl = createInterface({ input, output })

    while (true) {
      console.log('檯面上最新的牌:')
      console.log(`- ${topCard}`)

      console.log(`${player.getName()} 的手牌:`)
      hand.forEach((card) => {
        console.log(`- ${card}`)
      })

      playableIndices.forEach((handIndex, optionIndex) => {
        console.log(`(${optionIndex + 1}) ${hand[handIndex]}`)
      })

      const answer = await rl.question(
        `${player.getName()} 請選擇要出的手牌 (1~${playableIndices.length}): `,
      )

      const selectedOption = Number(answer.trim()) - 1

      // 如果選擇的選項在可出牌的牌的範圍內，則出牌
      if (selectedOption >= 0 && selectedOption < playableIndices.length) {
        rl.close()
        const handIndex = playableIndices[selectedOption]
        const card = player.removeCardFromHandAt(handIndex) as UNOCard
        return [card]
      }

      console.log(
        `只能輸入範圍 1~${playableIndices.length} 的數字, 請再輸入一次`,
      )
    }
  }
}
