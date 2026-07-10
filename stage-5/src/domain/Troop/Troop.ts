import type { Unit } from '../Unit/Unit'

type TroopProps = {
  units: Unit[]
}

export class Troop {
  private units: Unit[] = []

  constructor({ units }: TroopProps) {
    this.units = [...units]
  }

  getUnits() {
    return [...this.units]
  }

  addUnit(unit: Unit) {
    this.units.push(unit)
  }

  getAliveUnits() {
    return this.units.filter((unit) => unit.isAlive())
  }

  isAnnihilated() {
    return this.units.every((unit) => unit.isDead())
  }
}
