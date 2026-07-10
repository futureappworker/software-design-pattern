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

  execute(self: Unit, targets: Unit[]): void {
    // <角色> 對 <目標角色清單> 使用了 <技能>。
    console.log(
      `${self.getLogName()} 對 ${targets.map((target) => target.getLogName()).join(', ')} 使用了 ${this.getName()}。`,
    )

    for (const target of targets) {
      target.enterStatus(new PetrochemicalUnitStatus())
    }
  }
}
