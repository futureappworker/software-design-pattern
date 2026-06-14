import { nanoid } from 'nanoid'
import { Hero } from './domain/hero/hero'
import { Pet } from './domain/pet/pet'
import { AdoptPetUseCase } from './domain/hero/usecases/adopt-pet.usecase'
import { GainExpUseCase } from './domain/hero/usecases/gain-exp.usecase'
import { LevelSheet } from './domain/level-sheet/level-sheet'

const hero = new Hero({
  id: nanoid(),
  pet: null,
})
const levelSheet = new LevelSheet()
const gainExpUseCase = new GainExpUseCase(levelSheet)

console.log('=== 初始狀態 ===')
console.log('HP:', hero.getHp())
console.log('EXP:', hero.getTotalExp())
console.log('LEVEL:', hero.getLevel())

console.log('\n=== 獲得經驗 100 ===')
gainExpUseCase.execute({
  hero,
  exp: 100,
})
console.log('HP:', hero.getHp())
console.log('EXP:', hero.getTotalExp())
console.log('LEVEL:', hero.getLevel())

console.log('\n=== 獲得經驗 900 ===')
gainExpUseCase.execute({
  hero,
  exp: 900,
})
console.log('HP:', hero.getHp())
console.log('EXP:', hero.getTotalExp())
console.log('LEVEL:', hero.getLevel())

const pet = new Pet({
  id: nanoid(),
  name: 'Kitty',
  hero: null,
})

const adoptPetUseCase = new AdoptPetUseCase()
adoptPetUseCase.execute({
  hero,
  pet,
})

console.log('\n=== 領養寵物 ===')
gainExpUseCase.execute({
  hero,
  exp: 100,
})
console.log('HP:', hero.getHp())
console.log('EXP:', hero.getTotalExp())
console.log('LEVEL:', hero.getLevel())
console.log('Pet:', hero.getPet()?.getName())
