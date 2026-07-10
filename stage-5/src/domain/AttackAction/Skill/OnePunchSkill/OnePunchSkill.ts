import type { Unit } from '../../../Unit/Unit'
import { AttackActionTargetType } from '../../AttackActionTargetType/AttackActionTargetType'
import { Skill } from '../Skill'

export class OnePunchSkill extends Skill {
  constructor() {
    super({
      name: '一拳攻擊',
      mpCost: 180,
      target: AttackActionTargetType.Enemy,
      targetCount: 1,
    })
  }

  execute(_self: Unit, targets: Unit[]): void {
    for (const target of targets) {
      target.receiveOnePunch()
    }
  }
}
