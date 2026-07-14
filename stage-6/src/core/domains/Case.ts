import type { Prescription } from './Prescription'
import type { Symptom } from './Symptom'

type CaseProps = {
  symptoms: Symptom[]
  prescription: Prescription
  caseTime: Date
}

// 看診案例紀錄
export class Case {
  private symptoms: Symptom[]
  private prescription: Prescription
  private caseTime: Date

  constructor({ symptoms, prescription, caseTime }: CaseProps) {
    this.symptoms = [...symptoms]
    this.prescription = prescription
    this.caseTime = new Date(caseTime.getTime())
  }

  getSymptoms() {
    return [...this.symptoms]
  }

  getPrescription() {
    return this.prescription
  }

  getCaseTime() {
    return new Date(this.caseTime.getTime())
  }
}
