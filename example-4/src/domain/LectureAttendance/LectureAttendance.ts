import { shouldBeWithinRange } from '../../utils/shouldBeWithinRange'
import type { Lecture } from '../Lecture/Lecture'
import type { Student } from '../Student/Student'

type LectureAttendanceProps = {
  student: Student
  lecture: Lecture
}

export class LectureAttendance {
  private student: Student
  private lecture: Lecture
  private grade: number | null = null

  constructor({ student, lecture }: LectureAttendanceProps) {
    this.student = student
    this.lecture = lecture
  }

  getStudent() {
    return this.student
  }

  getLecture() {
    return this.lecture
  }

  getGrade() {
    return this.grade
  }
  setGrade(grade: number) {
    shouldBeWithinRange({
      name: 'grade',
      num: grade,
      inclusiveMin: 0,
      inclusiveMax: 100,
    })
    this.grade = grade
  }
}
