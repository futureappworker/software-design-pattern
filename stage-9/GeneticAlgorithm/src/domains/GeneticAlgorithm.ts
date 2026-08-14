import type { GeneticAlgorithmFactory } from './GeneticAlgorithmFactory/GeneticAlgorithmFactory'
import type { Individual } from './Individual'
import { Population } from './Population'

type GeneticAlgorithmConfig = {
  geneticAlgorithmFactory: GeneticAlgorithmFactory
  maximumNumberOfIterations?: number
}

export class GeneticAlgorithm {
  private readonly geneticAlgorithmFactory: GeneticAlgorithmFactory
  private readonly MAXIMUM_NUMBER_OF_ITERATIONS: number

  constructor({
    geneticAlgorithmFactory,
    maximumNumberOfIterations = 1000,
  }: GeneticAlgorithmConfig) {
    this.geneticAlgorithmFactory = geneticAlgorithmFactory
    this.MAXIMUM_NUMBER_OF_ITERATIONS = maximumNumberOfIterations
  }

  getMaximumNumberOfIterations(): number {
    return this.MAXIMUM_NUMBER_OF_ITERATIONS
  }

  run(): Individual {
    let currentPopulation =
      this.geneticAlgorithmFactory.createInitialPopulation()

    for (let i = 0; i < this.MAXIMUM_NUMBER_OF_ITERATIONS; i++) {
      const elite =
        this.geneticAlgorithmFactory.findBestIndividual(currentPopulation)

      // 優勝劣汰：篩選這一代中最優秀的一群個體作為「父母」
      const parents = this.geneticAlgorithmFactory.selection(currentPopulation)
      // 讓這一群父母交配生下新的一代
      const offspring = this.geneticAlgorithmFactory.crossover(parents)
      // 多元化：新的一代中會有基因變異
      const mutated = this.geneticAlgorithmFactory.mutate(offspring)

      // 菁英保留：上一世代最佳個體一定進入下一世代
      const nextIndividuals = [
        elite,
        ...mutated.getIndividuals().slice(0, Math.max(0, mutated.size() - 1)),
      ]
      currentPopulation = new Population({ individuals: nextIndividuals })

      if (
        this.geneticAlgorithmFactory.terminationCondition(currentPopulation)
      ) {
        break
      }
    }

    // 從最終種群中，取得適應度最好的個體
    return this.geneticAlgorithmFactory.findBestIndividual(currentPopulation)
  }
}
