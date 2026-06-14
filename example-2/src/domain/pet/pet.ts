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
  private owner: Hero | null = null

  constructor({ id, name, hero }: PetProps) {
    this.setId(id)
    this.setName(name)
    this.setOwner(hero)
  }

  getId() {
    return this.id
  }
  private setId(id: string) {
    this.id = id
  }

  getOwner() {
    return this.owner
  }
  private setOwner(hero: Hero | null) {
    this.owner = hero
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
    this.setOwner(hero)
  }

  // 移除主人
  removeOwner() {
    this.setOwner(null)
  }
}
