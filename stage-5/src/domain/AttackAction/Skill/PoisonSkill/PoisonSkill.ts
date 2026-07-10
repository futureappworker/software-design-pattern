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

  execute(self: Unit, targets: Unit[]): void {
    // <角色> 對 <目標角色清單> 使用了 <技能>。
    console.log(
      `${self.getLogName()} 對 ${targets.map((target) => target.getLogName()).join(', ')} 使用了 ${this.getName()}。`,
    )

    for (const target of targets) {
      target.enterStatus(new PoisonedUnitStatus())
    }
  }
}
