export enum Symptom {
  Sneeze = 'Sneeze',
  Headache = 'Headache',
  Cough = 'Cough',
  Snore = 'Snore',
}

export const symptomLabels: Record<Symptom, string> = {
  [Symptom.Sneeze]: '打噴嚏',
  [Symptom.Headache]: '頭痛',
  [Symptom.Cough]: '咳嗽',
  [Symptom.Snore]: '打呼',
}
