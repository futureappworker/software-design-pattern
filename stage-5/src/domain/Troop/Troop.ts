import type { Unit } from '../Unit/Unit'

type TroopProps = {
  name: string
  units: Unit[]
}

export class Troop {
  private name!: string
  private units: Unit[] = []

  constructor({ name, units }: TroopProps) {
    this.setName(name)
    this.units = [...units]
  }

  getName() {
    return this.name
  }
  setName(name: string) {
    this.name = name
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
