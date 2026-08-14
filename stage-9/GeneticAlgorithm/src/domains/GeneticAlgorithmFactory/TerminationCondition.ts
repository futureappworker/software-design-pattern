import type { Population } from '../Population'

export class TerminationCondition {
  shouldTerminate(_population: Population): boolean {
    // 判斷基因演算法是否已達到停止條件，決定是否結束演化

    // 預設 回 false
    // 有特別情境時，再另外繼承
    return false
  }
}
