import type { Patient } from './Patient'
import type { Symptom } from './Symptom'

type DiagnosisRequestProps = {
  patient: Patient
  symptoms: Symptom[]
}

export class DiagnosisRequest {
  private patient: Patient
  private symptoms: Symptom[]

  constructor({ patient, symptoms }: DiagnosisRequestProps) {
    this.patient = patient
    this.symptoms = [...symptoms]
  }

  getPatient() {
    return this.patient
  }

  getSymptoms() {
    return [...this.symptoms]
  }
}
