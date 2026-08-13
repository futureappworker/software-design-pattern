import { Population } from '../../Population'
import { SelectionStrategy } from './SelectionStrategy'

export class RankSelectionStrategy extends SelectionStrategy {
  // 排序篩選策略：
  // 將個體根據適應度從大到小排序，
  // 然後根據每個個體的排名進行抽籤，
  // 選取個體參與下一代的交配和繁殖
  perform(population: Population): Population {
    const candidates = [...population.getIndividuals()].sort((a, b) => {
      if (this.isBetter({ candidate: a, currentBest: b })) {
        return -1
      }

      if (this.isBetter({ candidate: b, currentBest: a })) {
        return 1
      }

      return 0
    })

    const selectedIndividuals = []

    const selectionSize = Math.floor(candidates.length / 2)

    const totalRank = (candidates.length * (candidates.length + 1)) / 2

    for (let i = 0; i < selectionSize; i++) {
      const random = Math.random() * totalRank

      let accumulatedRank = 0

      for (let j = 0; j < candidates.length; j++) {
        // 排名越前面，權重越高
        const rank = candidates.length - j

        accumulatedRank += rank

        if (random < accumulatedRank) {
          selectedIndividuals.push(candidates[j])
          break
        }
      }
    }

    return new Population({
      individuals: selectedIndividuals,
    })
  }
}
