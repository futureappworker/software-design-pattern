import type { Unit } from '../../../Unit/Unit'
import { PetrochemicalUnitStatus } from '../../../Unit/UnitStatus/PetrochemicalUnitStatus/PetrochemicalUnitStatus'
import { AttackActionTargetType } from '../../AttackActionTargetType/AttackActionTargetType'
import { Skill } from '../Skill'

export class PetrochemicalSkill extends Skill {
  constructor() {
    super({
      name: '石化',
      mpCost: 100,
      target: AttackActionTargetType.Enemy,
      targetCount: 1,
    })
  }

  execute(_self: Unit, targets: Unit[]): void {
    for (const target of targets) {
      target.enterStatus(new PetrochemicalUnitStatus())
    }
  }
}
