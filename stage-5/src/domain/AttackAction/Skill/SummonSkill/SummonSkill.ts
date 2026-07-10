import { SlimeDeathObserver } from '../../../Unit/DeathObserver/SlimeDeathObserver/SlimeDeathObserver'
import { Slime } from '../../../Unit/Slime/Slime'
import type { Unit } from '../../../Unit/Unit'
import { AttackActionTargetType } from '../../AttackActionTargetType/AttackActionTargetType'
import { Skill } from '../Skill'

export class SummonSkill extends Skill {
  constructor() {
    super({
      name: '召喚',
      mpCost: 150,
      target: AttackActionTargetType.None,
      targetCount: 0,
    })
  }

  execute(self: Unit, _targets: Unit[]): void {
    const summoner = self
    const troop = self.getTroop()
    const slime = new Slime({
      hp: 100,
      mp: 0,
      str: 50,
      name: 'Slime',
      skills: [],
      troop,
      summoner,
    })

    // <角色> 使用了 <技能>。
    console.log(`${self.getLogName()} 使用了 ${this.getName()}。`)

    troop.addUnit(slime)
    slime.addDeathObserver(new SlimeDeathObserver())
  }
}
