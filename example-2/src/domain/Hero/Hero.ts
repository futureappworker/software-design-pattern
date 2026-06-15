import type { LevelSheet } from '../LevelSheet/LevelSheet'
import type { Pet } from '../Pet/Pet'

type HeroProps = {
  id: string
  totalExp?: number
  hp?: number
  level?: number
  pet?: Pet | null
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
  private pet: Pet | null = null

  constructor({
    id,
    totalExp = defaultProps.totalExp,
    hp = defaultProps.hp,
    level = defaultProps.level,
    pet = null,
  }: HeroProps) {
    this.setId(id)
    this.setTotalExp(totalExp)
    this.setHp(hp)
    this.setLevel(level)
    this.setPet(pet)
  }

  getId() {
    return this.id
  }
  private setId(id: string) {
    this.id = id
  }

  getPet() {
    return this.pet
  }
  private setPet(pet: Pet | null) {
    this.pet = pet
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
  setHp(hp: number) {
    if (hp < 0) {
      throw new Error('hp 必須 >= 0')
    }
    this.hp = hp
  }

  // 獲得 exp
  gainExp(exp: number, levelSheet: LevelSheet) {
    if (exp < 0) {
      throw new Error('exp 必須 >= 0')
    }

    this.setTotalExp(this.totalExp + exp)
    this.setLevel(levelSheet.queryLevel(this.totalExp))
  }

  // 領養寵物
  adoptPet(pet: Pet) {
    if (this.getPet()) throw new Error('請先棄養寵物')
    this.setPet(pet)
  }

  // 棄養寵物
  abandonPet() {
    if (!this.getPet()) throw new Error('原本就沒有寵物，不用棄養寵物')
    this.setPet(null)
  }
}
