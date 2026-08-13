import type { Individual } from '../../Individual'

export class IndividualComparator {
  isBetter({
    candidate,
    currentBest,
  }: {
    candidate: Individual
    currentBest: Individual
  }): boolean {
    return candidate.getFitness() > currentBest.getFitness()
  }
}
