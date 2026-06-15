import type { Fruit } from '../../Fruit/Fruit'
import type { Pet } from '../Pet'

type Input = {
  pet: Pet
  fruit: Fruit
}

export class EatUseCase {
  execute({ pet, fruit }: Input) {
    pet.eat(fruit)
    const hero = pet.getOwner()
    if (hero) {
      hero.setHp(hero.getHp() + 10)
    }
  }
}
