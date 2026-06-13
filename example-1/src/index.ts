import { Hero } from './domain/hero'
import { LevelSheet } from './domain/level.sheet'

const levelSheet = new LevelSheet()

const hero = new Hero({
  totalExp: 0,
  hp: 100,
  level: 1,
})

console.log('=== 初始狀態 ===')
console.log('HP:', hero.getHp())
console.log('EXP:', hero.getTotalExp())
console.log('LEVEL:', hero.getLevel())

console.log('\n=== 獲得經驗 100 ===')
hero.gainExp(100, levelSheet)

console.log('HP:', hero.getHp())
console.log('EXP:', hero.getTotalExp())
console.log('LEVEL:', hero.getLevel())

console.log('\n=== 獲得經驗 900 ===')
hero.gainExp(900, levelSheet)

console.log('HP:', hero.getHp())
console.log('EXP:', hero.getTotalExp())
console.log('LEVEL:', hero.getLevel())
