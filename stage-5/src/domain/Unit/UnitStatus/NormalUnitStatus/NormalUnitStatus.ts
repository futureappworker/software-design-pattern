import type { Unit } from '../../Unit'
import { UnitStatus } from '../UnitStatus'
import { UnitStatusType } from '../UnitStatusType/UnitStatusType'

export class NormalUnitStatus extends UnitStatus {
  constructor() {
    super({ type: UnitStatusType.Normal })
  }

  onReceiveOnePunch(self: Unit): void {
    // 造成 100 點傷害
    self.takeDamage(100)
  }

  enterState(self: Unit): void {
    self.setStatusTurnsLeft(0)
  }

  resolveStatus(_self: Unit): boolean {
    return true
  }
}
