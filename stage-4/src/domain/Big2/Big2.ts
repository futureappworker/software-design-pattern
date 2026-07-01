import { getReadline } from '../../utils/readline'
import { shouldBeAlphanumericOrChinese } from '../../utils/shouldBeAlphanumericOrChinese'
import { shouldBeWithinRange } from '../../utils/shouldBeWithinRange'
import type { Card } from '../Card/Card'
import { Rank, rankSymbols } from '../Card/Rank'
import { Suit, suitSymbols } from '../Card/Suit'
import type { CardPattern } from '../CardPattern/CardPattern'
import { Deck } from '../Deck/Deck'
import { GameLogger } from '../GameLogger/GameLogger'
import { AI } from '../Player/AI/AI'
import { Human } from '../Player/Human/Human'
import type { ChooseCardsContext, Player } from '../Player/Player'
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

  /**
   * 建立大老二遊戲。
   * @param props - 遊戲設定，包含規則引擎處理器、牌堆、玩家等。
   */
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

  /**
   * 取得牌堆。
   * @returns 牌堆。
   */
  getDeck() {
    return this.deck
  }

  /**
   * 設定牌堆，未提供時建立並初始化 52 張牌。
   * @param deck - 可選的牌堆，須含 52 張牌。
   */
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

  /**
   * 取得回合狀態。
   * @returns 回合狀態。
   */
  getRound() {
    return this.round
  }

  /**
   * 取得規則引擎。
   * @returns 規則引擎。
   */
  getRuleEngine() {
    return this.ruleEngine
  }

  /**
   * 取得遊戲日誌。
   * @returns 遊戲日誌。
   */
  getGameLogger() {
    return this.gameLogger
  }

  /**
   * 取得所有玩家的副本。
   * @returns 玩家陣列。
   */
  getPlayers() {
    return [...this.players]
  }

  /**
   * 設定玩家列表。
   * @param players - 玩家陣列，最多 4 位。
   */
  setPlayers(players: Player[]) {
    shouldBeWithinRange({
      name: 'players',
      num: players.length,
      inclusiveMin: 0,
      inclusiveMax: 4,
    })

    this.players = [...players]
  }

  /**
   * 加入一位玩家。
   * @param player - 要加入的玩家。
   */
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

  /**
   * 取得目前出牌玩家的索引。
   * @returns 目前玩家的索引。
   */
  getCurrentPlayerIndex() {
    return this.currentPlayerIndex
  }

  /**
   * 設定目前出牌玩家的索引。
   * @param currentPlayerIndex - 玩家索引。
   */
  setCurrentPlayerIndex(currentPlayerIndex: number) {
    shouldBeWithinRange({
      name: 'currentPlayerIndex',
      num: currentPlayerIndex,
      inclusiveMin: 0,
      inclusiveMax: this.players.length - 1,
    })

    this.currentPlayerIndex = currentPlayerIndex
  }

  /**
   * 取得目前出牌的玩家。
   * @returns 目前出牌的玩家。
   */
  getCurrentPlayer(): Player {
    return this.players[this.currentPlayerIndex]
  }

  /**
   * 開始遊戲，包含發牌、回合循環與勝負判定。
   */
  async start() {
    const deck = this.getDeck()
    const gameLogger = this.getGameLogger()
    const round = this.getRound()

    // 如果牌堆為空或大小不為 52，則初始化牌堆
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

      round.resetTopPlay()
    }

    const winner = this.getWinner()
    gameLogger.logGameOver(winner.getName())
  }

  /**
   * 透過 CLI 設定玩家，補足至 4 位。
   */
  async setupPlayers() {
    // 補足至 4 位玩家
    for (let i = this.players.length; i < 4; i++) {
      // 詢問玩家類型
      const isHuman = await this.promptPlayerType(`P${i + 1}`)
      // 詢問玩家名稱
      const name = await this.promptPlayerName(`P${i + 1}`)
      // 建立玩家
      const player = isHuman ? new Human({ name }) : new AI({ name })
      this.addPlayer(player)
    }
  }

  /**
   * 將牌堆中的牌輪流發給所有玩家。
   */
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

  /**
   * 透過 CLI 詢問玩家名稱。
   * @param label - 玩家標籤（如 P1）。
   * @returns 玩家輸入的名稱。
   */
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

  /**
   * 透過 CLI 詢問玩家類型（AI 或 Human）。
   * @param label - 玩家標籤（如 P1）。
   * @returns 為 Human 時回傳 true，為 AI 時回傳 false。
   */
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

  /**
   * 將目前出牌玩家切換至下一位。
   */
  advanceToNextPlayer() {
    // 遊戲中有四位玩家
    // 使用數字 {0,1,2,3} 來索引這四位玩家假設目前輪到了玩家 i
    // 則「下一輪的玩家」為索引值 (i+1)%4 的玩家
    const nextIndex = (this.currentPlayerIndex + 1) % this.players.length
    this.setCurrentPlayerIndex(nextIndex)
  }

  /**
   * 執行目前玩家的出牌回合。
   */
  async play() {
    const player = this.getCurrentPlayer()
    const gameLogger = this.getGameLogger()
    const round = this.getRound()
    const ruleEngine = this.getRuleEngine()
    const playerName = player.getName()
    const hand = player.getHand()
    const topPlay = round.getTopPlay()
    const topPlayerIndex = round.getTopPlayerIndex()
    const sortedHand = hand.getSortedCards()

    gameLogger.logPlayerTurnStart(playerName, sortedHand)

    const context: ChooseCardsContext = {
      sortedHand,
      playablePatterns: this.getPlayablePatterns(
        hand.getCards(),
        topPlay,
        topPlayerIndex,
      ),
      canPass: topPlay !== null,
    }

    let cardPattern: CardPattern
    while (true) {
      const cards = await player.chooseCards(context)

      // 如果選擇了 PASS，則檢查是否可以 PASS
      if (cards === null) {
        if (!context.canPass) {
          gameLogger.logInvalidPass()
          gameLogger.logHand(sortedHand)
          continue
        }

        // 記錄 PASS
        gameLogger.logPlayerPass(playerName)
        round.recordPass()
        return
      }

      // 檢查所選的牌是否皆來自手牌
      if (!this.isValidCardSelection(cards, sortedHand)) {
        gameLogger.logInvalidPlay()
        gameLogger.logHand(sortedHand)
        continue
      }

      // 如果有 topPlay
      if (topPlay) {
        // 檢查是否可出牌
        if (!ruleEngine.isPlayable(cards, topPlay)) {
          gameLogger.logInvalidPlay()
          gameLogger.logHand(sortedHand)
          continue
        }
        cardPattern = ruleEngine.parseCardPattern(cards)
      } else {
        try {
          cardPattern = ruleEngine.parseCardPattern(cards)
        } catch {
          gameLogger.logInvalidPlay()
          gameLogger.logHand(sortedHand)
          continue
        }
      }

      // 整局第一手
      if (topPlay === null && topPlayerIndex === -1) {
        // 沒有梅花 3，則不合法
        if (!this.includesClubThree(cards)) {
          gameLogger.logInvalidPlay()
          gameLogger.logHand(sortedHand)
          continue
        }
      }

      break
    }

    gameLogger.logPlay(playerName, cardPattern)
    hand.removeCards(cardPattern.getCards())
    round.setTopPlay(cardPattern)
    round.setTopPlayerIndex(this.getCurrentPlayerIndex())
    round.resetConsecutivePassCount()
  }

  /**
   * 從手牌中找出目前可出的牌型。
   * @param handCards - 玩家的手牌。
   * @param topPlay - 目前檯面上的頂牌，新回合時為 null。
   * @param topPlayerIndex - 出頂牌的玩家索引，新回合時為 -1。
   * @returns 可出的牌型陣列。
   */
  private getPlayablePatterns(
    handCards: Card[],
    topPlay: CardPattern | null,
    topPlayerIndex: number,
  ): CardPattern[] {
    let patterns = this.ruleEngine.findPlayablePatterns(handCards, topPlay)

    // 整局第一手，必須含梅花 3
    if (topPlay === null && topPlayerIndex === -1) {
      patterns = patterns.filter((pattern) =>
        this.includesClubThree(pattern.getCards()),
      )
    }

    return patterns
  }

  /**
   * 檢查所選的牌是否皆來自手牌。
   * @param cards - 玩家選擇的牌。
   * @param sortedHand - 已排序的手牌。
   * @returns 合法時回傳 true。
   */
  private isValidCardSelection(cards: Card[], sortedHand: Card[]): boolean {
    if (cards.length === 0) {
      return false
    }

    const remainingHand = [...sortedHand]
    for (const card of cards) {
      const index = remainingHand.indexOf(card)
      if (index === -1) {
        return false
      }
      remainingHand.splice(index, 1)
    }

    return true
  }

  /**
   * 檢查所選的牌是否包含梅花 3。
   * @param cards - 要檢查的牌。
   * @returns 包含梅花 3 時回傳 true。
   */
  private includesClubThree(cards: Card[]): boolean {
    return cards.some(
      (card) => card.getSuit() === Suit.Club && card.getRank() === Rank.Three,
    )
  }

  /**
   * 找出持有指定牌的第一位玩家索引。
   * @param suit - 牌的花色。
   * @param rank - 牌的點數。
   * @returns 玩家索引。
   * @throws 找不到持有該牌的玩家時拋出錯誤。
   */
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

  /**
   * 檢查是否已有玩家出完手牌。
   * @returns 有玩家手牌為 0 時回傳 true。
   */
  hasWinner(): boolean {
    // 任一玩家手牌為 0
    return this.players.some((player) => player.getHand().isEmpty())
  }

  /**
   * 取得勝利者。
   * @returns 手牌為空的玩家。
   * @throws 尚無勝利者時拋出錯誤。
   */
  getWinner(): Player {
    // 玩家手牌為 0, 回傳該玩家
    const winner = this.players.find((player) => player.getHand().isEmpty())
    if (winner === undefined) {
      throw new Error('Winner not found')
    }
    return winner
  }

  /**
   * 取得勝利者名稱。
   * @returns 勝利者名稱。
   */
  getWinnerName(): string {
    return this.getWinner().getName()
  }
}
