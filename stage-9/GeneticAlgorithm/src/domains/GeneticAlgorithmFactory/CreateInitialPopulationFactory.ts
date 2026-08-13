import type { Population } from '../Population'

export interface CreateInitialPopulationFactory {
  perform(): Population
}
