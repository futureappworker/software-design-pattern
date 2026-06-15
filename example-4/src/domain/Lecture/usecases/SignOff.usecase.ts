import type { Student } from '../../Student/Student'
import type { Lecture } from '../Lecture'

type Input = {
  student: Student
  lecture: Lecture
}

export class SignOffUseCase {
  execute({ student, lecture }: Input) {
    if (student.getLectureAttendance() !== lecture.getLectureAttendance()) {
      throw new Error('student 沒有上這堂課')
    }
    if (student.getLectureAttendance() === null) {
      throw new Error('student 還沒有選課')
    }
    if (lecture.getLectureAttendance() === null) {
      throw new Error('lecture 還沒有學生')
    }

    student.setLectureAttendance(null)
    lecture.setLectureAttendance(null)
  }
}
