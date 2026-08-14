import { Individual } from '../../Individual'
import { Population } from '../../Population'
import type { MutationStrategy } from './MutationStrategy'

export class InversionMutationStrategy implements MutationStrategy {
  perform(population: Population): Population {
    // 反轉操作變異策略
    // 將染色體中的一段連續的基因反轉過來
    // 例如，如果一段染色體的基因序列為「001011101」，反轉後就會變成「110100010」

    const mutatedIndividuals = population.getIndividuals().map((individual) => {
      const genes = [...individual.getGenes()]

      if (genes.length < 2) {
        return individual
      }

      let point1 = Math.floor(Math.random() * genes.length)
      let point2 = Math.floor(Math.random() * genes.length)

      if (point1 > point2) {
        ;[point1, point2] = [point2, point1]
      }

      const invertedSegment = genes.slice(point1, point2 + 1).reverse()
      genes.splice(point1, invertedSegment.length, ...invertedSegment)

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
