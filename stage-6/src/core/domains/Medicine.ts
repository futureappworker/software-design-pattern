import { shouldBeWithinRange } from '../utils/shouldBeWithinRange'

type MedicineProps = {
  name: string
}

// 藥物
export class Medicine {
  private name!: string

  constructor({ name }: MedicineProps) {
    this.setName(name)
  }

  getName() {
    return this.name
  }

  setName(name: string) {
    // 限制 name 的長度, 3~30 個字
    shouldBeWithinRange({
      name: 'name 的長度',
      num: name.length,
      inclusiveMin: 3,
      inclusiveMax: 30,
    })
    this.name = name
  }
}
