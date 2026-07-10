import type { Unit } from '../../../Unit/Unit'
import { AttackActionTargetType } from '../../AttackActionTargetType/AttackActionTargetType'
import { Skill } from '../Skill'

export class OnePunchSkill extends Skill {
  constructor() {
    super({
      name: '一拳攻擊',
      mpCost: 180,
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
      target.receiveOnePunch(self)
    }
  }
}
