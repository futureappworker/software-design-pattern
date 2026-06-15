import { nanoid } from 'nanoid'
import { describe, expect, it } from 'vitest'
import { Pet } from '../../Pet/Pet'
import { Hero } from '../Hero'
import { AbandonPetUseCase } from './AbandonPet.usecase'
import { AdoptPetUseCase } from './AdoptPet.usecase'

describe('abandon-pet.usecase', () => {
  it('當 hero 原本沒有寵物時, 應該拋出錯誤', () => {
    const hero = new Hero({
      id: nanoid(),
    })
    const useCase = new AbandonPetUseCase()

    expect(() => {
      useCase.execute({
        hero,
      })
    }).toThrow('原本就沒有寵物，不用棄養寵物')
  })

  it('當 hero 原本有寵物時, 應該能棄養寵物', () => {
    const hero = new Hero({
      id: nanoid(),
    })
    const pet = new Pet({
      id: nanoid(),
      name: 'Kitty',
    })
    const adoptPetUseCase = new AdoptPetUseCase()

    // 先領養寵物
    adoptPetUseCase.execute({
      hero,
      pet,
    })

    const abandonPetUseCase = new AbandonPetUseCase()
    // 再棄養寵物
    abandonPetUseCase.execute({
      hero,
    })

    expect(hero.getPet()).toBe(null)
    expect(pet.getOwner()).toBe(null)
  })
})
