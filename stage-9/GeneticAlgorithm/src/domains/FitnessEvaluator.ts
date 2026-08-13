import type { Gene } from './Gene'

export interface FitnessEvaluator {
  evaluate({ genes }: { genes: Gene[] }): number
}
