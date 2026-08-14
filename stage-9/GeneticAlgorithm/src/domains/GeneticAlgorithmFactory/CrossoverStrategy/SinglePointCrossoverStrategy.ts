import { Individual } from '../../Individual'
import { Population } from '../../Population'
import type { CrossoverStrategy } from './CrossoverStrategy'

export class SinglePointCrossoverStrategy implements CrossoverStrategy {
  perform(population: Population): Population {
    // 一點交配策略
    // 隨機選擇一個交配點（可能是某個索引值）
    // 將兩個個體的基因在此點進行交換

    // 例如
    // Parent 1: 11010101, Parent 2: 00101110
    // 一點交配 (Single-Point Crossover)：
    // 選擇交配點為第四個基因（索引值為 3），將兩個個體在此點進行交換，得到下面的子代：
    // Offspring 1: 11001110 Offspring 2: 00110101

    const candidates = [...population.getIndividuals()]
    const offspring: Individual[] = []

    while (candidates.length >= 2) {
      const index1 = Math.floor(Math.random() * candidates.length)
      const parent1 = candidates.splice(index1, 1)[0]

      const index2 = Math.floor(Math.random() * candidates.length)
      const parent2 = candidates.splice(index2, 1)[0]

      const genes1 = parent1.getGenes()
      const genes2 = parent2.getGenes()
      const crossoverPoint = Math.floor(Math.random() * genes1.length)

      const offspring1Genes = [
        ...genes1.slice(0, crossoverPoint),
        ...genes2.slice(crossoverPoint),
      ]
      const offspring2Genes = [
        ...genes2.slice(0, crossoverPoint),
        ...genes1.slice(crossoverPoint),
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
