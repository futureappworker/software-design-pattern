import type { LevelSheet } from './level.sheet'

type HeroProps = {
  id?: string
  totalExp: number
  hp: number
  level: number
}

export class Hero {
  private id!: string
  private level: number = 1
  private totalExp: number = 0
  private hp: number = 0

  constructor({ id = crypto.randomUUID(), totalExp, hp, level }: HeroProps) {
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
    if (totalExp < 0) {
      throw new Error('totalExp 必須 >= 0')
    }

    this.totalExp = totalExp
  }

  getLevel() {
    return this.level
  }
  private setLevel(level: number) {
    if (level <= 0) {
      throw new Error('level 必須 > 0')
    }
    this.level = level
  }

  getHp() {
    return this.hp
  }
  private setHp(hp: number) {
    if (hp < 0) {
      throw new Error('hp 必須 >= 0')
    }
    this.hp = hp
  }

  gainExp(exp: number, levelSheet: LevelSheet) {
    if (exp < 0) {
      throw new Error('exp 必須 >= 0')
    }

    this.setTotalExp(this.totalExp + exp)
    this.setLevel(levelSheet.queryLevel(this.totalExp))
  }
}
