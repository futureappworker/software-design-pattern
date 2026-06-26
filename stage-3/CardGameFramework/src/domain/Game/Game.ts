import { stdin as input, stdout as output } from 'node:process'
import { createInterface } from 'node:readline/promises'
import { shouldBeGreaterThanOrEqual } from '../../utils/shouldBeGreaterThanOrEqual'
import { shouldBeWithinRange } from '../../utils/shouldBeWithinRange'
import type { AIChooseCardStrategy } from '../AIPlayer/AIChooseCardStrategy'
import { AIPlayer } from '../AIPlayer/AIPlayer'
import type { Deck } from '../Deck/Deck'
import { DiscardPile } from '../DiscardPile/DiscardPile'
import type { HumanChooseCardStrategy } from '../HumanPlayer/HumanChooseCardStrategy'
import { HumanPlayer } from '../HumanPlayer/HumanPlayer'
import type { Player } from '../Player/Player'
import { TableArea } from '../TableArea/TableArea'

enum PlayerType {
  HUMAN = 'Human',
  AI = 'AI',
}

type GameConfig = {
  deck: Deck
  initialHandSize: number
  winCondition: (game: Game) => boolean
  aiChooseCardStrategy: AIChooseCardStrategy
  humanChooseCardStrategy: HumanChooseCardStrategy
}

export class Game {
  private readonly PLAYER_COUNT = 4
  private deck: Deck
  private initialHandSize!: number
  private winCondition: (game: Game) => boolean
  private aiChooseCardStrategy: AIChooseCardStrategy
  private humanChooseCardStrategy: HumanChooseCardStrategy
  private tableArea: TableArea = new TableArea({})
  private discardPile: DiscardPile = new DiscardPile({})
  private players: Player[] = []
  private currentPlayerIndex: number = 0

  constructor({
    deck,
    initialHandSize,
    winCondition,
    aiChooseCardStrategy,
    humanChooseCardStrategy,
  }: GameConfig) {
    this.deck = deck
    this.setInitialHandSize(initialHandSize)
    this.winCondition = winCondition
    this.aiChooseCardStrategy = aiChooseCardStrategy
    this.humanChooseCardStrategy = humanChooseCardStrategy
  }

  /**
   * 設定初始手牌數量
   * @param initialHandSize 每位玩家的初始手牌數量，必須大於等於 0
   */
  setInitialHandSize(initialHandSize: number) {
    shouldBeGreaterThanOrEqual({
      name: 'Initial Hand Size',
      num: initialHandSize,
      target: 0,
    })

    this.initialHandSize = initialHandSize
  }

  /**
   * 獲取牌組
   * @returns 遊戲使用的牌組
   */
  getDeck(): Deck {
    return this.deck
  }

  /**
   * 獲取初始手牌數量
   * @returns 每位玩家的初始手牌數量
   */
  getInitialHandSize(): number {
    return this.initialHandSize
  }

  /**
   * 獲取桌面區域
   * @returns 桌面區域
   */
  getTableArea(): TableArea {
    return this.tableArea
  }

  /**
   * 獲取棄牌堆
   * @returns 棄牌堆
   */
  getDiscardPile(): DiscardPile {
    return this.discardPile
  }

  /**
   * 判斷遊戲是否結束
   * @returns 若已滿足勝利條件則為 true，否則為 false
   */
  isGameOver(): boolean {
    return this.winCondition(this)
  }

  /**
   * 獲取參賽玩家列表
   * @returns 玩家列表副本（修改不會影響原始列表）
   */
  getPlayers(): Player[] {
    return [...this.players]
  }

  /**
   * 獲取當前回合的玩家
   * @returns 當前玩家
   */
  getCurrentPlayer(): Player {
    return this.players[this.currentPlayerIndex]
  }

  /**
   * 將回合切換到下一位玩家
   * 若已輪到最後一位玩家，則回到第一位
   */
  moveToNextPlayer() {
    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.players.length
  }

  setCurrentPlayerIndex(index: number) {
    shouldBeWithinRange({
      name: 'Current Player Index',
      num: index,
      inclusiveMin: 0,
      inclusiveMax: this.players.length - 1,
    })

    this.currentPlayerIndex = index
  }

  /**
   * 將玩家加入遊戲
   * @param player 要加入的玩家
   */
  addPlayer(player: Player) {
    this.players.push(player)
  }

  /**
   * 透過 CLI 設定 4 位參賽玩家
   * 依序為 P1~P4 設定類型（AI / Human）與名稱
   */
  async setupGamePlayers() {
    for (let i = 0; i < this.PLAYER_COUNT; i++) {
      const label = `P${i + 1}`
      const playerType = await this.askPlayerType(label)
      const playerName = await this.askPlayerName(label)
      switch (playerType) {
        case PlayerType.HUMAN: {
          const humanPlayer = new HumanPlayer({
            game: this,
            name: playerName,
            humanChooseCardStrategy: this.humanChooseCardStrategy,
          })
          this.tableArea.setPlayerArea(humanPlayer.getId(), [])
          this.addPlayer(humanPlayer)
          break
        }
        case PlayerType.AI: {
          const aiPlayer = new AIPlayer({
            game: this,
            name: playerName,
            aiChooseCardStrategy: this.aiChooseCardStrategy,
          })
          this.tableArea.setPlayerArea(aiPlayer.getId(), [])
          this.addPlayer(aiPlayer)
          break
        }
      }
    }
  }

  /**
   * 透過 CLI 詢問玩家類型
   * 輸入 1 表示 AI，2 表示 Human；無效輸入會重新詢問
   * @param label 玩家標籤（如 P1、P2）
   * @returns 玩家類型
   */
  async askPlayerType(label: string): Promise<PlayerType> {
    const rl = createInterface({ input, output })

    while (true) {
      const answer = await rl.question(`${label} 玩家類型？(1) AI (2) Human: `)

      switch (Number(answer.trim())) {
        case 1:
          rl.close()
          return PlayerType.AI
        case 2:
          rl.close()
          return PlayerType.HUMAN
        default:
          console.log('只能輸入範圍 1~2 的數字, 請再輸入一次')
      }
    }
  }

  /**
   * 透過 CLI 詢問玩家名稱
   * 名稱不能為空或含有首尾空格；無效輸入會重新詢問
   * @param label 玩家標籤（如 P1、P2）
   * @returns 玩家名稱
   */
  async askPlayerName(label: string): Promise<string> {
    const rl = createInterface({ input, output })

    while (true) {
      const answer = await rl.question(`${label} 請輸入玩家名稱: `)

      if (answer.trim() === '' || answer !== answer.trim()) {
        console.log('名稱不能為空或含有首尾空格, 請再輸入一次')
        continue
      }

      rl.close()
      return answer
    }
  }

  /**
   * 初始化遊戲
   * 透過 CLI 設定參賽玩家、洗牌，並發牌至每位玩家的手牌達到初始手牌數量
   */
  async setup() {
    // 先檢查牌數是否足夠
    if (
      this.deck.getCards().length <
      this.PLAYER_COUNT * this.initialHandSize
    ) {
      throw new Error('牌數不足')
    }

    await this.setupGamePlayers()

    this.deck.shuffle()

    // 所有 Player 的 hand, 都有 Game.initialHandSize 的數量為止
    while (
      this.players.some(
        (player) => player.getHand().length !== this.initialHandSize,
      )
    ) {
      this.players.forEach((player) => {
        player.drawCardFromDeck(this.deck)
      })
    }
  }
}
