import type { FitnessEvaluator } from './FitnessEvaluator'
import type { Gene } from './Gene'

type IndividualConfig = {
  genes: Gene[]
  fitnessEvaluator: FitnessEvaluator
}

export class Individual {
  private genes: Gene[] = []
  private fitness: number
  private fitnessEvaluator: FitnessEvaluator

  constructor({ genes = [], fitnessEvaluator }: IndividualConfig) {
    this.genes = [...genes]
    this.fitnessEvaluator = fitnessEvaluator
    this.fitness = fitnessEvaluator.evaluate({ genes: this.getGenes() })
  }

  getGenes(): Gene[] {
    return [...this.genes]
  }

  getFitness(): number {
    return this.fitness
  }

  getFitnessEvaluator(): FitnessEvaluator {
    return this.fitnessEvaluator
  }
}
