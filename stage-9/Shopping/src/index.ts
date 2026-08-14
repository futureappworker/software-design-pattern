// 所經營的購物網站有以下產品：
// 產品 1：價格 100 元，重量 2 公斤，類別 A。
// 產品 2：價格 200 元，重量 3 公斤，類別 A。
// 產品 3：價格 150 元，重量 5 公斤，類別 B。
// 產品 4：價格 300 元，重量 4 公斤，類別 B。
// 產品 5：價格 180 元，重量 6 公斤，類別 C。
// 產品 6：價格 250 元，重量 7 公斤，類別 C。

import {
  FindBestIndividual,
  GeneticAlgorithm,
  GeneticAlgorithmFactory,
  IndividualComparator,
  RandomReplacementMutationStrategy,
  SinglePointCrossoverStrategy,
  TerminationCondition,
  TournamentSelectionStrategy,
} from '../../GeneticAlgorithm/src'
import { ProductCategory } from './domains/ProductCategory'
import { ShoppingClient } from './domains/ShoppingClient'
import { ShoppingCreateInitialPopulationFactory } from './domains/ShoppingCreateInitialPopulationFactory'
import { ShoppingFitnessEvaluator } from './domains/ShoppingFitnessEvaluator'
import { ShoppingGene } from './domains/ShoppingGene'
import { ShoppingProduct } from './domains/ShoppingProduct'

const products = [
  new ShoppingProduct({
    id: 'product-1',
    price: 100,
    weight: 2,
    category: ProductCategory.A,
  }),
  new ShoppingProduct({
    id: 'product-2',
    price: 200,
    weight: 3,
    category: ProductCategory.A,
  }),
  new ShoppingProduct({
    id: 'product-3',
    price: 150,
    weight: 5,
    category: ProductCategory.B,
  }),
  new ShoppingProduct({
    id: 'product-4',
    price: 300,
    weight: 4,
    category: ProductCategory.B,
  }),
  new ShoppingProduct({
    id: 'product-5',
    price: 180,
    weight: 6,
    category: ProductCategory.C,
  }),
  new ShoppingProduct({
    id: 'product-6',
    price: 250,
    weight: 7,
    category: ProductCategory.C,
  }),
]

// 系統會記載每個客戶對不同類別的產品的喜好度，好比你有一位客戶他的喜好度 (Preference) 如下：
const client = new ShoppingClient({
  budget: 700,
  capacity: 15,
  preferenceMap: new Map([
    [ProductCategory.A, 80],
    [ProductCategory.B, 60],
    [ProductCategory.C, 20],
  ]),
})

const fitnessEvaluator = new ShoppingFitnessEvaluator({
  client,
  products,
})

const createInitialPopulationFactory =
  new ShoppingCreateInitialPopulationFactory({
    client,
    products,
    fitnessEvaluator,
    populationSize: 5,
  })

const geneticAlgorithm = new GeneticAlgorithm({
  geneticAlgorithmFactory: new GeneticAlgorithmFactory({
    createInitialPopulationFactory: createInitialPopulationFactory,
    selectionStrategy: new TournamentSelectionStrategy({
      individualComparator: new IndividualComparator(),
    }),
    crossoverStrategy: new SinglePointCrossoverStrategy(),
    mutationStrategy: new RandomReplacementMutationStrategy(),
    terminationCondition: new TerminationCondition(),
    findBestIndividual: new FindBestIndividual(),
  }),
})

const bestIndividual = geneticAlgorithm.run()

console.log('========== 推薦購物清單 ==========')

let totalPrice = 0
let totalWeight = 0
let itemIndex = 1

for (const gene of bestIndividual.getGenes()) {
  if (!(gene instanceof ShoppingGene)) {
    continue
  }

  const product = fitnessEvaluator.getProductById(gene.getProductId())
  if (!product || gene.getQuantity() <= 0) {
    continue
  }

  const quantity = gene.getQuantity()
  const linePrice = product.getPrice() * quantity
  const lineWeight = product.getWeight() * quantity
  const preference = client.getPreference(product.getCategory())
  const linePreference = preference * quantity

  totalPrice += linePrice
  totalWeight += lineWeight

  console.log(
    `${itemIndex}. ${product.getId()} | 類別 ${product.getCategory()} | 單價 ${product.getPrice()} 元 | 單重 ${product.getWeight()} kg | 數量 ${quantity} | 小計 ${linePrice} 元 / ${lineWeight} kg | 喜好 ${preference} → ${linePreference}`,
  )
  itemIndex += 1
}

console.log('----------------------------------')
console.log(`總價: ${totalPrice} / ${client.getBudget()} 元`)
console.log(`總重: ${totalWeight} / ${client.getCapacity()} kg`)
console.log('==================================')
