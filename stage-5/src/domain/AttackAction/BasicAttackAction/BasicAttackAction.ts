import type { Unit } from '../../Unit/Unit'
import { UnitStatusType } from '../../Unit/UnitStatus/UnitStatusType/UnitStatusType'
import { AttackAction } from '../AttackAction'
import { AttackActionTargetType } from '../AttackActionTargetType/AttackActionTargetType'

export class BasicAttackAction extends AttackAction {
  constructor() {
    super({
      name: '普通攻擊',
      mpCost: 0,
      target: AttackActionTargetType.Enemy,
      targetCount: 1,
    })
  }

  execute(self: Unit, targets: Unit[]): void {
    let damage = self.getStr()
    if (self.getStatus().getType() === UnitStatusType.Cheerup) {
      damage += 50
    }
    for (const target of targets) {
      // <角色> 攻擊 <目標>。
      console.log(`${self.getLogName()} 攻擊 ${target.getLogName()}。`)
      target.takeDamage(damage)
    }
  }
}
