import { shouldBeGreaterThanOrEqual } from '../../utils/shouldBeGreaterThanOrEqual'
import type { Coord } from '../Coord/Coord'
import type { Gender } from './Gender'
import type { Habit } from './Habit'

type IndividualProps = {
  id: number
  gender: Gender
  age: number
  coord: Coord
  intro?: string
  habits?: Habit[]
}

export class Individual {
  private id!: number
  private gender: Gender
  private age!: number
  private coord: Coord
  private intro: string
  private habits: Habit[]

  constructor({
    id,
    gender,
    age,
    coord,
    intro = '',
    habits = [],
  }: IndividualProps) {
    this.setId(id)
    this.gender = gender
    this.setAge(age)
    this.intro = intro
    this.habits = habits
    this.coord = coord
  }

  getId() {
    return this.id
  }

  getCoord() {
    return this.coord
  }

  getHabits() {
    return this.habits
  }

  getGender() {
    return this.gender
  }

  getAge() {
    return this.age
  }

  getIntro() {
    return this.intro
  }

  setId(id: number) {
    shouldBeGreaterThanOrEqual({
      name: 'id',
      num: id,
      target: 1,
    })
    this.id = id
  }

  setAge(age: number) {
    shouldBeGreaterThanOrEqual({
      name: 'age',
      num: age,
      target: 18,
    })
    this.age = age
  }
}
