import { Individual } from '../../Individual'
import { Population } from '../../Population'
import type { CrossoverStrategy } from './CrossoverStrategy'

export class UniformCrossoverStrategy implements CrossoverStrategy {
  perform(population: Population): Population {
    // 均勻交配策略
    // 隨機選擇每一個基因
    // 有一半的機率從第一個個體繼承
    // 有一半的機率從第二個個體繼承

    // 例如
    // Parent 1: 11010101, Parent 2: 00101110
    // 均勻交配策略 (Uniform Crossover)：
    // 對於每個基因，有一半的機率從第一個個體繼承，有一半的機率從第二個個體繼承。假設每個基因的機率是50%：
    //Offspring 1: 11011111 Offspring 2: 00100100

    const candidates = [...population.getIndividuals()]
    const offspring: Individual[] = []

    while (candidates.length >= 2) {
      const index1 = Math.floor(Math.random() * candidates.length)
      const parent1 = candidates.splice(index1, 1)[0]

      const index2 = Math.floor(Math.random() * candidates.length)
      const parent2 = candidates.splice(index2, 1)[0]

      const genes1 = parent1.getGenes()
      const genes2 = parent2.getGenes()

      const offspring1Genes = []
      const offspring2Genes = []

      for (let i = 0; i < genes1.length; i++) {
        if (Math.random() < 0.5) {
          offspring1Genes.push(genes1[i])
          offspring2Genes.push(genes2[i])
        } else {
          offspring1Genes.push(genes2[i])
          offspring2Genes.push(genes1[i])
        }
      }

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
