import { shouldBeGreaterThanOrEqual } from '../utils/shouldBeGreaterThanOrEqual'

type ProductionSchedulingProductConfig = {
  id: string
  name: string
  productionTime: number
}

export class ProductionSchedulingProduct {
  private id: string
  private name: string
  // 生產時間, 單位 : 小時
  private productionTime: number = 0

  constructor({ id, name, productionTime }: ProductionSchedulingProductConfig) {
    this.id = id
    this.name = name
    this.setProductionTime(productionTime)
  }

  getId(): string {
    return this.id
  }

  getName(): string {
    return this.name
  }

  getProductionTime(): number {
    return this.productionTime
  }

  setProductionTime(productionTime: number): void {
    // 必須大於等於 0
    shouldBeGreaterThanOrEqual({
      name: 'productionTime',
      num: productionTime,
      target: 0,
    })
    this.productionTime = productionTime
  }
}
