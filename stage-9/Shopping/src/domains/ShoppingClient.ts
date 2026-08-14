import { shouldBeGreaterThanOrEqual } from '../utils/shouldBeGreaterThanOrEqual'
import { shouldBeWithinRange } from '../utils/shouldBeWithinRange'
import type { ProductCategory } from './ProductCategory'

type ShoppingClientConfig = {
  budget: number
  capacity: number
  preferenceMap: Map<ProductCategory, number>
}

export class ShoppingClient {
  // 預算
  // 單位 : 元
  private budget: number
  // 購物袋的最大承載重量
  // 單位 : 公斤
  private capacity: number
  // 客戶喜好
  // 以產品類別為鍵，值為喜好程度，範圍為 0 到 100
  private preferenceMap: Map<ProductCategory, number> = new Map()

  constructor({ budget, capacity, preferenceMap }: ShoppingClientConfig) {
    this.budget = budget
    this.capacity = capacity
    this.preferenceMap = preferenceMap
  }

  getBudget(): number {
    return this.budget
  }

  setBudget(budget: number): void {
    // 必須大於等於 0
    shouldBeGreaterThanOrEqual({
      name: 'budget',
      num: budget,
      target: 0,
    })
    this.budget = budget
  }

  getCapacity(): number {
    return this.capacity
  }
  setCapacity(capacity: number): void {
    // 必須大於等於 0
    shouldBeGreaterThanOrEqual({
      name: 'capacity',
      num: capacity,
      target: 0,
    })
    this.capacity = capacity
  }

  getPreferenceMap(): Map<ProductCategory, number> {
    return this.preferenceMap
  }

  getPreference(category: ProductCategory): number {
    return this.preferenceMap.get(category) ?? 0
  }

  setPreferenceMap(preferenceMap: Map<ProductCategory, number>): void {
    // value 必須大於等於 0 且小於等於 100
    for (const [_category, value] of preferenceMap) {
      shouldBeWithinRange({
        name: 'value',
        num: value,
        inclusiveMin: 0,
        inclusiveMax: 100,
      })
    }
    this.preferenceMap = preferenceMap
  }
}
