import type { Game } from '../../CardGameFramework/src/index'
import {
  CardGameFramework,
  CliHumanChooseCardStrategy,
  RandomAIChooseCardStrategy,
} from '../../CardGameFramework/src/index'

import type { PlayingCard } from './domain/PlayingCard/PlayingCard'
import { PlayingCardDeck } from './domain/PlayingCardDeck/PlayingCardDeck'
import { compareCards } from './utils/compareCards'

// 每回合的流程
const playRound = async (game: Game) => {
  const tableArea = game.getTableArea()
  const players = game.getPlayers()

  // P1~P4 輪流 (Takes a turn) 出一張牌（此步驟彼此皆無法知曉彼此出的牌）。
  for (let i = 0; i < players.length; i++) {
    const player = players[i]
    if (player.getHand().length === 0) {
      continue
    }

    game.setCurrentPlayerIndex(i)
    const card = (await player.chooseCard()) as PlayingCard
    tableArea.addCardToPlayerArea(player.getId(), card)
  }

  const plays = players.flatMap((player) => {
    const card = tableArea.getPlayerArea(player.getId()).at(-1) as
      | PlayingCard
      | undefined
    return card ? [{ player, card }] : []
  })

  // 顯示 P1~P4 各出的牌的內容。
  plays.forEach(({ player, card }) => {
    console.log(`${player.getName()} 出了 ${card}`)
  })

  // 如果沒有玩家出牌，則直接返回
  // 防禦性寫法
  if (plays.length === 0) {
    return
  }

  // 將 P1~P4 出的牌進行比大小決勝負
  const winningPlay = plays.reduce((best, current) =>
    compareCards(current.card, best.card) > 0 ? current : best,
  )

  // 將最勝者的分數(Point)加一。
  winningPlay.player.setPoint(winningPlay.player.getPoint() + 1)

  console.log(`本回合勝者：${winningPlay.player.getName()}`)

  game.getDiscardPile().addCards(tableArea.drainPlayerAreas())
}

const showGameWinner = (game: Game) => {
  // 取得最多分數的玩家為勝者
  const winner = game
    .getPlayers()
    .reduce((best, current) =>
      current.getPoint() > best.getPoint() ? current : best,
    )

  // 將勝者的名稱顯示出來
  console.log(`遊戲結束，勝者是 ${winner.getName()}`)
}

const cardGameFramework = new CardGameFramework({
  deck: new PlayingCardDeck({}),
  initialHandSize: 13,
  aiChooseCardStrategy: new RandomAIChooseCardStrategy(),
  humanChooseCardStrategy: new CliHumanChooseCardStrategy(),
  winCondition: (game) => {
    // 所有 player 皆已出完全全部的手牌
    return game.getPlayers().every((player) => player.getHand().length === 0)
  },
  turnListener: async (game) => {
    console.log('--------------------------------')
    await playRound(game)
    console.log('--------------------------------')
  },
  afterGameHook: showGameWinner,
})

await cardGameFramework.start()
