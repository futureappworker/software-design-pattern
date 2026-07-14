import fs from 'node:fs'

import {
  FileFormatType,
  type Patient,
  type Prescription,
  type PrescriptionObserver,
  type Symptom,
} from '../core'

type PrescriptionExporterProps = {
  patientId: string
  filePath: string
  format: FileFormatType
}

export class PrescriptionExporter implements PrescriptionObserver {
  private patientId: string
  private filePath: string
  private format: FileFormatType

  constructor({ patientId, filePath, format }: PrescriptionExporterProps) {
    this.patientId = patientId
    this.filePath = filePath
    this.format = format
  }

  private isPatientMatch(patient: Patient): boolean {
    return patient.getId() === this.patientId
  }

  onDiagnosisCompleted(
    patient: Patient,
    symptoms: Symptom[],
    prescription: Prescription,
  ) {
    // 在完成診斷之後
    // 把此次診斷結果存到哪個檔案
    // 並且也能選擇要存成 JSON 格式還是 CSV 格式
    if (!this.isPatientMatch(patient)) {
      return
    }

    if (this.format === FileFormatType.JSON) {
      this.exportToJSON(patient, symptoms, prescription)
    } else if (this.format === FileFormatType.CSV) {
      this.exportToCSV(patient, symptoms, prescription)
    }
  }

  shouldUnregister(patient: Patient) {
    return this.isPatientMatch(patient)
  }

  private exportToJSON(
    patient: Patient,
    symptoms: Symptom[],
    prescription: Prescription,
  ) {
    // 將診斷結果存到 JSON 檔案
    const data = {
      patientId: patient.getId(),
      symptoms,
      prescription: {
        name: prescription.getName(),
        potentialDisease: prescription.getPotentialDisease(),
        medicines: prescription.getMedicines().map((m) => m.getName()),
        usage: prescription.getUsage(),
      },
    }
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2))
  }

  private exportToCSV(
    patient: Patient,
    symptoms: Symptom[],
    prescription: Prescription,
  ) {
    // 將診斷結果存到 CSV 檔案
    const row = {
      patientId: patient.getId(),
      symptoms: symptoms.join('|'),
      prescriptionName: prescription.getName(),
      disease: prescription.getPotentialDisease(),
      medicines: prescription
        .getMedicines()
        .map((m) => m.getName())
        .join('|'),
      usage: prescription.getUsage(),
    }

    const csv = [
      Object.keys(row).join(','),
      Object.values(row)
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(','),
    ].join('\n')

    fs.writeFileSync(this.filePath, csv, 'utf8')
  }
}
