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
    const otherTargets = targets.filter((target) => target !== self)
    let damage = 150
    if (self.getStatus().getType() === UnitStatusType.Cheerup) {
      damage += 50
    }

    // <角色> 對 <目標角色清單> 使用了 <技能>。
    console.log(
      `${self.getLogName()} 對 ${otherTargets.map((target) => target.getLogName()).join(', ')} 使用了 ${this.getName()}。`,
    )

    for (const target of otherTargets) {
      target.takeDamage(damage, self)
    }

    self.loseHp(self.getHp())
  }
}
