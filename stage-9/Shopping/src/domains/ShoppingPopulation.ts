import { Population } from '../../../GeneticAlgorithm/src'
import type { ShoppingIndividual } from './ShoppingIndividual'

export class ShoppingPopulation extends Population {
  constructor({
    individuals,
  }: {
    individuals: ShoppingIndividual[]
  }) {
    super({ individuals })
  }
}
