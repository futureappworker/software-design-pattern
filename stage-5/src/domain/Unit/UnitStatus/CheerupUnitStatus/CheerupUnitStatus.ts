import type { Unit } from '../../Unit'
import { NormalUnitStatus } from '../NormalUnitStatus/NormalUnitStatus'
import { UnitStatus } from '../UnitStatus'
import { UnitStatusType } from '../UnitStatusType/UnitStatusType'

export class CheerupUnitStatus extends UnitStatus {
  constructor() {
    super({ type: UnitStatusType.Cheerup })
  }

  onReceiveOnePunch(self: Unit): void {
    // 造成 100 點傷害，並將目標角色的狀態恢復成正常狀態
    self.takeDamage(100)
    self.enterStatus(new NormalUnitStatus())
  }

  enterState(self: Unit): void {
    self.setStatusTurnsLeft(3)
  }

  resolveStatus(_self: Unit): boolean {
    return true
  }
}
