import type { Unit } from '../Unit'
import type { UnitStatusType } from './UnitStatusType/UnitStatusType'

type UnitStatusProps = {
  type: UnitStatusType
}

export abstract class UnitStatus {
  private type: UnitStatusType

  constructor({ type }: UnitStatusProps) {
    this.type = type
  }

  getType() {
    return this.type
  }

  receiveOnePunch(unit: Unit) {
    if (unit.getHp() >= 500) {
      unit.takeDamage(300)
      return
    }

    this.onReceiveOnePunch(unit)
  }

  abstract onReceiveOnePunch(self: Unit): void

  abstract resolveStatus(self: Unit): boolean

  enterState(_self: Unit) {
    // hook method
  }

  exitState(_self: Unit) {
    // hook method
  }
}
