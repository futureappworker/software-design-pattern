import type { Patient } from './Patient'
import type { Symptom } from './Symptom'

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

  complete() {
    this.resolveCompletion?.()
  }

  fail(error: unknown) {
    this.rejectCompletion?.(error)
  }
}
