import type { DeathObserver } from '../DeathObserver/DeathObserver'
import type { Unit } from '../Unit'

type CurseEffectProps = {
  caster: Unit
  target: Unit
}

export class CurseEffect implements DeathObserver {
  private caster: Unit
  private target: Unit

  constructor({ caster, target }: CurseEffectProps) {
    this.caster = caster
    this.target = target
    this.target.addDeathObserver(this)
  }

  getCaster() {
    return this.caster
  }
  getTarget() {
    return this.target
  }

  onUnitDead(self: Unit) {
    if (this.caster.isAlive()) {
      this.caster.heal(self.getMp())
    }
    this.caster.removeDeathObserver(this)
    this.target.removeDeathObserver(this)
  }
}
