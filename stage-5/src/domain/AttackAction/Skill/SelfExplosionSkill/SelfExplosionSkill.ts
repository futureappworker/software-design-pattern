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
    self.takeDamage(self.getHp(), self)
    self.die()
    let damage = 150
    if (self.getStatus().getType() === UnitStatusType.Cheerup) {
      damage += 50
    }

    // <角色> 對 <目標角色清單> 使用了 <技能>。
    console.log(
      `${self.getLogName()} 對 ${targets.map((target) => target.getLogName()).join(', ')} 使用了 ${this.getName()}。`,
    )

    for (const target of targets) {
      target.takeDamage(damage, self)
    }
  }
}
