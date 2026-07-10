import type { Unit } from '../../../Unit/Unit'
import { CheerupUnitStatus } from '../../../Unit/UnitStatus/CheerupUnitStatus/CheerupUnitStatus'
import { AttackActionTargetType } from '../../AttackActionTargetType/AttackActionTargetType'
import { Skill } from '../Skill'

export class CheerupSkill extends Skill {
  constructor() {
    super({
      name: '鼓舞',
      mpCost: 100,
      target: AttackActionTargetType.Ally,
      targetCount: 3,
    })
  }

  execute(_self: Unit, targets: Unit[]): void {
    for (const target of targets) {
      target.enterStatus(new CheerupUnitStatus())
    }
  }
}
