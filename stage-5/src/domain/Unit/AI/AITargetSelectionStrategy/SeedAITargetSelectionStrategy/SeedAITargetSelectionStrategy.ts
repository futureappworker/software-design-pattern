import type { Unit } from '../../../Unit'
import { AI } from '../../AI'
import type { AITargetSelectionStrategy } from '../AITargetSelectionStrategy'

export class SeedAITargetSelectionStrategy
  implements AITargetSelectionStrategy
{
  selectTargets(self: Unit, candidates: Unit[], targetCount: number): Unit[] {
    // 假設 AI 要選擇 m 位目標角色，而候選角色有 n 位，分別是 (u1, u2, ..., uN)，
    // 另 s 為 AI 當前的 seed 值，則 AI 會選擇
    // (u[s%n], u[(s+1)%n], ..., u[(s+m-1)%n]) 作為目標角色（共 m 位），
    // 選擇完所有目標角色後 seed 的值才會加一。
    // 舉例來說：如果 seed=2、候選角色有三名：(A, B, C)，且 AI 要選擇 2 名目標角色，
    // 則他會選擇 (C, A)，選完之後 seed=3
    if (!(self instanceof AI)) {
      throw new Error('SeedAITargetSelectionStrategy can only be used by AI')
    }

    const n = candidates.length
    const s = self.getSeed()
    const targets: Unit[] = []

    for (let i = 0; i < targetCount; i++) {
      targets.push(candidates[(s + i) % n])
    }

    self.incrementSeed()
    return targets
  }
}
