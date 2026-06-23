import type { Individual } from '../Individual/Individual'
import type { MatchingResult, MatchingStrategy } from './MatchingStrategy'

type MatchmakingSystemProps = {
  matchingStrategy: MatchingStrategy
}

export class MatchmakingSystem {
  private matchingStrategy: MatchingStrategy

  constructor({ matchingStrategy }: MatchmakingSystemProps) {
    this.matchingStrategy = matchingStrategy
  }

  match(individuals: Individual[]): MatchingResult {
    return this.matchingStrategy.match(individuals)
  }
}
