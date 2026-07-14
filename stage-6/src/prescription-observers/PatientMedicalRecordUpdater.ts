import type {
  Patient,
  Prescription,
  PrescriptionObserver,
  Symptom,
} from '../core'
import { Case } from '../core/domains/Case'

export class PatientMedicalRecordUpdater implements PrescriptionObserver {
  onDiagnosisCompleted(
    patient: Patient,
    symptoms: Symptom[],
    prescription: Prescription,
  ) {
    const patientCase = new Case({
      symptoms,
      prescription,
      caseTime: new Date(),
    })
    patient.addCase(patientCase)
  }

  shouldUnregister(_patient: Patient) {
    return false
  }
}
