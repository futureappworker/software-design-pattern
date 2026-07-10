import type { Unit } from '../../Unit'
import { UnitStatus } from '../UnitStatus'
import { UnitStatusType } from '../UnitStatusType/UnitStatusType'

export class PetrochemicalUnitStatus extends UnitStatus {
  constructor() {
    super({ type: UnitStatusType.Petrochemical })
  }

  onReceiveOnePunch(self: Unit): void {
    // 造成三次 80 點傷害。
    //（每一次傷害後會判定目標是否死亡，若已死亡則不再造成剩餘次數的傷害。）
    for (let i = 0; i < 3; i++) {
      self.takeDamage(80)
      if (self.isDead()) {
        break
      }
    }
  }

  enterState(self: Unit): void {
    self.setStatusTurnsLeft(3)
  }

  resolveStatus(_self: Unit): boolean {
    return false
  }
}
