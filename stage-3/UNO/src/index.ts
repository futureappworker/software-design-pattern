import type { Game, Player } from '../../CardGameFramework/src/index'
import { CardGameFramework } from '../../CardGameFramework/src/index'
import { RandomPlayableAIChooseCardStrategy } from './domain/AIPlayer/RandomPlayableAIChooseCardStrategy'
import { CliPlayableHumanChooseCardStrategy } from './domain/HumanPlayer/CliPlayableHumanChooseCardStrategy'

import type { UNOCard } from './domain/UNOCard/UNOCard'
import { UNODeck } from './domain/UNODeck/UNODeck'

// 從牌堆中翻出第一張牌到檯面上
const drawStartingCardToCenter = (game: Game) => {
  // 取得檯面
  const tableArea = game.getTableArea()
  // 從牌堆中翻出第一張牌
  const card = game.getDeck().drawCard()
  // 將牌加入檯面
  tableArea.addCardToCenterPile(card)
}

// 從牌堆中抽一張牌
// 如果此時牌堆空了，則會先把 棄牌堆 的所有牌都放到 牌堆 中，再進行洗牌
const drawCardForPlayer = (game: Game, player: Player): UNOCard => {
  const deck = game.getDeck()
  const tableArea = game.getTableArea()

  // 如果牌堆空了
  if (deck.getCards().length === 0) {
    // 先把 CenterPile 上除了最新的牌以外的牌放回牌堆中進行洗牌
    const centerPile = tableArea.getCenterPile()
    const lastCard = centerPile.at(-1)
    deck.addCards(centerPile.slice(0, -1))
    tableArea.setCenterPile(lastCard ? [lastCard] : [])
    // 洗牌
    game.getDeck().shuffle()
  }

  // 從牌堆中抽一張牌
  const drawnCard = player.drawCardFromDeck(deck)
  return drawnCard as UNOCard
}

// 每回合的流程
const playRound = async (game: Game) => {
  // 由 P1 開始，出牌順序為 P1 → P2 → P3 → P4 → P1 以此類推。
  const player = game.getCurrentPlayer()
  const tableArea = game.getTableArea()

  // 玩家出的牌必須與檯面上最新的牌的顏色一樣，或是數字一樣。出完的牌就會成為檯面上最新的牌。
  const cards = (await player.chooseCard()) as UNOCard[]
 
  if (cards.length > 0) {
    // 將牌加入檯面
    tableArea.addCardsToCenterPile(cards)
    // 顯示玩家出的牌
    console.log(`${player.getName()} 出了 ${cards[0]}`)
  } else {
    // 從牌堆中抽一張牌
    const drawnCard = drawCardForPlayer(game, player)
    console.log(`${player.getName()} 沒有可出的牌，抽了一張 ${drawnCard}`)
  }

  if (!game.isGameOver()) {
    // 將回合切換到下一位玩家 若已輪到最後一位玩家，則回到第一位
    game.moveToNextPlayer()
  }
}

const showGameWinner = (game: Game) => {
  // 最快出完手中牌的人為遊戲的贏家
  const winner = game
    .getPlayers()
    .find((player) => player.getHand().length === 0)

  // 將勝者的名稱顯示出來
  if (winner) {
    console.log(`遊戲結束，勝者是 ${winner.getName()}`)
  }
}

const cardGameFramework = new CardGameFramework({
  deck: new UNODeck({}),
  initialHandSize: 5,
  aiChooseCardStrategy: new RandomPlayableAIChooseCardStrategy(),
  humanChooseCardStrategy: new CliPlayableHumanChooseCardStrategy(),
  winCondition: (game) => {
    // 最快出完手中牌的人為遊戲的贏家
    const winner = game.getPlayers().reduce((best, current) => {
      return current.getHand().length < best.getHand().length ? current : best
    })
    return winner.getHand().length === 0
  },
  turnListener: async (game) => {
    console.log('--------------------------------')
    await playRound(game)
    console.log('--------------------------------')
  },
  gameStartHook: drawStartingCardToCenter,
  afterGameHook: showGameWinner,
})

await cardGameFramework.start()
