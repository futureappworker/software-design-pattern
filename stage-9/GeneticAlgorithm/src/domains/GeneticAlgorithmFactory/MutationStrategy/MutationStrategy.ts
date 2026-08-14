import type { Population } from '../../Population'

export interface MutationStrategy {
  perform(population: Population): Population
}
