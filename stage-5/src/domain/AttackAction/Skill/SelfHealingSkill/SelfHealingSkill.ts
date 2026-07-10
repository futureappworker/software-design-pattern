import type { Unit } from '../../../Unit/Unit'
import { PetrochemicalUnitStatus } from '../../../Unit/UnitStatus/PetrochemicalUnitStatus/PetrochemicalUnitStatus'
import { AttackActionTargetType } from '../../AttackActionTargetType/AttackActionTargetType'
import { Skill } from '../Skill'

export class SelfHealingSkill extends Skill {
  constructor() {
    super({
      name: '自我治療',
      mpCost: 50,
      target: AttackActionTargetType.Self,
      targetCount: -1,
    })
  }

  execute(_self: Unit, targets: Unit[]): void {
    for (const target of targets) {
      target.enterStatus(new PetrochemicalUnitStatus())
    }
  }
}
