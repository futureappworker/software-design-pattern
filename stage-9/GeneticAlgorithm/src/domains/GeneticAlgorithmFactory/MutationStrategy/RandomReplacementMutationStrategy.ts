import { Individual } from '../../Individual'
import { Population } from '../../Population'
import type { MutationStrategy } from './MutationStrategy'

export class RandomReplacementMutationStrategy implements MutationStrategy {
  perform(population: Population): Population {
    // 隨機替換變異策略
    // 對染色體中的一個或多個基因「隨機地」替換成新的基因值

    const individuals = population.getIndividuals()
    const genePool = individuals.flatMap((individual) => individual.getGenes())

    if (genePool.length === 0) {
      return new Population({ individuals })
    }

    const mutatedIndividuals = individuals.map((individual) => {
      const genes = [...individual.getGenes()]

      if (genes.length === 0) {
        return individual
      }

      const mutationCount = Math.floor(Math.random() * genes.length) + 1
      const mutatedIndexes = new Set<number>()

      while (mutatedIndexes.size < mutationCount) {
        mutatedIndexes.add(Math.floor(Math.random() * genes.length))
      }

      for (const index of mutatedIndexes) {
        genes[index] = genePool[Math.floor(Math.random() * genePool.length)]
      }

      return new Individual({
        genes,
        fitnessEvaluator: individual.getFitnessEvaluator(),
      })
    })

    return new Population({
      individuals: mutatedIndividuals,
    })
  }
}
