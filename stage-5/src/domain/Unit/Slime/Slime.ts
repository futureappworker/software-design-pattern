import { AI } from '../AI/AI'
import { SeedAIActionSelectionStrategy } from '../AI/AIActionSelectionStrategy/SeedAIActionSelectionStrategy/SeedAIActionSelectionStrategy'
import { SeedAITargetSelectionStrategy } from '../AI/AITargetSelectionStrategy/SeedAITargetSelectionStrategy/SeedAITargetSelectionStrategy'
import { SlimeDeathObserver } from '../DeathObserver/SlimeDeathObserver/SlimeDeathObserver'
import type { Unit, UnitProps } from '../Unit'

type SlimeProps = UnitProps & {
  summoner: Unit
}

export class Slime extends AI {
  private summoner: Unit

  constructor({
    hp = 100,
    mp = 0,
    str = 50,
    name = 'Slime',
    skills = [],
    troop,
    summoner,
  }: SlimeProps) {
    super({
      actionSelectionStrategy: new SeedAIActionSelectionStrategy(),
      targetSelectionStrategy: new SeedAITargetSelectionStrategy(),
      hp,
      mp,
      str,
      name,
      skills,
      troop,
    })
    this.summoner = summoner
    this.summoner.addDeathObserver(new SlimeDeathObserver())
  }

  getSummoner() {
    return this.summoner
  }
}
