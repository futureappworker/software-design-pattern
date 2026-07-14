import {
  type DiagnosisRule,
  DiseaseCatalog,
  PatientDatabase,
  Prescriber,
  PrescriberSystem,
  type Symptom,
} from '../core'
import {
  AttractiveDiagnosisRule,
  COVID19DiagnosisRule,
  SleepApneaSyndromeDiagnosisRule,
} from '../diagnosis-rules'
import {
  PatientMedicalRecordUpdater,
  PrescriptionExporter,
} from '../prescription-observers'
import type { DiagnosisOutputOption } from './DiagnosisOutputOption'

type PrescriberSystemFacadeProps = {
  patientsFilePath: string
  diseaseCatalogFilePath: string
}

export class PrescriberSystemFacade {
  private prescriberSystem: PrescriberSystem

  constructor({
    patientsFilePath,
    diseaseCatalogFilePath,
  }: PrescriberSystemFacadeProps) {
    const patientDatabase = new PatientDatabase({})
    const diseaseCatalog = new DiseaseCatalog({})

    const prescriber = new Prescriber({})
    prescriber.registerPrescriptionObserver(new PatientMedicalRecordUpdater())

    this.prescriberSystem = new PrescriberSystem({
      patientDatabase,
      diseaseCatalog,
      prescriber,
    })

    this.prescriberSystem.initializePatientsFromJson(patientsFilePath)
    this.prescriberSystem.initializeDiseaseCatalogFromText(
      diseaseCatalogFilePath,
    )

    // 建立診斷規則鏈
    this.buildDiagnosisRuleChain()
  }

  private buildDiagnosisRuleChain() {
    const diseaseCatalog = this.prescriberSystem.getDiseaseCatalog()
    const prescriber = this.prescriberSystem.getPrescriber()

    const ruleFactories: Array<{
      disease: string
      create: () => DiagnosisRule
    }> = [
      { disease: 'COVID-19', create: () => new COVID19DiagnosisRule({}) },
      {
        disease: 'SleepApneaSyndrome',
        create: () => new SleepApneaSyndromeDiagnosisRule({}),
      },
      { disease: 'Attractive', create: () => new AttractiveDiagnosisRule({}) },
    ]

    for (const { disease, create } of ruleFactories) {
      if (diseaseCatalog.containsDisease(disease)) {
        prescriber.addDiagnosisRule(create())
      }
    }
  }

  async requestDiagnosis(
    patientId: string,
    symptoms: Symptom[],
    diagnosisOutputOption?: DiagnosisOutputOption,
  ): Promise<void> {
    const exporter = diagnosisOutputOption
      ? new PrescriptionExporter({
          patientId,
          filePath: diagnosisOutputOption.filePath,
          format: diagnosisOutputOption.format,
        })
      : null

    const prescriber = this.prescriberSystem.getPrescriber()

    if (exporter) {
      prescriber.registerPrescriptionObserver(exporter)
    }

    try {
      await this.prescriberSystem.requestDiagnosis(patientId, symptoms)
    } finally {
      // 診斷不出／例外都不會走 shouldUnregister，在此保險卸載
      // 成功時 notify 可能已卸載，unregister 為 no-op
      if (exporter) {
        prescriber.unregisterPrescriptionObserver(exporter)
      }
    }
  }
}
