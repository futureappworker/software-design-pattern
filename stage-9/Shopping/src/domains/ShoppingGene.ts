import type { Gene } from '../../../GeneticAlgorithm/src'
import { shouldBeGreaterThanOrEqual } from '../utils/shouldBeGreaterThanOrEqual'

type ShoppingGeneConfig = {
  id: string
  productId: string
  quantity: number
}

export class ShoppingGene implements Gene {
  id: string
  private productId: string
  private quantity: number

  constructor({ id, productId, quantity }: ShoppingGeneConfig) {
    this.id = id
    this.productId = productId
    this.quantity = quantity
  }

  getProductId(): string {
    return this.productId
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
