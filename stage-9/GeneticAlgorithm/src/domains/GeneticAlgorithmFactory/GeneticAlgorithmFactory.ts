import type { Individual } from '../Individual'
import type { Population } from '../Population'
import type { CreateInitialPopulationFactory } from './CreateInitialPopulationFactory'
import type { CrossoverStrategy } from './CrossoverStrategy/CrossoverStrategy'
import type { FindBestIndividual } from './FindBestIndividual'
import type { MutationStrategy } from './MutationStrategy/MutationStrategy'
import type { SelectionStrategy } from './SelectionStrategy/SelectionStrategy'
import type { TerminationCondition } from './TerminationCondition'

type GeneticAlgorithmFactoryConfig = {
  createInitialPopulationFactory: CreateInitialPopulationFactory
  selectionStrategy: SelectionStrategy
  crossoverStrategy: CrossoverStrategy
  mutationStrategy: MutationStrategy
  terminationCondition: TerminationCondition
  findBestIndividual: FindBestIndividual
}

export class GeneticAlgorithmFactory {
  private readonly createInitialPopulationFactory: CreateInitialPopulationFactory
  private readonly selectionStrategy: SelectionStrategy
  private readonly crossoverStrategy: CrossoverStrategy
  private readonly mutationStrategy: MutationStrategy
  private readonly terminationConditionStrategy: TerminationCondition
  private readonly findBestIndividualStrategy: FindBestIndividual

  constructor({
    createInitialPopulationFactory,
    selectionStrategy,
    crossoverStrategy,
    mutationStrategy,
    terminationCondition,
    findBestIndividual,
  }: GeneticAlgorithmFactoryConfig) {
    this.createInitialPopulationFactory = createInitialPopulationFactory
    this.selectionStrategy = selectionStrategy
    this.crossoverStrategy = crossoverStrategy
    this.mutationStrategy = mutationStrategy
    this.terminationConditionStrategy = terminationCondition
    this.findBestIndividualStrategy = findBestIndividual
  }

  createInitialPopulation(): Population {
    return this.createInitialPopulationFactory.perform()
  }

  selection(population: Population): Population {
    return this.selectionStrategy.perform(population)
  }

  crossover(population: Population): Population {
    return this.crossoverStrategy.perform(population)
  }

  mutate(population: Population): Population {
    return this.mutationStrategy.perform(population)
  }

  terminationCondition(population: Population): boolean {
    return this.terminationConditionStrategy.shouldTerminate(population)
  }

  findBestIndividual(population: Population): Individual {
    return this.findBestIndividualStrategy.perform(population)
  }
}
