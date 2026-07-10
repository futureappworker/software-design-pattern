import type { Unit } from '../../Unit'

export interface AITargetSelectionStrategy {
  selectTargets(self: Unit, candidates: Unit[], targetCount: number): Unit[]
}
