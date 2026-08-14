import type { FitnessEvaluator, Gene } from '../../../GeneticAlgorithm/src'
import type { ShoppingClient } from './ShoppingClient'
import { ShoppingGene } from './ShoppingGene'
import type { ShoppingProduct } from './ShoppingProduct'

type ShoppingFitnessEvaluatorConfig = {
  client: ShoppingClient
  products: ShoppingProduct[]
}

export class ShoppingFitnessEvaluator implements FitnessEvaluator {
  private client: ShoppingClient
  private products: ShoppingProduct[]

  constructor({ client, products }: ShoppingFitnessEvaluatorConfig) {
    this.client = client
    this.products = [...products]
  }

  getClient(): ShoppingClient {
    return this.client
  }

  getProducts(): ShoppingProduct[] {
    return [...this.products]
  }

  getProductById(id: string): ShoppingProduct | undefined {
    return this.products.find((product) => product.getId() === id)
  }

  evaluate({ genes }: { genes: Gene[] }): number {
    // 在預算和重量限制內，買到越多自己喜歡的商品越好（同一商品可多件）
    // 同一商品每多一件，邊際喜好分數遞減（第 n 件 = 喜好 / n）
    const quantityByProductId = new Map<string, number>()

    for (const gene of genes) {
      if (!(gene instanceof ShoppingGene) || gene.getQuantity() <= 0) {
        continue
      }

      quantityByProductId.set(
        gene.getProductId(),
        (quantityByProductId.get(gene.getProductId()) ?? 0) +
          gene.getQuantity(),
      )
    }

    let totalPrice = 0
    let totalWeight = 0
    let totalPreferenceScore = 0

    for (const [productId, quantity] of quantityByProductId) {
      const product = this.getProductById(productId)

      if (!product) {
        continue
      }

      totalPrice += product.getPrice() * quantity
      totalWeight += product.getWeight() * quantity

      const preference = this.client.getPreference(product.getCategory())
      for (let n = 1; n <= quantity; n++) {
        totalPreferenceScore += preference / n
      }
    }

    if (totalPrice > this.client.getBudget()) {
      return 0
    }

    if (totalWeight > this.client.getCapacity()) {
      return 0
    }

    return totalPreferenceScore
  }
}
