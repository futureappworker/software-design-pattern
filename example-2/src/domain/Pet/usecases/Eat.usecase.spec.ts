import { nanoid } from 'nanoid'
import { describe, expect, it } from 'vitest'
import { Fruit } from '../../Fruit/Fruit'
import { Hero } from '../../Hero/Hero'
import { AdoptPetUseCase } from '../../Hero/usecases/AdoptPet.usecase'
import { Pet } from '../Pet'
import { EatUseCase } from './Eat.usecase'

describe('eat.usecase', () => {
  it('當寵物吃水果時, 應該 hero 的 hp +10', () => {
    const hero = new Hero({
      id: nanoid(),
    })
    const beforeHp = hero.getHp()
    const pet = new Pet({
      id: nanoid(),
      name: 'Kitty',
    })

    // 領養寵物
    const adoptPetUseCase = new AdoptPetUseCase()
    adoptPetUseCase.execute({
      hero,
      pet,
    })

    const eatUseCase = new EatUseCase()
    const fruit = new Fruit()

    // 寵物吃水果
    eatUseCase.execute({
      pet,
      fruit,
    })
    expect(beforeHp + 10).toBe(hero.getHp())
  })
})
