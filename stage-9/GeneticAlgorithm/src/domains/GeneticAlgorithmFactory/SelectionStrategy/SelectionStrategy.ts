import type { Individual } from '../../Individual'
import type { Population } from '../../Population'
import type { IndividualComparator } from './IndividualComparator'

type SelectionStrategyConfig = {
  individualComparator: IndividualComparator
}

export abstract class SelectionStrategy {
  abstract perform(population: Population): Population
  private individualComparator: IndividualComparator

  constructor({ individualComparator }: SelectionStrategyConfig) {
    this.individualComparator = individualComparator
  }

  isBetter({
    candidate,
    currentBest,
  }: {
    candidate: Individual
    currentBest: Individual
  }): boolean {
    return this.individualComparator.isBetter({ candidate, currentBest })
  }
}
