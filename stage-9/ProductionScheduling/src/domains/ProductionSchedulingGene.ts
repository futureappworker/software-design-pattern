import type { Gene } from '../../../GeneticAlgorithm/src'
import { shouldBeGreaterThanOrEqual } from '../utils/shouldBeGreaterThanOrEqual'

type ProductionSchedulingGeneConfig = {
  id: string
  productId: string
  machineId: string
  workerId: string
  quantity: number
}

export class ProductionSchedulingGene implements Gene {
  id: string
  private productId: string
  private machineId: string
  private workerId: string
  private quantity: number = 0

  constructor({
    id,
    productId,
    machineId,
    workerId,
    quantity,
  }: ProductionSchedulingGeneConfig) {
    this.id = id
    this.productId = productId
    this.machineId = machineId
    this.workerId = workerId
    this.setQuantity(quantity)
  }

  getId(): string {
    return this.id
  }

  getProductId(): string {
    return this.productId
  }

  getMachineId(): string {
    return this.machineId
  }

  getWorkerId(): string {
    return this.workerId
  }

  getQuantity(): number {
    return this.quantity
  }

  setQuantity(quantity: number): void {
    // 必須大於等於 0
    shouldBeGreaterThanOrEqual({
      name: 'quantity',
      num: quantity,
      target: 0,
    })
    this.quantity = quantity
  }
}
