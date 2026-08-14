import { Individual } from '../../../GeneticAlgorithm/src'
import type { ShoppingFitnessEvaluator } from './ShoppingFitnessEvaluator'
import type { ShoppingGene } from './ShoppingGene'

export class ShoppingIndividual extends Individual {
  constructor({
    genes,
    fitnessEvaluator,
  }: {
    genes: ShoppingGene[]
    fitnessEvaluator: ShoppingFitnessEvaluator
  }) {
    super({ genes, fitnessEvaluator })
  }
}
