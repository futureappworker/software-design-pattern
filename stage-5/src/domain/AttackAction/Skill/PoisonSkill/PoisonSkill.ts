import type { Unit } from '../../../Unit/Unit'
import { PoisonedUnitStatus } from '../../../Unit/UnitStatus/PoisonedUnitStatus/PoisonedUnitStatus'
import { AttackActionTargetType } from '../../AttackActionTargetType/AttackActionTargetType'
import { Skill } from '../Skill'

export class PoisonSkill extends Skill {
  constructor() {
    super({
      name: '下毒',
      mpCost: 80,
      target: AttackActionTargetType.Enemy,
      targetCount: 1,
    })
  }

  execute(_self: Unit, targets: Unit[]): void {
    for (const target of targets) {
      target.enterStatus(new PoisonedUnitStatus())
    }
  }
}
