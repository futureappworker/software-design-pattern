import type { AttackAction } from '../../AttackAction/AttackAction'
import { Unit, type UnitProps } from '../Unit'
import type { AIActionSelectionStrategy } from './AIActionSelectionStrategy/AIActionSelectionStrategy'
import type { AITargetSelectionStrategy } from './AITargetSelectionStrategy/AITargetSelectionStrategy'

export type AIProps = {
  actionSelectionStrategy: AIActionSelectionStrategy
  targetSelectionStrategy: AITargetSelectionStrategy
} & UnitProps

export class AI extends Unit {
  private seed: number = 0
  private actionSelectionStrategy: AIActionSelectionStrategy
  private targetSelectionStrategy: AITargetSelectionStrategy

  constructor({
    actionSelectionStrategy,
    targetSelectionStrategy,
    ...unitProps
  }: AIProps) {
    super(unitProps)
    this.actionSelectionStrategy = actionSelectionStrategy
    this.targetSelectionStrategy = targetSelectionStrategy
  }

  getSeed() {
    return this.seed
  }

  incrementSeed() {
    this.seed++
  }

  async chooseAction(): Promise<AttackAction> {
    return this.actionSelectionStrategy.chooseAction(this)
  }

  async chooseTargets(
    candidates: Unit[],
    targetCount: number,
  ): Promise<Unit[]> {
    return this.targetSelectionStrategy.selectTargets(
      this,
      candidates,
      targetCount,
    )
  }
}
