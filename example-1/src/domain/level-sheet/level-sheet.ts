export class LevelSheet {
  queryLevel(totalExp: number): number {
    if (totalExp < 0) {
      throw new Error('totalExp 必須 >= 0')
    }
    return Math.floor(totalExp / 1000) + 1
  }
}
