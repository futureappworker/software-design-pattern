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

const servant1 = new AI({
  hp: 1000,
  mp: 0,
  str: 0,
  name: 'Servant1',
  skills: [],
  troop: allies,
  actionSelectionStrategy: new SeedAIActionSelectionStrategy(),
  targetSelectionStrategy: new SeedAITargetSelectionStrategy(),
})

const servant2 = new AI({
  hp: 1000,
  mp: 0,
  str: 0,
  name: 'Servant2',
  skills: [],
  troop: allies,
  actionSelectionStrategy: new SeedAIActionSelectionStrategy(),
  targetSelectionStrategy: new SeedAITargetSelectionStrategy(),
})

const servant3 = new AI({
  hp: 1000,
  mp: 0,
  str: 0,
  name: 'Servant3',
  skills: [],
  troop: allies,
  actionSelectionStrategy: new SeedAIActionSelectionStrategy(),
  targetSelectionStrategy: new SeedAITargetSelectionStrategy(),
})

const servant4 = new AI({
  hp: 1000,
  mp: 0,
  str: 0,
  name: 'Servant4',
  skills: [],
  troop: allies,
  actionSelectionStrategy: new SeedAIActionSelectionStrategy(),
  targetSelectionStrategy: new SeedAITargetSelectionStrategy(),
})

const servant5 = new AI({
  hp: 1000,
  mp: 0,
  str: 0,
  name: 'Servant5',
  skills: [],
  troop: allies,
  actionSelectionStrategy: new SeedAIActionSelectionStrategy(),
  targetSelectionStrategy: new SeedAITargetSelectionStrategy(),
})

const slime1 = new AI({
  hp: 500,
  mp: 0,
  str: 0,
  name: 'Slime1',
  skills: [],
  troop: enemies,
  actionSelectionStrategy: new SeedAIActionSelectionStrategy(),
  targetSelectionStrategy: new SeedAITargetSelectionStrategy(),
})

allies.addUnit(hero)
allies.addUnit(servant1)
allies.addUnit(servant2)
allies.addUnit(servant3)
allies.addUnit(servant4)
allies.addUnit(servant5)
enemies.addUnit(slime1)

const rpg = new RPG({
  allies,
  enemies,
})

rpg.battle()
