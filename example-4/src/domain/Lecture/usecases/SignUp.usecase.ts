import { LectureAttendance } from '../../LectureAttendance/LectureAttendance'
import type { Student } from '../../Student/Student'
import type { Lecture } from '../Lecture'

type Input = {
  student: Student
  lecture: Lecture
}

export class SignUpUseCase {
  execute({ student, lecture }: Input) {
    if (student.getLectureAttendance() !== null) {
      throw new Error('student 已經有課了')
    }
    if (lecture.getLectureAttendance() !== null) {
      throw new Error('lecture 已經有人上了')
    }

    const lectureAttendance = new LectureAttendance({ student, lecture })
    student.setLectureAttendance(lectureAttendance)
    lecture.setLectureAttendance(lectureAttendance)
  }
}
