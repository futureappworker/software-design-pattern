import { shouldBeGreaterThanOrEqual } from '../utils/shouldBeGreaterThanOrEqual'
import type { ProductCategory } from './ProductCategory'

type ShoppingProductConfig = {
  id: string
  category: ProductCategory
  price: number
  weight: number
}

export class ShoppingProduct {
  private id: string
  private category: ProductCategory
  private price: number = 0
  private weight: number = 0

  constructor({ id, category, price, weight }: ShoppingProductConfig) {
    this.id = id
    this.category = category
    this.setPrice(price)
    this.setWeight(weight)
  }

  getId(): string {
    return this.id
  }

  getCategory(): ProductCategory {
    return this.category
  }

  getPrice(): number {
    return this.price
  }

  setPrice(price: number): void {
    // 必須大於等於 0
    shouldBeGreaterThanOrEqual({
      name: 'price',
      num: price,
      target: 0,
    })
    this.price = price
  }

  getWeight(): number {
    return this.weight
  }

  setWeight(weight: number): void {
    // 必須大於等於 0
    shouldBeGreaterThanOrEqual({
      name: 'weight',
      num: weight,
      target: 0,
    })
    this.weight = weight
  }
}
