import type { Fruit } from '../domain/fruit/fruit'
import type { Pet } from '../domain/pet/pet'

type Input = {
  pet: Pet
  fruit: Fruit
}

export class PetEatFruitUseCase {
  execute({ pet, fruit }: Input) {
    if (!pet) throw new Error('pet 必傳')
    if (!fruit) throw new Error('fruit 必傳')

    pet.eat(fruit)

    const hero = pet.getHero()

    // pet 有 主人 的話，主人 加 10 血
    if (hero) {
      hero.gainHp(10)
    }
  }
}
