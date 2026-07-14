import {
  type DiagnosisRequest,
  DiagnosisRule,
  type DiagnosisRuleProps,
  Medicine,
  Prescription,
  Symptom,
} from '../core'

export class COVID19DiagnosisRule extends DiagnosisRule {
  constructor({ next }: DiagnosisRuleProps) {
    super({ next })
  }

  check(diagnosisRequest: DiagnosisRequest): Prescription | null {
    const symptoms = diagnosisRequest.getSymptoms()
    if (
      symptoms.includes(Symptom.Sneeze) &&
      symptoms.includes(Symptom.Headache) &&
      symptoms.includes(Symptom.Cough)
    ) {
      return new Prescription({
        name: '清冠一號',
        potentialDisease: '新冠肺炎（專業學名：COVID-19）',
        medicines: [new Medicine({ name: '清冠一號' })],
        usage:
          '將相關藥材裝入茶包裡，使用500 mL 溫、熱水沖泡悶煮1~3 分鐘後即可飲用。',
      })
    }
    return null
  }
}
