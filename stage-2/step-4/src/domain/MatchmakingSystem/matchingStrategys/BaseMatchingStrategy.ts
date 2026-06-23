import type { Individual } from '../../Individual/Individual'
import type { MatchingResult, MatchingStrategy } from '../MatchingStrategy'

export abstract class BaseMatchingStrategy implements MatchingStrategy {
  match(individuals: Individual[]): MatchingResult {
    return individuals.map((individual) => ({
      individualId: individual.getId(),
      candidateIds: individuals
        .filter((other) => other.getId() !== individual.getId())
        .sort((a, b) => {
          const comparison = this.compareCandidates(individual, a, b)

          if (comparison !== 0) {
            return comparison
          }

          return a.getId() - b.getId()
        })
        .map((other) => other.getId()),
    }))
  }

  protected abstract compareCandidates(
    individual: Individual,
    a: Individual,
    b: Individual,
  ): number
}
