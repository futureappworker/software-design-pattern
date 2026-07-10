import { RPG } from './domain/RPG/RPG'
import { Troop } from './domain/Troop/Troop'
import { AI } from './domain/Unit/AI/AI'
import { SeedAIActionSelectionStrategy } from './domain/Unit/AI/AIActionSelectionStrategy/SeedAIActionSelectionStrategy/SeedAIActionSelectionStrategy'
import { SeedAITargetSelectionStrategy } from './domain/Unit/AI/AITargetSelectionStrategy/SeedAITargetSelectionStrategy/SeedAITargetSelectionStrategy'
import { Hero } from './domain/Unit/Hero/Hero'

const allies = new Troop({ units: [] })
const enemies = new Troop({ units: [] })

const hero = new Hero({
  hp: 100,
  mp: 100,
  str: 100,
  name: 'Hero',
  skills: [],
  troop: allies,
})

const ai = new AI({
  hp: 100,
  mp: 100,
  str: 100,
  name: 'AI',
  skills: [],
  troop: enemies,
  actionSelectionStrategy: new SeedAIActionSelectionStrategy(),
  targetSelectionStrategy: new SeedAITargetSelectionStrategy(),
})

allies.addUnit(hero)
enemies.addUnit(ai)

const rpg = new RPG({
  allies,
  enemies,
})

rpg.battle()
