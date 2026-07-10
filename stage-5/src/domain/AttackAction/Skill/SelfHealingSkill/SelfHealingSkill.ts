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

  execute(self: Unit, targets: Unit[]): void {
    // <角色> 使用了 <技能>。
    console.log(`${self.getLogName()} 使用了 ${this.getName()}。`)

    for (const target of targets) {
      target.enterStatus(new PetrochemicalUnitStatus())
    }
  }
}
