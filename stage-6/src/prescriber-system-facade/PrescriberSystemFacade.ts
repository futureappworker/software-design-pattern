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
  patientsFileName: string
  diseaseCatalogFileName: string
}

export class PrescriberSystemFacade {
  private prescriberSystem: PrescriberSystem

  constructor({
    patientsFileName,
    diseaseCatalogFileName,
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

    this.prescriberSystem.initializePatientsFromJson(patientsFileName)
    this.prescriberSystem.initializeDiseaseCatalogFromText(
      diseaseCatalogFileName,
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
    } catch (error) {
      // 診斷失敗時不會走到 shouldUnregister，需主動清掉 exporter
      if (exporter) {
        prescriber.unregisterPrescriptionObserver(exporter)
      }
      throw error
    }
    // 成功時由 PrescriptionExporter.shouldUnregister 在 notify 後自行卸載
  }
}
