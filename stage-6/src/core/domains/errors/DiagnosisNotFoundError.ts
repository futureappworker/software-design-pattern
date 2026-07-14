export class DiagnosisNotFoundError extends Error {
  constructor() {
    super('No matching diagnosis rule')

    this.name = 'DiagnosisNotFoundError'

    Object.setPrototypeOf(this, DiagnosisNotFoundError.prototype)
  }
}
