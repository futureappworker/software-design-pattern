import { shouldBeGreaterThanOrEqual } from '../../utils/shouldBeGreaterThanOrEqual'
import type { LevelSheet } from '../LevelSheet/LevelSheet'

type HeroProps = {
  id: string
  totalExp?: number
  hp?: number
  level?: number
}

const defaultProps = {
  level: 1,
  totalExp: 0,
  hp: 100,
}

export class Hero {
  private id!: string
  private level: number = defaultProps.level
  private totalExp: number = defaultProps.totalExp
  private hp: number = defaultProps.hp

  constructor({
    id,
    totalExp = defaultProps.totalExp,
    hp = defaultProps.hp,
    level = defaultProps.level,
  }: HeroProps) {
    this.setId(id)
    this.setTotalExp(totalExp)
    this.setHp(hp)
    this.setLevel(level)
  }

  getId() {
    return this.id
  }
  private setId(id: string) {
    this.id = id
  }

  getTotalExp() {
    return this.totalExp
  }
  private setTotalExp(totalExp: number) {
    shouldBeGreaterThanOrEqual({
      name: 'totalExp',
      num: totalExp,
      target: 0,
    })

    this.totalExp = totalExp
  }

  getLevel() {
    return this.level
  }
  private setLevel(level: number) {
    shouldBeGreaterThanOrEqual({
      name: 'level',
      num: level,
      target: 1,
    })
    this.level = level
  }

  getHp() {
    return this.hp
  }
  setHp(hp: number) {
    shouldBeGreaterThanOrEqual({
      name: 'hp',
      num: hp,
      target: 0,
    })
    this.hp = hp
  }

  // 獲得 exp
  gainExp(exp: number, levelSheet: LevelSheet) {
    shouldBeGreaterThanOrEqual({
      name: 'exp',
      num: exp,
      target: 0,
    })

    this.setTotalExp(this.totalExp + exp)
    this.setLevel(levelSheet.queryLevel(this.totalExp))
  }
}
