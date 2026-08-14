import { Population } from '../../Population'
import { SelectionStrategy } from './SelectionStrategy'

export class TournamentSelectionStrategy extends SelectionStrategy {
  perform(population: Population): Population {
    // 錦標賽篩選策略：
    // 將隨機選出的一部分個體進行比較，
    // 選擇適應度最好的個體參與下一代的交配和繁殖

    const candidates = population.getIndividuals()
    const selectionSize = candidates.length
    const selectedIndividuals = []

    if (selectionSize === 0) {
      return new Population({ individuals: [] })
    }

    while (selectedIndividuals.length < selectionSize) {
      // 隨機選取兩個個體進行競賽（可重複抽樣，以維持族群大小）
      const index1 = Math.floor(Math.random() * candidates.length)
      let index2 = Math.floor(Math.random() * candidates.length)

      while (index2 === index1 && candidates.length > 1) {
        index2 = Math.floor(Math.random() * candidates.length)
      }

      const individual1 = candidates[index1]
      const individual2 = candidates[index2]

      // 比較兩個個體，選出較好的個體
      const winner = this.isBetter({
        candidate: individual1,
        currentBest: individual2,
      })
        ? individual1
        : individual2

      selectedIndividuals.push(winner)
    }

    return new Population({
      individuals: selectedIndividuals,
    })
  }
}
