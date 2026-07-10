import { CheerupSkill } from './domain/AttackAction/Skill/CheerupSkill/CheerupSkill'
import { RPG } from './domain/RPG/RPG'
import { Troop } from './domain/Troop/Troop'
import { AI } from './domain/Unit/AI/AI'
import { SeedAIActionSelectionStrategy } from './domain/Unit/AI/AIActionSelectionStrategy/SeedAIActionSelectionStrategy/SeedAIActionSelectionStrategy'
import { SeedAITargetSelectionStrategy } from './domain/Unit/AI/AITargetSelectionStrategy/SeedAITargetSelectionStrategy/SeedAITargetSelectionStrategy'
import { Hero } from './domain/Unit/Hero/Hero'

const allies = new Troop({ name: '1', units: [] })
const enemies = new Troop({ name: '2', units: [] })

const hero = new Hero({
  hp: 500,
  mp: 10000,
  str: 30,
  name: '英雄',
  skills: [new CheerupSkill()],
  troop: allies,
})

const ai1 = new AI({
  hp: 1000,
  mp: 0,
  str: 0,
  name: 'Servant1',
  skills: [],
  troop: enemies,
  actionSelectionStrategy: new SeedAIActionSelectionStrategy(),
  targetSelectionStrategy: new SeedAITargetSelectionStrategy(),
})

allies.addUnit(hero)
enemies.addUnit(ai1)

const rpg = new RPG({
  allies,
  enemies,
})

rpg.battle()
