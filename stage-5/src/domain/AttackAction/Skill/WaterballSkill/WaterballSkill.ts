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

    // <角色> 對 <目標角色清單> 使用了 <技能>。
    console.log(
      `${self.getLogName()} 對 ${targets.map((target) => target.getLogName()).join(', ')} 使用了 ${this.getName()}。`,
    )

    for (const target of targets) {
      // <角色> 對 <目標> 造成 <傷害值> 點傷害。
      console.log(
        `${self.getLogName()} 對 ${target.getLogName()} 造成 ${damage} 點傷害。`,
      )
      target.takeDamage(damage)
    }
  }
}
