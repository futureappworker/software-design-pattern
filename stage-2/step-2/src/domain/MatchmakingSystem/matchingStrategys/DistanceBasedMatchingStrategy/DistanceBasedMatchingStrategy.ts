import type { Individual } from '../../../Individual/Individual'
import type { MatchingResult, MatchingStrategy } from '../../MatchingStrategy'

export class DistanceBasedMatchingStrategy implements MatchingStrategy {
  match(individuals: Individual[]): MatchingResult {
    return individuals.map((individual) => {
      const x = individual.getCoord().getX()
      const y = individual.getCoord().getY()

      const candidateIds = individuals
        .filter((other) => other.getId() !== individual.getId())
        .sort((a, b) => {
          const distanceA = this.getDistance(x, y, a)
          const distanceB = this.getDistance(x, y, b)

          if (distanceA !== distanceB) {
            return distanceA - distanceB
          }

          return a.getId() - b.getId()
        })
        .map((other) => other.getId())

      return { individualId: individual.getId(), candidateIds }
    })
  }

  private getDistance(x: number, y: number, other: Individual) {
    const otherX = other.getCoord().getX()
    const otherY = other.getCoord().getY()

    return Math.sqrt((otherX - x) ** 2 + (otherY - y) ** 2)
  }
}
