import { nanoid } from 'nanoid'
import { Hero } from './domain/Hero/Hero'
import { GainExpUseCase } from './domain/Hero/usecases/GainExp.usecase'
import { LevelSheet } from './domain/LevelSheet/LevelSheet'

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
