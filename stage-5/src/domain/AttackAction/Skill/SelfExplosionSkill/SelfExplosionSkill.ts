import type { Unit } from '../../../Unit/Unit'
import { UnitStatusType } from '../../../Unit/UnitStatus/UnitStatusType/UnitStatusType'
import { AttackActionTargetType } from '../../AttackActionTargetType/AttackActionTargetType'
import { Skill } from '../Skill'

export class SelfExplosionSkill extends Skill {
  constructor() {
    super({
      name: '自爆',
      mpCost: 200,
      target: AttackActionTargetType.All,
      targetCount: -1,
    })
  }

  execute(self: Unit, targets: Unit[]): void {
    self.takeDamage(self.getHp())
    self.die()
    let damage = 150
    if (self.getStatus().getType() === UnitStatusType.Cheerup) {
      damage += 50
    }
    for (const target of targets) {
      target.takeDamage(damage)
    }
  }
}
