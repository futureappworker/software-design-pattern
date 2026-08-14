import { Individual } from '../../Individual'
import { Population } from '../../Population'
import type { CrossoverStrategy } from './CrossoverStrategy'

export class TwoPointCrossoverStrategy implements CrossoverStrategy {
  perform(population: Population): Population {
    // 雙點交配策略
    // 隨機選擇兩個交配點
    // 將兩個個體的基因在這兩點之間的區間進行交換

    // 例如
    // Parent 1: 11010101, Parent 2: 00101110
    // 雙點交配 (Two-Point Crossover)：
    // 選擇交配點為第二個和第七個基因（索引值為 1 和 6 ），將兩個個體在這兩點之間的區間進行交換，得到下面的子代：
    // Offspring 1: 11101110 Offspring 2: 00010101

    const candidates = [...population.getIndividuals()]
    const offspring: Individual[] = []

    while (candidates.length >= 2) {
      const index1 = Math.floor(Math.random() * candidates.length)
      const parent1 = candidates.splice(index1, 1)[0]

      const index2 = Math.floor(Math.random() * candidates.length)
      const parent2 = candidates.splice(index2, 1)[0]

      const genes1 = parent1.getGenes()
      const genes2 = parent2.getGenes()

      let point1 = Math.floor(Math.random() * genes1.length)
      let point2 = Math.floor(Math.random() * genes1.length)

      if (point1 > point2) {
        ;[point1, point2] = [point2, point1]
      }

      const offspring1Genes = [
        ...genes1.slice(0, point1),
        ...genes2.slice(point1, point2),
        ...genes1.slice(point2),
      ]
      const offspring2Genes = [
        ...genes2.slice(0, point1),
        ...genes1.slice(point1, point2),
        ...genes2.slice(point2),
      ]

      offspring.push(
        new Individual({
          genes: offspring1Genes,
          fitnessEvaluator: parent1.getFitnessEvaluator(),
        }),
        new Individual({
          genes: offspring2Genes,
          fitnessEvaluator: parent2.getFitnessEvaluator(),
        }),
      )
    }

    if (candidates.length === 1) {
      offspring.push(candidates[0])
    }

    return new Population({
      individuals: offspring,
    })
  }
}
