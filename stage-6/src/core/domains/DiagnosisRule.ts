import type { DiagnosisRequest } from './DiagnosisRequest'
import { DiagnosisNotFoundError } from './errors/DiagnosisNotFoundError'
import type { Prescription } from './Prescription'

export type DiagnosisRuleProps = {
  next?: DiagnosisRule | null
}

export abstract class DiagnosisRule {
  private next: DiagnosisRule | null = null

  constructor({ next = null }: DiagnosisRuleProps) {
    this.next = next
  }

  getNext() {
    return this.next
  }

  setNext(next: DiagnosisRule | null) {
    this.next = next
  }

  diagnose(diagnosisRequest: DiagnosisRequest): Prescription {
    const prescription = this.check(diagnosisRequest)

    if (prescription) {
      return prescription
    }

    if (this.next) {
      return this.next.diagnose(diagnosisRequest)
    }

    throw new DiagnosisNotFoundError()
  }

  abstract check(diagnosisRequest: DiagnosisRequest): Prescription | null
}
