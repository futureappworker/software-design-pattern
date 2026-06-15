import type { LevelSheet } from '../../LevelSheet/LevelSheet'
import type { Hero } from '../Hero'

type Input = {
  hero: Hero
  exp: number
}

export class GainExpUseCase {
  constructor(private readonly levelSheet: LevelSheet) {}
  execute({ hero, exp }: Input) {
    hero.gainExp(exp, this.levelSheet)
  }
}
