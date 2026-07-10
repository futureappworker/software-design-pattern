import { CurseEffect } from '../../../Unit/CurseEffect/CurseEffect'
import type { Unit } from '../../../Unit/Unit'
import { AttackActionTargetType } from '../../AttackActionTargetType/AttackActionTargetType'
import { Skill } from '../Skill'

export class CurseSkill extends Skill {
  constructor() {
    super({
      name: '詛咒',
      mpCost: 50,
      target: AttackActionTargetType.Enemy,
      targetCount: -1,
    })
  }

  execute(self: Unit, targets: Unit[]): void {
    const caster = self
    for (const target of targets) {
      if (!target.isCursedBy(caster)) {
        const curseEffect = new CurseEffect({ caster, target })
        caster.applyCurseEffect(curseEffect)
        target.applyCurseEffect(curseEffect)
        target.addDeathObserver(curseEffect)
      }
    }
  }
}
