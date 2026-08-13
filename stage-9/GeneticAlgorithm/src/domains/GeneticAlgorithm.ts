import type { Individual } from './Individual'

type GeneticAlgorithmConfig = {
  maximumNumberOfIterations?: number
}

export class GeneticAlgorithm {
  private readonly MAXIMUM_NUMBER_OF_ITERATIONS: number

  constructor({ maximumNumberOfIterations = 1000 }: GeneticAlgorithmConfig) {
    this.MAXIMUM_NUMBER_OF_ITERATIONS = maximumNumberOfIterations
  }

  getMaximumNumberOfIterations(): number {
    return this.MAXIMUM_NUMBER_OF_ITERATIONS
  }

  run(): Individual {
    // TODO
  }
}
