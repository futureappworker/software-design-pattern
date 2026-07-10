import type { Unit } from '../Unit'

export interface DeathObserver {
  onUnitDead(selt: Unit): void
}
