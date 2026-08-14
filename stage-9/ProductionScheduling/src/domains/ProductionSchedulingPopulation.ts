import { Population } from '../../../GeneticAlgorithm/src'
import type { ProductionSchedulingIndividual } from './ProductionSchedulingIndividual'

export class ProductionSchedulingPopulation extends Population {
  constructor(individuals: ProductionSchedulingIndividual[]) {
    super({ individuals })
  }
}
