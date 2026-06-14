import type { LevelSheet } from '../../level-sheet/level-sheet'
import type { Hero } from '../hero'

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
