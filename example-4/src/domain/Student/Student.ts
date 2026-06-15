import type { LectureAttendance } from '../LectureAttendance/LectureAttendance'

type StudentProps = {
  id: string
  name: string
}

export class Student {
  private id!: string
  private name!: string
  private lectureAttendance: LectureAttendance | null = null

  constructor({ id, name }: StudentProps) {
    this.setId(id)
    this.setName(name)
  }

  getId() {
    return this.id
  }
  private setId(id: string) {
    this.id = id
  }

  getName() {
    return this.name
  }
  private setName(name: string) {
    this.name = name
  }

  getLectureAttendance() {
    return this.lectureAttendance
  }
  setLectureAttendance(lectureAttendance: LectureAttendance | null) {
    this.lectureAttendance = lectureAttendance
  }
}
