import type { Unit } from '../../../Unit/Unit'
import { UnitStatusType } from '../../../Unit/UnitStatus/UnitStatusType/UnitStatusType'
import { AttackActionTargetType } from '../../AttackActionTargetType/AttackActionTargetType'
import { Skill } from '../Skill'

export class WaterballSkill extends Skill {
  constructor() {
    super({
      name: '水球',
      mpCost: 50,
      target: AttackActionTargetType.Enemy,
      targetCount: 1,
    })
  }

  execute(self: Unit, targets: Unit[]): void {
    let damage = 120
    if (self.getStatus().getType() === UnitStatusType.Cheerup) {
      damage += 50
    }
    for (const target of targets) {
      target.takeDamage(damage)
    }
  }
}
