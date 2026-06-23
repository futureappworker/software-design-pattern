import type { Individual } from '../Individual/Individual'

export type MatchRanking = {
  individualId: number
  candidateIds: number[]
}

export type MatchingResult = MatchRanking[]

export interface MatchingStrategy {
  match(individuals: Individual[]): MatchingResult
}
