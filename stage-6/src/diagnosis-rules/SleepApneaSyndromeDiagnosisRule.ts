import {
  type DiagnosisRequest,
  DiagnosisRule,
  type DiagnosisRuleProps,
  Medicine,
  Prescription,
  Symptom,
} from '../core'

export class SleepApneaSyndromeDiagnosisRule extends DiagnosisRule {
  constructor({ next }: DiagnosisRuleProps) {
    super({ next })
  }

  check(diagnosisRequest: DiagnosisRequest): Prescription | null {
    const patient = diagnosisRequest.getPatient()
    const symptoms = diagnosisRequest.getSymptoms()

    // BMI = 體重(kg) ÷ (身高(m) × 身高(m))；身高以公分儲存
    const heightInMeters = patient.getHeight() / 100
    const bmi = patient.getWeight() / (heightInMeters * heightInMeters)

    if (bmi > 26 && symptoms.includes(Symptom.Snore)) {
      return new Prescription({
        name: '打呼抑制劑',
        potentialDisease: '睡眠呼吸中止症（專業學名：SleepApneaSyndrome）',
        medicines: [new Medicine({ name: '一捲膠帶' })],
        usage:
          '睡覺時，撕下兩塊膠帶，將兩塊膠帶交錯黏在關閉的嘴巴上，就不會打呼了。',
      })
    }

    return null
  }
}
