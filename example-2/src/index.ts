import { nanoid } from 'nanoid'
import { Fruit } from './domain/Fruit/Fruit'
import { Hero } from './domain/Hero/Hero'
import { AbandonPetUseCase } from './domain/Hero/usecases/AbandonPet.usecase'
import { AdoptPetUseCase } from './domain/Hero/usecases/AdoptPet.usecase'
import { GainExpUseCase } from './domain/Hero/usecases/GainExp.usecase'
import { LevelSheet } from './domain/LevelSheet/LevelSheet'
import { Pet } from './domain/Pet/Pet'
import { EatUseCase } from './domain/Pet/usecases/Eat.usecase'

const hero = new Hero({
  id: nanoid(),
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
console.log('Pet:', hero.getPet() ? hero.getPet()?.getName() : '無')

for (let i = 0; i < 5; i = i + 1) {
  console.log('\n=== 寵物吃水果 ===')
  const eatUseCase = new EatUseCase()
  const fruit = new Fruit()
  eatUseCase.execute({
    pet,
    fruit,
  })
  console.log('HP:', hero.getHp())
  console.log('EXP:', hero.getTotalExp())
  console.log('LEVEL:', hero.getLevel())
  console.log('Pet:', hero.getPet() ? hero.getPet()?.getName() : '無')
}

console.log('\n=== 棄養寵物 ===')
const abandonPetUseCase = new AbandonPetUseCase()
abandonPetUseCase.execute({ hero })
console.log('HP:', hero.getHp())
console.log('EXP:', hero.getTotalExp())
console.log('LEVEL:', hero.getLevel())
console.log('Pet:', hero.getPet() ? hero.getPet()?.getName() : '無')
