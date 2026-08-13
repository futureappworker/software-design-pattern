import type { Individual } from './Individual'

type PopulationConfig = {
  individuals: Individual[]
}

export class Population {
  private individuals: Individual[] = []

  constructor({ individuals = [] }: PopulationConfig) {
    this.individuals = [...individuals]
  }

  getIndividuals(): Individual[] {
    return [...this.individuals]
  }

  size(): number {
    return this.individuals.length
  }
}
