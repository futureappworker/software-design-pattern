import { nanoid } from 'nanoid'
import { describe, expect, it } from 'vitest'
import { Pet } from '../../pet/pet'
import { Hero } from '../hero'
import { AdoptPetUseCase } from './adopt-pet.usecase'

describe('adopt-pet.usecase', () => {
  it('當 hero 領養寵物時, 應該 hero 有寵物, 寵物的主人也是 hero', () => {
    const hero = new Hero({
      id: nanoid(),
      pet: null,
    })
    const pet = new Pet({
      id: nanoid(),
      name: 'Kitty',
      hero: null,
    })
    const useCase = new AdoptPetUseCase()

    useCase.execute({
      hero,
      pet,
    })

    expect(hero.getPet()).toBe(pet)
    expect(pet.getHero()).toBe(hero)
  })

  it('當 hero 已經領養寵物時, 應該拋出錯誤', () => {
    const hero = new Hero({
      id: nanoid(),
      pet: null,
    })
    const pet = new Pet({
      id: nanoid(),
      name: 'Kitty',
      hero: null,
    })
    const useCase = new AdoptPetUseCase()

    useCase.execute({
      hero,
      pet,
    })

    const otherPet = new Pet({
      id: nanoid(),
      name: 'Jacky',
      hero: null,
    })

    expect(() => {
      useCase.execute({
        hero,
        pet: otherPet,
      })
    }).toThrow('請先棄養寵物')
  })
})
