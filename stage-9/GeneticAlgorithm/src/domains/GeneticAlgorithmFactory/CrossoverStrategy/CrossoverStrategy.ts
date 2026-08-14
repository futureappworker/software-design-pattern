import type { Population } from '../../Population'

export interface CrossoverStrategy {
  perform(population: Population): Population
}
