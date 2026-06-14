import type { Fruit } from '../fruit/fruit'
import type { Hero } from '../hero/hero'

type PetProps = {
  id: string
  name: string
  hero: Hero | null
}

export class Pet {
  private id!: string
  private name!: string
  private hero: Hero | null = null

  constructor({ id, name, hero }: PetProps) {
    this.setId(id)
    this.setName(name)
    this.setHero(hero)
  }

  getId() {
    return this.id
  }
  private setId(id: string) {
    this.id = id
  }

  getHero() {
    return this.hero
  }
  private setHero(hero: Hero | null) {
    this.hero = hero
  }

  getName() {
    return this.name
  }
  private setName(name: string) {
    this.name = name
  }

  eat(fruit: Fruit) {
    if (!fruit) {
      throw new Error('fruit 必傳')
    }
  }

  // 綁定主人
  boundOwner(hero: Hero) {
    this.setHero(hero)
  }

  // 移除主人
  removeOwner() {
    this.setHero(null)
  }
}
