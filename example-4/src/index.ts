import { nanoid } from 'nanoid'
import { Lecture } from './domain/Lecture/Lecture'
import { SignOffUseCase } from './domain/Lecture/usecases/SignOff.usecase'
import { SignUpUseCase } from './domain/Lecture/usecases/SignUp.usecase'
import { Student } from './domain/Student/Student'

const student = new Student({
  id: nanoid(),
  name: 'Johnny',
})

const lecture = new Lecture({
  id: nanoid(),
  name: '軟體設計模式',
})

const signUpUseCase = new SignUpUseCase()
signUpUseCase.execute({
  student,
  lecture,
})

try {
  signUpUseCase.execute({
    student,
    lecture,
  })
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message, '\n')
  } else {
    console.log('Unknown error:', error, '\n')
  }
}

const lectureAttendance = lecture.getLectureAttendance()
lectureAttendance?.setGrade(60)

const signOffUseCase = new SignOffUseCase()
signOffUseCase.execute({
  student,
  lecture,
})

try {
  signOffUseCase.execute({
    student,
    lecture,
  })
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message, '\n')
  } else {
    console.log('Unknown error:', error, '\n')
  }
}
