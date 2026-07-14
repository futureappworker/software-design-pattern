import { DiagnosisRequest } from './DiagnosisRequest'
import type { DiagnosisRule } from './DiagnosisRule'
import { DiagnosisNotFoundError } from './errors/DiagnosisNotFoundError'
import type { Patient } from './Patient'
import type { Prescription } from './Prescription'
import type { PrescriptionObserver } from './PrescriptionObserver'
import type { Symptom } from './Symptom'

type PrescriberProps = {
  queues?: DiagnosisRequest[]
  isProcessing?: boolean
  prescriptionObservers?: PrescriptionObserver[]
  diagnosisRule?: DiagnosisRule | null
}

// 診斷器
export class Prescriber {
  private queues: DiagnosisRequest[]
  private isProcessing: boolean = false
  private prescriptionObservers: PrescriptionObserver[] = []
  private diagnosisRule: DiagnosisRule | null = null

  constructor({
    queues = [],
    isProcessing = false,
    prescriptionObservers = [],
    diagnosisRule = null,
  }: PrescriberProps) {
    this.queues = [...queues]
    this.isProcessing = isProcessing
    this.prescriptionObservers = [...prescriptionObservers]
    this.diagnosisRule = diagnosisRule
  }

  getQueues() {
    return [...this.queues]
  }

  getIsProcessing() {
    return this.isProcessing
  }

  getPrescriptionObservers() {
    return [...this.prescriptionObservers]
  }

  getDiagnosisRule() {
    return this.diagnosisRule
  }

  async requestDiagnosis(patient: Patient, symptoms: Symptom[]) {
    // 接收一筆診斷需求，建立診斷請求，
    // 並將它加入等待診斷的 Queue。
    // 回傳的 Promise 在「該筆」請求完成（成功或失敗）後才 settle。

    const diagnosisRequest = new DiagnosisRequest({ patient, symptoms })

    this.queues.push(diagnosisRequest)
    void this.processQueue()
    return diagnosisRequest.completion
  }

  private async processQueue() {
    // 持續從 Queue 取出等待中的 DiagnosisRequest，
    // 並依序交給 diagnose() 執行，直到 Queue 為空為止。

    if (this.isProcessing) {
      return
    }

    this.isProcessing = true
    try {
      while (this.queues.length > 0) {
        const diagnosisRequest = this.dequeueDiagnosisRequest()
        if (!diagnosisRequest) {
          break
        }

        try {
          await this.simulateDiagnosisTime()
          const prescription = this.diagnose(diagnosisRequest)
          this.notifyPrescriptionObservers(diagnosisRequest, prescription)
          diagnosisRequest.complete(prescription)
        } catch (error) {
          // 單筆失敗不阻塞佇列；錯誤回傳給該筆 requestDiagnosis 的呼叫端
          diagnosisRequest.fail(error)
        }
        if (this.queues.length !== 0) {
          // log 剩餘 待診斷人名
          console.log(
            `待診斷人名：${this.queues.map((queue) => queue.getPatient().getName()).join(', ')}`,
          )
        }
      }
    } finally {
      this.isProcessing = false
      if (this.queues.length > 0) {
        void this.processQueue()
      }
    }
  }

  private async simulateDiagnosisTime() {
    // 模擬診斷時間
    // 生成一個 3 秒的延遲
    await new Promise((resolve) => setTimeout(resolve, 3000))
  }

  private diagnose(diagnosisRequest: DiagnosisRequest): Prescription {
    if (!this.diagnosisRule) {
      throw new DiagnosisNotFoundError()
    }
    return this.diagnosisRule.diagnose(diagnosisRequest)
  }

  private notifyPrescriptionObservers(
    diagnosisRequest: DiagnosisRequest,
    prescription: Prescription,
  ) {
    const patient = diagnosisRequest.getPatient()
    const symptoms = diagnosisRequest.getSymptoms()

    for (const prescriptionObserver of [...this.prescriptionObservers]) {
      prescriptionObserver.onDiagnosisCompleted(patient, symptoms, prescription)
      if (prescriptionObserver.shouldUnregister(patient)) {
        this.unregisterPrescriptionObserver(prescriptionObserver)
      }
    }
  }

  registerPrescriptionObserver(prescriptionObserver: PrescriptionObserver) {
    this.prescriptionObservers.push(prescriptionObserver)
  }

  unregisterPrescriptionObserver(prescriptionObserver: PrescriptionObserver) {
    const index = this.prescriptionObservers.indexOf(prescriptionObserver)
    if (index === -1) {
      return
    }
    this.prescriptionObservers.splice(index, 1)
  }

  setDiagnosisRule(diagnosisRule: DiagnosisRule) {
    this.diagnosisRule = diagnosisRule
  }

  addDiagnosisRule(diagnosisRule: DiagnosisRule) {
    if (!this.diagnosisRule) {
      this.setDiagnosisRule(diagnosisRule)
      return
    }

    let current = this.diagnosisRule
    let next = current.getNext()
    while (next) {
      current = next
      next = current.getNext()
    }
    current.setNext(diagnosisRule)
  }

  private dequeueDiagnosisRequest(): DiagnosisRequest | null {
    if (this.queues.length > 0) {
      return this.queues.shift() || null
    }
    return null
  }
}
