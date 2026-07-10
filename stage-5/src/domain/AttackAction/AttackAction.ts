import { shouldBeGreaterThanOrEqual } from '../../utils/shouldBeGreaterThanOrEqual'
import type { Unit } from '../Unit/Unit'
import type { AttackActionTargetType } from './AttackActionTargetType/AttackActionTargetType'

type AttackActionProps = {
  name: string
  mpCost: number
  target: AttackActionTargetType
  targetCount: number
}

export abstract class AttackAction {
  private name!: string
  private mpCost!: number
  private target: AttackActionTargetType
  private targetCount!: number

  constructor({ name, mpCost, target, targetCount }: AttackActionProps) {
    this.setName(name)
    this.setMpCost(mpCost)
    this.target = target
    this.setTargetCount(targetCount)
  }

  getName() {
    return this.name
  }
  setName(name: string) {
    if (name.length === 0) {
      throw new Error('name must be a non-empty string')
    }
    this.name = name
  }

  getMpCost() {
    return this.mpCost
  }
  setMpCost(mpCost: number) {
    shouldBeGreaterThanOrEqual({
      name: 'mpCost',
      num: mpCost,
      target: 0,
    })

    this.mpCost = mpCost
  }

  getTarget() {
    return this.target
  }

  getTargetCount() {
    return this.targetCount
  }
  setTargetCount(targetCount: number) {
    // -1 就是全部
    shouldBeGreaterThanOrEqual({
      name: 'targetCount',
      num: targetCount,
      target: -1,
    })
    this.targetCount = targetCount
  }

  abstract execute(self: Unit, targets: Unit[]): void
}
