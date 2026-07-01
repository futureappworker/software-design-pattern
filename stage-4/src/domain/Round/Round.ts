import { shouldBeWithinRange } from '../../utils/shouldBeWithinRange'
import type { CardPattern } from '../CardPattern/CardPattern'

type RoundProps = {
  topPlayerIndex?: number
  topPlay?: CardPattern | null
  consecutivePassCount?: number
}

export class Round {
  private topPlayerIndex: number = -1
  private topPlay: CardPattern | null = null
  private consecutivePassCount: number = 0

  /**
   * 建立一個回合狀態。
   * @param props - 可選的初始頂牌、頂牌玩家索引與連續 PASS 次數。
   */
  constructor({
    topPlayerIndex = -1,
    topPlay = null,
    consecutivePassCount = 0,
  }: RoundProps) {
    this.setTopPlay(topPlay)
    this.setTopPlayerIndex(topPlayerIndex)
    this.setConsecutivePassCount(consecutivePassCount)
  }

  /**
   * 取得目前檯面上的頂牌。
   * @returns 頂牌，新回合時為 null。
   */
  getTopPlay() {
    return this.topPlay
  }

  /**
   * 設定目前檯面上的頂牌。
   * @param topPlay - 頂牌，新回合時為 null。
   */
  setTopPlay(topPlay: CardPattern | null) {
    this.topPlay = topPlay
  }

  /**
   * 取得出頂牌的玩家索引。
   * @returns 玩家索引，尚無頂牌時為 -1。
   */
  getTopPlayerIndex() {
    return this.topPlayerIndex
  }

  /**
   * 設定出頂牌的玩家索引。
   * @param topPlayerIndex - 玩家索引，範圍為 -1 至 3。
   */
  setTopPlayerIndex(topPlayerIndex: number) {
    shouldBeWithinRange({
      name: 'topPlayerIndex',
      num: topPlayerIndex,
      inclusiveMin: -1,
      inclusiveMax: 3,
    })

    this.topPlayerIndex = topPlayerIndex
  }

  /**
   * 取得連續 PASS 的次數。
   * @returns 連續 PASS 次數。
   */
  getConsecutivePassCount() {
    return this.consecutivePassCount
  }

  /**
   * 設定連續 PASS 的次數。
   * @param consecutivePassCount - 連續 PASS 次數，範圍為 0 至 3。
   */
  setConsecutivePassCount(consecutivePassCount: number) {
    shouldBeWithinRange({
      name: 'consecutivePassCount',
      num: consecutivePassCount,
      inclusiveMin: 0,
      inclusiveMax: 3,
    })

    this.consecutivePassCount = consecutivePassCount
  }

  /**
   * 記錄一次 PASS，連續 PASS 次數加 1。
   */
  recordPass() {
    // consecutivePassCount + 1
    this.consecutivePassCount++
  }

  /**
   * 清空檯面上的頂牌。
   */
  resetTopPlay() {
    // 清空頂牌
    this.topPlay = null
  }

  /**
   * 將連續 PASS 次數重設為 0。
   */
  resetConsecutivePassCount() {
    // consecutivePassCount 設定為 0
    this.consecutivePassCount = 0
  }
}
