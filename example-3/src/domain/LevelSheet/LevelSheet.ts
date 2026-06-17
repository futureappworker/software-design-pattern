import { shouldBeGreaterThanOrEqual } from '../../utils/shouldBeGreaterThanOrEqual'

export class LevelSheet {
  queryLevel(totalExp: number): number {
    shouldBeGreaterThanOrEqual({
      name: 'totalExp',
      num: totalExp,
      target: 0,
    })
    return Math.floor(totalExp / 1000) + 1
  }
}
