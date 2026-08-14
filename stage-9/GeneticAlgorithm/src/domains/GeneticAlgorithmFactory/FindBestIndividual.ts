import type { Individual } from '../Individual'
import type { Population } from '../Population'

export class FindBestIndividual {
  perform(population: Population): Individual {
    // 尋找最佳個體

    // 預設回傳 fitness 最高的個體
    // 特殊情境可繼承並覆寫 isBetter

    const individuals = population.getIndividuals()

    if (individuals.length === 0) {
      throw new Error('population must not be empty')
    }

    return individuals.reduce((currentBest, candidate) =>
      this.isBetter({ candidate, currentBest }) ? candidate : currentBest,
    )
  }

  protected isBetter({
    candidate,
    currentBest,
  }: {
    candidate: Individual
    currentBest: Individual
  }): boolean {
    return candidate.getFitness() > currentBest.getFitness()
  }
}
