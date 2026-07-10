import { CurseEffect } from '../../../Unit/CurseEffect/CurseEffect'
import type { Unit } from '../../../Unit/Unit'
import { AttackActionTargetType } from '../../AttackActionTargetType/AttackActionTargetType'
import { Skill } from '../Skill'

export class CurseSkill extends Skill {
  constructor() {
    super({
      name: '詛咒',
      mpCost: 100,
      target: AttackActionTargetType.Enemy,
      targetCount: 1,
    })
  }

  execute(self: Unit, targets: Unit[]): void {
    const caster = self

    // <角色> 對 <目標角色清單> 使用了 <技能>。
    console.log(
      `${self.getLogName()} 對 ${targets.map((target) => target.getLogName()).join(', ')} 使用了 ${this.getName()}。`,
    )

    for (const target of targets) {
      if (!target.isCursedBy(caster)) {
        const curseEffect = new CurseEffect({ caster, target })
        caster.applyCurseEffect(curseEffect)
        target.applyCurseEffect(curseEffect)
      }
    }
  }
}
