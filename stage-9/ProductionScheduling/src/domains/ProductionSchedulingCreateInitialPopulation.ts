import { nanoid } from 'nanoid'
import type {
  CreateInitialPopulationFactory,
  Population,
} from '../../../GeneticAlgorithm/src'
import type { Company } from './Company'
import type { ProductionSchedulingFitnessEvaluator } from './ProductionSchedulingFitnessEvaluator'
import { ProductionSchedulingGene } from './ProductionSchedulingGene'
import { ProductionSchedulingIndividual } from './ProductionSchedulingIndividual'
import { ProductionSchedulingPopulation } from './ProductionSchedulingPopulation'
import type { ProductionSchedulingProduct } from './ProductionSchedulingProduct'

type ProductionSchedulingCreateInitialPopulationConfig = {
  company: Company
  products: ProductionSchedulingProduct[]
  fitnessEvaluator: ProductionSchedulingFitnessEvaluator
  populationSize?: number
}

export class ProductionSchedulingCreateInitialPopulation
  implements CreateInitialPopulationFactory
{
  private company: Company
  private products: ProductionSchedulingProduct[]
  private fitnessEvaluator: ProductionSchedulingFitnessEvaluator
  private populationSize: number

  constructor({
    company,
    products,
    fitnessEvaluator,
    populationSize = 20,
  }: ProductionSchedulingCreateInitialPopulationConfig) {
    this.company = company
    this.products = [...products]
    this.fitnessEvaluator = fitnessEvaluator
    this.populationSize = populationSize
  }

  perform(): Population {
    const individuals: ProductionSchedulingIndividual[] = []

    for (let i = 0; i < this.populationSize; i++) {
      individuals.push(
        new ProductionSchedulingIndividual({
          genes: this.createGenes(),
          fitnessEvaluator: this.fitnessEvaluator,
        }),
      )
    }

    return new ProductionSchedulingPopulation(individuals)
  }

  private createGenes(): ProductionSchedulingGene[] {
    const genes: ProductionSchedulingGene[] = []
    const machineIds = this.company.getMachineIds()
    const workerIds = this.company.getWorkerIds()
    // 可並行產線數；每條產線固定綁定一台機器 + 一名工人，避免資源互相卡住
    const parallelSlots = Math.min(machineIds.length, workerIds.length)

    for (const [
      productName,
      requiredQuantity,
    ] of this.company.getRequiredQuantityMap()) {
      const product = this.products.find(
        (candidate) => candidate.getName() === productName,
      )

      if (!product) {
        continue
      }

      const quantities = this.splitQuantity({
        total: requiredQuantity,
        parts: parallelSlots,
      })

      quantities.forEach((quantity, slot) => {
        if (quantity <= 0) {
          return
        }

        genes.push(
          new ProductionSchedulingGene({
            id: nanoid(),
            productId: product.getId(),
            machineId: machineIds[slot],
            workerId: workerIds[slot],
            quantity,
          }),
        )
      })
    }

    return genes
  }

  private splitQuantity({
    total,
    parts,
  }: {
    total: number
    parts: number
  }): number[] {
    if (parts <= 0) {
      return [total]
    }

    const base = Math.floor(total / parts)
    let remainder = total % parts
    const quantities: number[] = []

    for (let i = 0; i < parts; i++) {
      const extra = remainder > 0 ? 1 : 0
      if (remainder > 0) {
        remainder -= 1
      }
      quantities.push(base + extra)
    }

    // 輕微隨機重分配，維持總和與可並行拆分
    for (let i = 0; i < parts; i++) {
      const from = Math.floor(Math.random() * parts)
      const to = Math.floor(Math.random() * parts)
      if (from === to || quantities[from] <= 1) {
        continue
      }
      const move = Math.floor(Math.random() * (quantities[from] - 1)) + 1
      quantities[from] -= move
      quantities[to] += move
    }

    return quantities
  }
}
