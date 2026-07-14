import type { Patient } from './Patient'
import type { Prescription } from './Prescription'
import type { Symptom } from './Symptom'

export interface PrescriptionObserver {
  onDiagnosisCompleted(
    patient: Patient,
    symptoms: Symptom[],
    prescription: Prescription,
  ): void
  shouldUnregister(patient: Patient): boolean
}
