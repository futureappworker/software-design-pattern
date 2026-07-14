import { shouldBeWithinRange } from '../utils/shouldBeWithinRange'
import type { Case } from './Case'
import type { Gender } from './Gender'

type PatientProps = {
  id: string
  name: string
  gender: Gender
  age: number
  height: number
  weight: number
  cases: Case[]
}

// 病患
export class Patient {
  id!: string
  name!: string
  gender: Gender
  age!: number
  height!: number
  weight!: number
  cases: Case[]

  constructor({ id, name, gender, age, height, weight, cases }: PatientProps) {
    this.setId(id)
    this.setName(name)
    this.gender = gender
    this.setAge(age)
    this.setHeight(height)
    this.setWeight(weight)
    this.cases = [...cases]
  }

  getId() {
    return this.id
  }

  setId(id: string) {
    // 開頭為大寫英文字母，之後有 9 位數字
    if (!/^[A-Z][0-9]{9}$/.test(id)) {
      throw new Error('Invalid ID')
    }
    this.id = id
  }

  getName() {
    return this.name
  }

  setName(name: string) {
    // 限制 name 的長度, 1~30 個字
    shouldBeWithinRange({
      name: 'name 的長度',
      num: name.length,
      inclusiveMin: 1,
      inclusiveMax: 30,
    })
    this.name = name
  }

  getAge() {
    return this.age
  }

  setAge(age: number) {
    // 限制 age 的範圍, 1~180 歲
    shouldBeWithinRange({
      name: 'age 的範圍',
      num: age,
      inclusiveMin: 1,
      inclusiveMax: 180,
    })
    this.age = age
  }

  getHeight() {
    return this.height
  }

  setHeight(height: number) {
    // 限制 height 的範圍, 1~500 公分
    shouldBeWithinRange({
      name: 'height 的範圍',
      num: height,
      inclusiveMin: 1,
      inclusiveMax: 500,
    })
    this.height = height
  }

  getWeight() {
    return this.weight
  }

  setWeight(weight: number) {
    // 限制 weight 的範圍, 1~500 公斤
    shouldBeWithinRange({
      name: 'weight 的範圍',
      num: weight,
      inclusiveMin: 1,
      inclusiveMax: 500,
    })
    this.weight = weight
  }

  getCases() {
    return [...this.cases]
  }

  addCase(patientCase: Case) {
    this.cases.push(patientCase)
  }

  getGender() {
    return this.gender
  }
}
