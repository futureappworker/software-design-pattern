import { Individual } from '../../../GeneticAlgorithm/src'
import type { ProductionSchedulingFitnessEvaluator } from './ProductionSchedulingFitnessEvaluator'
import type { ProductionSchedulingGene } from './ProductionSchedulingGene'

export class ProductionSchedulingIndividual extends Individual {
  constructor({
    genes,
    fitnessEvaluator,
  }: {
    genes: ProductionSchedulingGene[]
    fitnessEvaluator: ProductionSchedulingFitnessEvaluator
  }) {
    super({ genes, fitnessEvaluator })
  }
}
