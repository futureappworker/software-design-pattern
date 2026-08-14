import { nanoid } from 'nanoid'
import type {
  CreateInitialPopulationFactory,
  Population,
} from '../../../GeneticAlgorithm/src'
import { shouldBeGreaterThanOrEqual } from '../utils/shouldBeGreaterThanOrEqual'
import type { ShoppingClient } from './ShoppingClient'
import type { ShoppingFitnessEvaluator } from './ShoppingFitnessEvaluator'
import { ShoppingGene } from './ShoppingGene'
import { ShoppingIndividual } from './ShoppingIndividual'
import { ShoppingPopulation } from './ShoppingPopulation'
import type { ShoppingProduct } from './ShoppingProduct'

type ShoppingCreateInitialPopulationFactoryConfig = {
  client: ShoppingClient
  products: ShoppingProduct[]
  fitnessEvaluator: ShoppingFitnessEvaluator
  populationSize?: number
}

export class ShoppingCreateInitialPopulationFactory
  implements CreateInitialPopulationFactory
{
  private client: ShoppingClient
  private products: ShoppingProduct[]
  private fitnessEvaluator: ShoppingFitnessEvaluator
  private populationSize: number = 20

  constructor({
    client,
    products,
    fitnessEvaluator,
    populationSize = 20,
  }: ShoppingCreateInitialPopulationFactoryConfig) {
    this.client = client
    this.products = [...products]
    this.fitnessEvaluator = fitnessEvaluator
    this.populationSize = populationSize
  }

  setPopulationSize(populationSize: number): void {
    shouldBeGreaterThanOrEqual({
      name: 'populationSize',
      num: populationSize,
      target: 1,
    })
    this.populationSize = populationSize
  }

  perform(): Population {
    const individuals: ShoppingIndividual[] = []

    for (let i = 0; i < this.populationSize; i++) {
      individuals.push(
        new ShoppingIndividual({
          genes: this.createGenes(),
          fitnessEvaluator: this.fitnessEvaluator,
        }),
      )
    }

    return new ShoppingPopulation({ individuals })
  }

  private createGenes(): ShoppingGene[] {
    const budget = this.client.getBudget()
    const capacity = this.client.getCapacity()
    const resultProducts: ShoppingProduct[] = []
    let currentTotalPrice = 0
    let currentTotalWeight = 0

    // 依 喜好度 比例，隨機找出某個產品
    // 加入到 清單中，直到 預算 or 承載重量 不足為止
    while (true) {
      const affordableProducts = this.products.filter(
        (product) =>
          currentTotalPrice + product.getPrice() <= budget &&
          currentTotalWeight + product.getWeight() <= capacity,
      )

      if (affordableProducts.length === 0) {
        break
      }

      const product = this.pickProductByPreference(affordableProducts)
      resultProducts.push(product)
      currentTotalPrice += product.getPrice()
      currentTotalWeight += product.getWeight()
    }

    const quantityByProductId = new Map<string, number>()

    for (const product of resultProducts) {
      quantityByProductId.set(
        product.getId(),
        (quantityByProductId.get(product.getId()) ?? 0) + 1,
      )
    }

    return [...quantityByProductId.entries()].map(
      ([productId, quantity]) =>
        new ShoppingGene({
          id: nanoid(),
          productId,
          quantity,
        }),
    )
  }

  private pickProductByPreference(
    products: ShoppingProduct[],
  ): ShoppingProduct {
    const weights = products.map((product) =>
      this.client.getPreference(product.getCategory()),
    )
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)

    if (totalWeight <= 0) {
      return products[Math.floor(Math.random() * products.length)]
    }

    let roll = Math.random() * totalWeight

    for (let i = 0; i < products.length; i++) {
      roll -= weights[i]
      if (roll <= 0) {
        return products[i]
      }
    }

    return products[products.length - 1]
  }
}
