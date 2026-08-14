import type { FitnessEvaluator, Gene } from '../../../GeneticAlgorithm/src'
import type { Company } from './Company'
import { ProductionSchedulingGene } from './ProductionSchedulingGene'
import type { ProductionSchedulingProduct } from './ProductionSchedulingProduct'

type ProductionSchedulingFitnessEvaluatorConfig = {
  products: ProductionSchedulingProduct[]
  company: Company
}

export class ProductionSchedulingFitnessEvaluator implements FitnessEvaluator {
  private products: ProductionSchedulingProduct[] = []
  private company: Company

  constructor({
    products,
    company,
  }: ProductionSchedulingFitnessEvaluatorConfig) {
    this.products = [...products]
    this.company = company
  }

  getProducts(): ProductionSchedulingProduct[] {
    return [...this.products]
  }

  getProductById(id: string): ProductionSchedulingProduct | undefined {
    return this.products.find((product) => product.getId() === id)
  }

  getProductByName(name: string): ProductionSchedulingProduct | undefined {
    return this.products.find((product) => product.getName() === name)
  }

  getCompany(): Company {
    return this.company
  }

  /**
   * 依基因順序排程：每台機器、每名工人同時只能處理一個任務。
   * 回傳每個任務的開始／結束時間，以及全部完工時間（makespan）。
   */
  buildSchedule(genes: Gene[]): {
    tasks: Array<{
      gene: ProductionSchedulingGene
      productName: string
      startTime: number
      endTime: number
      duration: number
    }>
    makespan: number
  } {
    const machineAvailableAt = new Map<string, number>()
    const workerAvailableAt = new Map<string, number>()
    const tasks: Array<{
      gene: ProductionSchedulingGene
      productName: string
      startTime: number
      endTime: number
      duration: number
    }> = []
    let makespan = 0

    for (const gene of genes) {
      if (!(gene instanceof ProductionSchedulingGene)) {
        continue
      }

      const product = this.getProductById(gene.getProductId())

      if (!product || gene.getQuantity() <= 0) {
        continue
      }

      const duration = product.getProductionTime() * gene.getQuantity()
      const machineId = gene.getMachineId()
      const workerId = gene.getWorkerId()

      const startTime = Math.max(
        machineAvailableAt.get(machineId) ?? 0,
        workerAvailableAt.get(workerId) ?? 0,
      )
      const endTime = startTime + duration

      machineAvailableAt.set(machineId, endTime)
      workerAvailableAt.set(workerId, endTime)
      makespan = Math.max(makespan, endTime)

      tasks.push({
        gene,
        productName: product.getName(),
        startTime,
        endTime,
        duration,
      })
    }

    return { tasks, makespan }
  }

  calculateMakespan(genes: Gene[]): number {
    return this.buildSchedule(genes).makespan
  }

  evaluate({ genes }: { genes: Gene[] }): number {
    // 必須透過基因演算法，將生產時間、機器和工人的使用進行組合，
    // 找到最佳的排程方案，在最短的時間
    // 同時必須滿足客戶需求產量
    // 機器與工人可並行（例如 2 台機器最多同時跑 2 個任務）

    const producedQuantityByProductId = new Map<string, number>()

    for (const gene of genes) {
      if (!(gene instanceof ProductionSchedulingGene)) {
        continue
      }

      const product = this.getProductById(gene.getProductId())

      if (!product) {
        continue
      }

      const quantity = gene.getQuantity()
      producedQuantityByProductId.set(
        product.getId(),
        (producedQuantityByProductId.get(product.getId()) ?? 0) + quantity,
      )
    }

    let shortage = 0
    let overproduction = 0

    for (const [
      productName,
      requiredQuantity,
    ] of this.company.getRequiredQuantityMap()) {
      const product = this.getProductByName(productName)

      if (!product) {
        continue
      }

      const produced = producedQuantityByProductId.get(product.getId()) ?? 0
      shortage += Math.max(0, requiredQuantity - produced)
      overproduction += Math.max(0, produced - requiredQuantity)
    }

    const makespan = this.calculateMakespan(genes)

    // 缺量優先懲罰；超產次之；最後再最小化並行排程完工時間
    const shortagePenalty = shortage * 1_000_000
    const overproductionPenalty = overproduction * 1_000

    return 0 - shortagePenalty - overproductionPenalty - makespan
  }
}
