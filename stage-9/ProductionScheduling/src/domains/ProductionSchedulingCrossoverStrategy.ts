import type {
  CrossoverStrategy,
  Population as PopulationType,
} from '../../../GeneticAlgorithm/src'
import { Individual, Population } from '../../../GeneticAlgorithm/src'
import { ProductionSchedulingFitnessEvaluator } from './ProductionSchedulingFitnessEvaluator'
import { ProductionSchedulingGene } from './ProductionSchedulingGene'
import { repairProductionSchedulingGenes } from './repairProductionSchedulingGenes'

export class ProductionSchedulingCrossoverStrategy
  implements CrossoverStrategy
{
  perform(population: PopulationType): Population {
    // 一點交配後修復各產品產量，確保仍滿足客戶需求
    const candidates = [...population.getIndividuals()]
    const offspring: Individual[] = []

    while (candidates.length >= 2) {
      const index1 = Math.floor(Math.random() * candidates.length)
      const parent1 = candidates.splice(index1, 1)[0]

      const index2 = Math.floor(Math.random() * candidates.length)
      const parent2 = candidates.splice(index2, 1)[0]

      const fitnessEvaluator = parent1.getFitnessEvaluator()

      if (!(fitnessEvaluator instanceof ProductionSchedulingFitnessEvaluator)) {
        offspring.push(parent1, parent2)
        continue
      }

      const genes1 = parent1.getGenes()
      const genes2 = parent2.getGenes()
      const crossoverPoint = Math.floor(Math.random() * genes1.length)

      const offspring1Genes = repairProductionSchedulingGenes({
        genes: [
          ...genes1.slice(0, crossoverPoint),
          ...genes2.slice(crossoverPoint),
        ].filter(
          (gene): gene is ProductionSchedulingGene =>
            gene instanceof ProductionSchedulingGene,
        ),
        products: fitnessEvaluator.getProducts(),
        company: fitnessEvaluator.getCompany(),
      })

      const offspring2Genes = repairProductionSchedulingGenes({
        genes: [
          ...genes2.slice(0, crossoverPoint),
          ...genes1.slice(crossoverPoint),
        ].filter(
          (gene): gene is ProductionSchedulingGene =>
            gene instanceof ProductionSchedulingGene,
        ),
        products: fitnessEvaluator.getProducts(),
        company: fitnessEvaluator.getCompany(),
      })

      offspring.push(
        new Individual({
          genes: offspring1Genes,
          fitnessEvaluator,
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
