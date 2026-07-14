import type { Patient } from './Patient'
import type { Prescription } from './Prescription'
import type { Symptom } from './Symptom'
import { DiagnosisNotFoundError } from './errors/DiagnosisNotFoundError'

type DiagnosisRequestProps = {
  patient: Patient
  symptoms: Symptom[]
}

export class DiagnosisRequest {
  private patient: Patient
  private symptoms: Symptom[]
  private resolveCompletion: (() => void) | null = null
  private rejectCompletion: ((error: unknown) => void) | null = null
  readonly completion: Promise<void>

  constructor({ patient, symptoms }: DiagnosisRequestProps) {
    this.patient = patient
    this.symptoms = [...symptoms]
    this.completion = new Promise((resolve, reject) => {
      this.resolveCompletion = resolve
      this.rejectCompletion = reject
    })
  }

  getPatient() {
    return this.patient
  }

  getSymptoms() {
    return [...this.symptoms]
  }

  complete(prescription: Prescription) {
    console.log('\n')
    console.log(
      `診斷成功：\n${this.patient.getId()} ${this.patient.getName()} \n處方名字: ${prescription.getName()}`,
    )
    console.log('\n')
    this.resolveCompletion?.()
  }

  // 規則全不符合：業務上已結束，不 reject 給 client
  fail(error: unknown) {
    console.log('\n')
    console.log(
      `診斷不出疾病：\n${this.patient.getId()} ${this.patient.getName()}`,
    )
    console.log('\n')

    if (error instanceof DiagnosisNotFoundError) {
      this.resolveCompletion?.()
      return
    }

    this.rejectCompletion?.(error)
  }
}
