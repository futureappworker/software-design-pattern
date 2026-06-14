import type { Pet } from '../../pet/pet'
import type { Hero } from '../hero'

type Input = {
  hero: Hero
  pet: Pet
}

export class AdoptPetUseCase {
  execute({ hero, pet }: Input) {
    if (hero.getPet()) throw new Error('請先棄養寵物')

    hero.adoptPet(pet)
    pet.boundOwner(hero)
  }
}
