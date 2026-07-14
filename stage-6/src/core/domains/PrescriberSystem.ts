import type { DiseaseCatalog } from './DiseaseCatalog'
import type { PatientDatabase } from './PatientDatabase'
import type { Prescriber } from './Prescriber'
import type { Symptom } from './Symptom'

type PrescriberSystemProps = {
  patientDatabase: PatientDatabase
  diseaseCatalog: DiseaseCatalog
  prescriber: Prescriber
}

export class PrescriberSystem {
  private patientDatabase: PatientDatabase
  private diseaseCatalog: DiseaseCatalog
  private prescriber: Prescriber

  constructor({
    patientDatabase,
    diseaseCatalog,
    prescriber,
  }: PrescriberSystemProps) {
    this.patientDatabase = patientDatabase
    this.diseaseCatalog = diseaseCatalog
    this.prescriber = prescriber
  }

  getPatientDatabase() {
    return this.patientDatabase
  }

  getDiseaseCatalog() {
    return this.diseaseCatalog
  }

  getPrescriber() {
    return this.prescriber
  }

  initializePatientsFromJson(filePath: string): void {
    this.patientDatabase.loadFromJson(filePath)
  }

  initializeDiseaseCatalogFromText(filePath: string): void {
    this.diseaseCatalog.loadFromText(filePath)
  }

  async requestDiagnosis(patientId: string, symptoms: Symptom[]) {
    const patient = this.patientDatabase.findById(patientId)
    if (!patient) {
      throw new Error(`Patient with id ${patientId} not found`)
    }
    await this.prescriber.requestDiagnosis(patient, symptoms)
  }
}
