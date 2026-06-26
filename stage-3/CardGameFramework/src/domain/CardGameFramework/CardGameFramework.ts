import type { AIChooseCardStrategy } from '../AIPlayer/AIChooseCardStrategy'
import type { Deck } from '../Deck/Deck'
import { Game } from '../Game/Game'
import type { HumanChooseCardStrategy } from '../HumanPlayer/HumanChooseCardStrategy'

type WinCondition = (game: Game) => boolean
type TurnListener = (game: Game) => void | Promise<void>
type BeforeGameHook = (game: Game) => void
type BeforeTurnHook = (game: Game) => void
type AfterTurnHook = (game: Game) => void
type AfterGameHook = (game: Game) => void

type CardGameFrameworkConfig = {
  deck: Deck
  initialHandSize: number
  winCondition: WinCondition
  aiChooseCardStrategy: AIChooseCardStrategy
  humanChooseCardStrategy: HumanChooseCardStrategy
  turnListener: TurnListener
  beforeGameHook?: BeforeGameHook
  beforeTurnHook?: BeforeTurnHook
  afterTurnHook?: AfterTurnHook
  afterGameHook?: AfterGameHook
}

export class CardGameFramework {
  private game: Game
  private turnListener: TurnListener
  private beforeGameHook?: BeforeGameHook
  private beforeTurnHook?: BeforeTurnHook
  private afterTurnHook?: AfterTurnHook
  private afterGameHook?: AfterGameHook

  constructor({
    deck,
    initialHandSize,
    winCondition,
    aiChooseCardStrategy,
    humanChooseCardStrategy,
    turnListener,
    beforeGameHook,
    beforeTurnHook,
    afterTurnHook,
    afterGameHook,
  }: CardGameFrameworkConfig) {
    const gameConfig = {
      deck,
      initialHandSize,
      winCondition,
      aiChooseCardStrategy,
      humanChooseCardStrategy,
    }

    this.game = new Game(gameConfig)

    this.turnListener = turnListener
    this.beforeGameHook = beforeGameHook
    this.beforeTurnHook = beforeTurnHook
    this.afterTurnHook = afterTurnHook
    this.afterGameHook = afterGameHook
  }

  /**
   * 獲取遊戲實例
   * @returns 框架管理的遊戲物件
   */
  getGame(): Game {
    return this.game
  }

  /**
   * 觸發回合監聽器
   * 若已註冊 turnListener，則執行該回呼
   */
  async onTurn() {
    await this.turnListener(this.getGame())
  }

  /**
   * 觸發遊戲開始前的 hook
   * 若已註冊 beforeGameHook，則執行該回呼
   */
  onBeforeGameHook() {
    this.beforeGameHook?.(this.getGame())
  }

  /**
   * 觸發回合開始前的 hook
   * 若已註冊 beforeTurnHook，則執行該回呼
   */
  onBeforeTurnHook() {
    this.beforeTurnHook?.(this.getGame())
  }

  /**
   * 觸發回合結束後的 hook
   * 若已註冊 afterTurnHook，則執行該回呼
   */
  onAfterTurnHook() {
    this.afterTurnHook?.(this.getGame())
  }

  /**
   * 觸發遊戲結束後的 hook
   * 若已註冊 afterGameHook，則執行該回呼
   */
  onAfterGameHook() {
    this.afterGameHook?.(this.getGame())
  }

  /**
   * 啟動遊戲流程
   * 依序執行遊戲前 hook、初始化遊戲、回合迴圈，最後執行遊戲後 hook
   */
  async start() {
    this.onBeforeGameHook()

    await this.game.setup()

    while (!this.game.isGameOver()) {
      this.onBeforeTurnHook()
      await this.onTurn()
      this.onAfterTurnHook()
    }

    this.onAfterGameHook()
  }
}
