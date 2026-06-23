import type { Individual } from '../../../Individual/Individual'
import { BaseMatchingStrategy } from '../BaseMatchingStrategy'

export class DistanceBasedMatchingStrategy extends BaseMatchingStrategy {
  protected compareCandidates(
    individual: Individual,
    a: Individual,
    b: Individual,
  ) {
    const x = individual.getCoord().getX()
    const y = individual.getCoord().getY()

    return this.getDistance(x, y, a) - this.getDistance(x, y, b)
  }

  private getDistance(x: number, y: number, other: Individual) {
    const otherX = other.getCoord().getX()
    const otherY = other.getCoord().getY()

    return Math.sqrt((otherX - x) ** 2 + (otherY - y) ** 2)
  }
}
