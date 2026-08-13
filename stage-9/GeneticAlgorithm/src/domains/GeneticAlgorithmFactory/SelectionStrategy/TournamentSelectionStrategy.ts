import { Population } from '../../Population'
import { SelectionStrategy } from './SelectionStrategy'

export class TournamentSelectionStrategy extends SelectionStrategy {
  perform(population: Population): Population {
    // 錦標賽篩選策略：
    // 將隨機選出的一部分個體進行比較，
    // 選擇適應度最好的個體參與下一代的交配和繁殖

    const candidates = [...population.getIndividuals()]

    const selectedIndividuals = []

    while (candidates.length >= 2) {
      // 隨機選取兩個尚未參加過競賽的個體
      const index1 = Math.floor(Math.random() * candidates.length)
      const individual1 = candidates.splice(index1, 1)[0]

      const index2 = Math.floor(Math.random() * candidates.length)
      const individual2 = candidates.splice(index2, 1)[0]

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
