import { nanoid } from 'nanoid'
import { describe, expect, it } from 'vitest'
import { Pet } from '../../Pet/Pet'
import { Hero } from '../Hero'
import { AdoptPetUseCase } from './AdoptPet.usecase'

describe('adopt-pet.usecase', () => {
  it('當 hero 領養寵物時, 應該 hero 有寵物, 寵物的主人也是 hero', () => {
    const hero = new Hero({
      id: nanoid(),
    })
    const pet = new Pet({
      id: nanoid(),
      name: 'Kitty',
    })
    const useCase = new AdoptPetUseCase()

    useCase.execute({
      hero,
      pet,
    })

    expect(hero.getPet()).toBe(pet)
    expect(pet.getOwner()).toBe(hero)
  })

  it('當 hero 已經領養寵物時, 應該拋出錯誤', () => {
    const hero = new Hero({
      id: nanoid(),
    })
    const pet = new Pet({
      id: nanoid(),
      name: 'Kitty',
    })
    const useCase = new AdoptPetUseCase()

    useCase.execute({
      hero,
      pet,
    })

    const otherPet = new Pet({
      id: nanoid(),
      name: 'Jacky',
    })

    expect(() => {
      useCase.execute({
        hero,
        pet: otherPet,
      })
    }).toThrow('請先棄養寵物')
  })
})
