import { shouldBeWithinRange } from '../utils/shouldBeWithinRange'
import type { Medicine } from './Medicine'

type PrescriptionProps = {
  name: string
  potentialDisease: string
  medicines: Medicine[]
  usage: string
}

// 治療處方 ( 診斷結果 )
export class Prescription {
  private name!: string
  private potentialDisease!: string
  private medicines: Medicine[]
  private usage!: string

  constructor({ name, potentialDisease, medicines, usage }: PrescriptionProps) {
    this.setName(name)
    this.setPotentialDisease(potentialDisease)
    this.medicines = [...medicines]
    this.setUsage(usage)
  }

  getName() {
    return this.name
  }

  getPotentialDisease() {
    return this.potentialDisease
  }

  getMedicines() {
    return [...this.medicines]
  }

  getUsage() {
    return this.usage
  }

  setName(name: string) {
    // 限制 name 的長度, 4~30 個字
    shouldBeWithinRange({
      name: 'name 的長度',
      num: name.length,
      inclusiveMin: 4,
      inclusiveMax: 30,
    })
    this.name = name
  }

  setPotentialDisease(potentialDisease: string) {
    // 限制 potentialDisease 的長度, 3~100 個字
    shouldBeWithinRange({
      name: 'potentialDisease 的長度',
      num: potentialDisease.length,
      inclusiveMin: 3,
      inclusiveMax: 100,
    })
    this.potentialDisease = potentialDisease
  }

  setUsage(usage: string) {
    // 限制 usage 的長度, 0~1000 個字
    shouldBeWithinRange({
      name: 'usage 的長度',
      num: usage.length,
      inclusiveMin: 0,
      inclusiveMax: 1000,
    })
    this.usage = usage
  }
}
