import type { Population } from '../Population'
import type { CreateInitialPopulationFactory } from './CreateInitialPopulationFactory'
import type { SelectionStrategy } from './SelectionStrategy/SelectionStrategy'

type GeneticAlgorithmFactoryConfig = {
  createInitialPopulationFactory: CreateInitialPopulationFactory
  selectionStrategy: SelectionStrategy
}

export class GeneticAlgorithmFactory {
  private readonly createInitialPopulationFactory: CreateInitialPopulationFactory
  private readonly selectionStrategy: SelectionStrategy

  constructor({
    createInitialPopulationFactory,
    selectionStrategy,
  }: GeneticAlgorithmFactoryConfig) {
    this.createInitialPopulationFactory = createInitialPopulationFactory
    this.selectionStrategy = selectionStrategy
  }

  createInitialPopulation(): Population {
    return this.createInitialPopulationFactory.perform()
  }

  selection(population: Population): Population {
    return this.selectionStrategy.perform(population)
  }
}
