import type {
  AIChooseCardStrategy,
  Game,
} from '../../../../CardGameFramework/src/index'
import type { UNOCard } from '../UNOCard/UNOCard'

export class RandomPlayableAIChooseCardStrategy
  implements AIChooseCardStrategy
{
  // 玩家出的牌必須與檯面上最新的牌的顏色一樣，或是數字一樣
  // 然後隨機做選擇
  // 若沒有，則不出牌
  chooseCard(game: Game): UNOCard[] {
    const hand = game.getCurrentPlayer().getHand()

    if (hand.length === 0) {
      throw new Error('Hand is empty')
    }

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

    // 隨機選擇一張可以出牌的牌
    const index =
      playableIndices[Math.floor(Math.random() * playableIndices.length)]

    // 從手牌中移除選擇的牌
    const card = game.getCurrentPlayer().removeCardFromHandAt(index) as UNOCard

    return [card]
  }
}
