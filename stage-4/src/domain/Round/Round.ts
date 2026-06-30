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

  constructor({
    topPlayerIndex = -1,
    topPlay = null,
    consecutivePassCount = 0,
  }: RoundProps) {
    this.setTopPlay(topPlay)
    this.setTopPlayerIndex(topPlayerIndex)
    this.setConsecutivePassCount(consecutivePassCount)
  }

  getTopPlay() {
    return this.topPlay
  }

  setTopPlay(topPlay: CardPattern | null) {
    this.topPlay = topPlay
  }

  getTopPlayerIndex() {
    return this.topPlayerIndex
  }

  setTopPlayerIndex(topPlayerIndex: number) {
    shouldBeWithinRange({
      name: 'topPlayerIndex',
      num: topPlayerIndex,
      inclusiveMin: -1,
      inclusiveMax: 3,
    })

    this.topPlayerIndex = topPlayerIndex
  }

  getConsecutivePassCount() {
    return this.consecutivePassCount
  }

  setConsecutivePassCount(consecutivePassCount: number) {
    shouldBeWithinRange({
      name: 'consecutivePassCount',
      num: consecutivePassCount,
      inclusiveMin: 0,
      inclusiveMax: 3,
    })

    this.consecutivePassCount = consecutivePassCount
  }

  recordPass() {
    // consecutivePassCount + 1
    this.consecutivePassCount++
  }

  resetTopPlay() {
    // 清空頂牌
    this.topPlay = null
  }

  resetConsecutivePassCount() {
    // consecutivePassCount 設定為 0
    this.consecutivePassCount = 0
  }
}
