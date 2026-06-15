import { LevelSheet } from '../LevelSheet'

type Input = {
  totalExp: number
}

export class queryLevelUseCase {
  execute({ totalExp }: Input) {
    const levelSheet = new LevelSheet()
    return levelSheet.queryLevel(totalExp)
  }
}
