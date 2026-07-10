import type { Slime } from '../../Slime/Slime'
import type { DeathObserver } from '../DeathObserver'

export class SlimeDeathObserver implements DeathObserver {
  onUnitDead(selt: Slime): void {
    const summoner = selt.getSummoner()
    if (summoner.isAlive()) {
      summoner.heal(30)
    }
  }
}
