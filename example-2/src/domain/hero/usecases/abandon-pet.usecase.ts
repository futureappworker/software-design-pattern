import type { Hero } from '../hero'

type Input = {
  hero: Hero
}

export class AbandonPetUseCase {
  execute({ hero }: Input) {
    const pet = hero.getPet()
    if (!pet) throw new Error('原本就沒有寵物，不用棄養寵物')
    if (pet) pet.removeOwner()
    hero.abandonPet()
  }
}
