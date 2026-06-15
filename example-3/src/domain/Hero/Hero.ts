import type { Guild } from '../Guild/Guild'
import type { LevelSheet } from '../LevelSheet/LevelSheet'
import type { Pet } from '../Pet/Pet'

type HeroProps = {
  id: string
  totalExp?: number
  hp?: number
  level?: number
  pet?: Pet | null
  guilds?: Guild[]
}

const defaultProps = {
  level: 1,
  totalExp: 0,
  hp: 100,
  pet: null,
  guilds: [],
}

export class Hero {
  private id!: string
  private level: number = defaultProps.level
  private totalExp: number = defaultProps.totalExp
  private hp: number = defaultProps.hp
  private pet: Pet | null = defaultProps.pet
  private guilds: Guild[] = defaultProps.guilds

  constructor({
    id,
    totalExp = defaultProps.totalExp,
    hp = defaultProps.hp,
    level = defaultProps.level,
    pet = defaultProps.pet,
    guilds = defaultProps.guilds,
  }: HeroProps) {
    this.setId(id)
    this.setTotalExp(totalExp)
    this.setHp(hp)
    this.setLevel(level)
    this.setPet(pet)
    this.setGuilds(guilds)
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

  getGuilds() {
    return [...this.guilds]
  }
  private setGuilds(guilds: Guild[]) {
    this.guilds = [...guilds]
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

  // 加入公會
  joinGuild(guild: Guild) {
    const exists = this.guilds.some((item) => item.getId() === guild.getId())

    if (exists) return

    this.guilds.push(guild)
  }

  // 離開公會
  leaveGuild(guild: Guild) {
    const exists = this.guilds.some((item) => item.getId() === guild.getId())

    if (!exists) throw new Error('原本就沒有加入這個公會，不用離開公會')

    this.guilds = this.guilds.filter((item) => {
      return item.getId() !== guild.getId()
    })
  }
}
