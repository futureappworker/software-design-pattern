import { shouldBeGreaterThanOrEqual } from '../../utils/shouldBeGreaterThanOrEqual'
import type { Player } from '../Player/Player'

type ExchangeEffectProps = {
  playerA: Player
  playerB: Player
  remainingRounds?: number
}

const defaultProps = {
  remainingRounds: 3,
}

export class ExchangeEffect {
  private playerA: Player
  private playerB: Player
  private remainingRounds: number = defaultProps.remainingRounds

  constructor({
    playerA,
    playerB,
    remainingRounds = defaultProps.remainingRounds,
  }: ExchangeEffectProps) {
    this.playerA = playerA
    this.playerB = playerB
    this.setRemainingRounds(remainingRounds)
  }

  getPlayerA() {
    return this.playerA
  }

  getPlayerB() {
    return this.playerB
  }

  getRemainingRounds() {
    return this.remainingRounds
  }

  /**
   * 設置剩餘生效回合數
   * @param remainingRounds 剩餘回合數（必須 >= 0）
   * @throws 如果剩餘回合數小於 0
   */
  private setRemainingRounds(remainingRounds: number) {
    shouldBeGreaterThanOrEqual({
      name: 'remainingRounds',
      num: remainingRounds,
      target: 0,
    })
    this.remainingRounds = remainingRounds
  }

  /**
   * 推進一回合，剩餘生效回合數減 1
   * @throws 如果剩餘回合數小於 0
   */
  tick() {
    this.setRemainingRounds(this.remainingRounds - 1)
  }

  /**
   * 檢查交換效果是否已過期
   * @returns true 表示已過期（剩餘回合數為 0），false 表示仍生效中
   */
  isExpired(): boolean {
    return this.remainingRounds === 0
  }
}
