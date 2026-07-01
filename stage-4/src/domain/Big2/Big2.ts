import { getReadline } from '../../utils/readline'
import { shouldBeAlphanumericOrChinese } from '../../utils/shouldBeAlphanumericOrChinese'
import { shouldBeWithinRange } from '../../utils/shouldBeWithinRange'
import { Rank, rankSymbols } from '../Card/Rank'
import { Suit, suitSymbols } from '../Card/Suit'
import { Deck } from '../Deck/Deck'
import { GameLogger } from '../GameLogger/GameLogger'
import { AI } from '../Player/AI/AI'
import { Human } from '../Player/Human/Human'
import { ChooseResultType, type Player } from '../Player/Player'
import { Round } from '../Round/Round'
import type { CompareCardPatternHandler } from '../RuleEngine/CompareCardPatternHandler/CompareCardPatternHandler'
import type { FindPlayablePatternsHandler } from '../RuleEngine/FindPlayablePatternsHandler/FindPlayablePatternsHandler'
import type { ParseCardPatternHandler } from '../RuleEngine/ParseCardPatternHandler/ParseCardPatternHandler'
import { RuleEngine } from '../RuleEngine/RuleEngine'

type Big2Props = {
  isTestMode?: boolean
  parseCardPatternHandler: ParseCardPatternHandler
  compareCardPatternHandler: CompareCardPatternHandler
  findPlayablePatternsHandler: FindPlayablePatternsHandler
  deck?: Deck
  players?: Player[]
  currentPlayerIndex?: number
}

export class Big2 {
  private isTestMode: boolean = false
  private deck!: Deck
  private round: Round
  private ruleEngine: RuleEngine
  private gameLogger: GameLogger
  private players: Player[] = []
  private currentPlayerIndex: number = 0

  constructor({
    isTestMode = false,
    parseCardPatternHandler,
    compareCardPatternHandler,
    findPlayablePatternsHandler,
    deck,
    players = [],
    currentPlayerIndex = 0,
  }: Big2Props) {
    this.isTestMode = isTestMode
    this.setDeck(deck)
    this.round = new Round({})
    this.ruleEngine = new RuleEngine({
      parseCardPatternHandler,
      compareCardPatternHandler,
      findPlayablePatternsHandler,
    })
    this.gameLogger = new GameLogger()
    this.setPlayers(players)
    if (players.length !== 0) {
      this.setCurrentPlayerIndex(currentPlayerIndex)
    }
  }

  getDeck() {
    return this.deck
  }

  setDeck(deck?: Deck) {
    if (deck) {
      // deck 的 cards 長度必需 52
      shouldBeWithinRange({
        name: 'deck cards length',
        num: deck.getCards().length,
        inclusiveMin: 52,
        inclusiveMax: 52,
      })
      this.deck = deck
    } else {
      this.deck = new Deck({})
      this.deck.initialize()
    }
  }

  getRound() {
    return this.round
  }

  getRuleEngine() {
    return this.ruleEngine
  }

  getGameLogger() {
    return this.gameLogger
  }

  getPlayers() {
    return [...this.players]
  }

  setPlayers(players: Player[]) {
    shouldBeWithinRange({
      name: 'players',
      num: players.length,
      inclusiveMin: 0,
      inclusiveMax: 4,
    })

    this.players = [...players]
  }

  addPlayer(player: Player) {
    const players = this.getPlayers()
    shouldBeWithinRange({
      name: 'players',
      num: players.length + 1,
      inclusiveMin: 0,
      inclusiveMax: 4,
    })

    this.players.push(player)
  }

  getCurrentPlayerIndex() {
    return this.currentPlayerIndex
  }

  setCurrentPlayerIndex(currentPlayerIndex: number) {
    shouldBeWithinRange({
      name: 'currentPlayerIndex',
      num: currentPlayerIndex,
      inclusiveMin: 0,
      inclusiveMax: this.players.length - 1,
    })

    this.currentPlayerIndex = currentPlayerIndex
  }

  getCurrentPlayer(): Player {
    return this.players[this.currentPlayerIndex]
  }

  async start() {
    const deck = this.getDeck()
    const gameLogger = this.getGameLogger()
    const round = this.getRound()

    if (deck.isEmpty() || deck.size() !== 52) {
      deck.initialize()
    }

    await this.setupPlayers()

    if (!this.isTestMode) {
      // 洗牌
      deck.shuffle()
    }

    // 發牌
    this.dealCards()

    // 找出擁有 梅花3 的玩家首先出牌
    const playerIndex = this.findPlayerIndexOfCard(Suit.Club, Rank.Three)
    this.setCurrentPlayerIndex(playerIndex)

    while (!this.hasWinner()) {
      gameLogger.logRoundStart()

      round.resetConsecutivePassCount()

      if (round.getTopPlayerIndex() !== -1) {
        this.setCurrentPlayerIndex(round.getTopPlayerIndex())
      }

      while (round.getConsecutivePassCount() !== 3) {
        await this.play()

        if (this.hasWinner()) {
          break
        }

        this.advanceToNextPlayer()
      }

      if (this.hasWinner()) {
        break
      }

      round.resetTopPlay()
    }

    const winner = this.getWinner()
    gameLogger.logGameOver(winner.getName())
  }

  async setupPlayers() {
    // 輸入每個玩家的名稱 (Name)
    for (let i = this.players.length; i < 4; i++) {
      const isHuman = await this.promptPlayerType(`P${i + 1}`)
      const name = await this.promptPlayerName(`P${i + 1}`)
      const player = isHuman ? new Human({ name }) : new AI({ name })
      this.addPlayer(player)
    }
  }

  dealCards() {
    const deck = this.getDeck()
    // 將 deck 的牌輪流發給四位玩家直到牌堆空 (Empty) 了為止
    let playerIndex = 0
    while (!deck.isEmpty()) {
      const card = deck.draw()
      this.players[playerIndex].take(card)
      playerIndex = (playerIndex + 1) % this.players.length
    }
  }

  private async promptPlayerName(label: string): Promise<string> {
    // cli 尋問玩家的名稱 (Name)
    const rl = getReadline()

    while (true) {
      const answer = await rl.question(`${label} 請輸入玩家名稱: `)

      // 名字為字母或數字的組成 （A-Z+a-z+0-9+中文字，有區分大小寫）
      try {
        shouldBeAlphanumericOrChinese({ name: 'Name', str: answer })
        return answer
      } catch {
        console.log('名稱必須由字母、數字或中文字組成，請再輸入一次')
      }
    }
  }

  private async promptPlayerType(label: string): Promise<boolean> {
    const rl = getReadline()
    const answer = await rl.question(`${label} 玩家類型？(1) AI (2) Human: `)

    switch (Number(answer)) {
      case 1:
        return false
      case 2:
        return true
      default:
        console.log('只能輸入範圍 1~2 的數字, 請再輸入一次')
        return this.promptPlayerType(label)
    }
  }

  advanceToNextPlayer() {
    // 遊戲中有四位玩家
    // 使用數字 {0,1,2,3} 來索引這四位玩家假設目前輪到了玩家 i
    // 則「下一輪的玩家」為索引值 (i+1)%4 的玩家
    const nextIndex = (this.currentPlayerIndex + 1) % this.players.length
    this.setCurrentPlayerIndex(nextIndex)
  }

  async play() {
    const player = this.getCurrentPlayer()
    const gameLogger = this.getGameLogger()
    const round = this.getRound()
    const playerName = player.getName()
    const hand = player.getHand()
    const topPlay = this.getRound().getTopPlay()
    const topPlayerIndex = this.getRound().getTopPlayerIndex()
    const ruleEngine = this.getRuleEngine()

    const sortedCards = hand.getSortedCards()

    gameLogger.logPlayerTurnStart(playerName, sortedCards)

    const chooseResult = await player.chooseCards(
      topPlay,
      topPlayerIndex,
      ruleEngine,
      gameLogger,
    )

    if (chooseResult.type === ChooseResultType.Pass) {
      gameLogger.logPlayerPass(playerName)
      round.recordPass()
    }

    if (chooseResult.type === ChooseResultType.Play) {
      const cardPattern = chooseResult.cardPattern
      if (cardPattern == null) {
        throw new Error('Card pattern is null')
      }

      gameLogger.logPlay(playerName, cardPattern)

      hand.removeCards(cardPattern.getCards())

      round.setTopPlay(cardPattern)
      round.setTopPlayerIndex(this.getCurrentPlayerIndex())
      round.resetConsecutivePassCount()
    }
  }

  findPlayerIndexOfCard(suit: Suit, rank: Rank): number {
    const playerIndex = this.players.findIndex((player) =>
      player
        .getHand()
        .getCards()
        .some((card) => card.getSuit() === suit && card.getRank() === rank),
    )

    if (playerIndex === -1) {
      throw new Error(
        `Player with card ${suitSymbols[suit]}[${rankSymbols[rank]}] not found`,
      )
    }

    return playerIndex
  }

  hasWinner(): boolean {
    // 任一玩家手牌為 0
    return this.players.some((player) => player.getHand().isEmpty())
  }

  getWinner(): Player {
    // 玩家手牌為 0, 回傳該玩家
    const winner = this.players.find((player) => player.getHand().isEmpty())
    if (winner === undefined) {
      throw new Error('Winner not found')
    }
    return winner
  }

  getWinnerName(): string {
    return this.getWinner().getName()
  }
}
