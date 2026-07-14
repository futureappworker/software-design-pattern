import {
  type DiagnosisRequest,
  DiagnosisRule,
  type DiagnosisRuleProps,
  Gender,
  Medicine,
  Prescription,
  Symptom,
} from '../core'

export class AttractiveDiagnosisRule extends DiagnosisRule {
  constructor({ next }: DiagnosisRuleProps) {
    super({ next })
  }

  check(diagnosisRequest: DiagnosisRequest): Prescription | null {
    const patient = diagnosisRequest.getPatient()
    const symptoms = diagnosisRequest.getSymptoms()

    if (
      patient.getAge() === 18 &&
      patient.getGender() === Gender.Female &&
      symptoms.includes(Symptom.Sneeze)
    ) {
      return new Prescription({
        name: '青春抑制劑',
        potentialDisease: '有人想你了 (專業學名：Attractive)',
        medicines: [
          new Medicine({ name: '假鬢角' }),
          new Medicine({ name: '臭味' }),
        ],
        usage:
          '把假鬢角黏在臉的兩側，讓自己異性緣差一點，自然就不會有人想妳了。',
      })
    }

    return null
  }
}
