import fs from 'node:fs'
import type { Case } from './Case'
import { Patient } from './Patient'

type PatientDatabaseProps = {
  patients?: Patient[]
}

/**
 * 病患資料庫。
 * 負責儲存、查詢病患，以及從 JSON 檔案載入病患資料。
 */
export class PatientDatabase {
  private patients: Patient[] = []

  constructor({ patients = [] }: PatientDatabaseProps) {
    this.patients = [...patients]
  }

  /**
   * 取得所有病患的副本。
   * @returns 病患陣列
   */
  getPatients() {
    return [...this.patients]
  }

  /**
   * 依病患 ID 查詢病患。
   * @param id - 病患 ID
   * @returns 找到的病患，若不存在則為 undefined
   */
  findById(id: string) {
    return this.patients.find((patient) => patient.getId() === id)
  }

  /**
   * 為指定病患新增看診案例。
   * @param patientId - 病患 ID
   * @param patientCase - 看診案例
   * @throws 當病患不存在時拋出錯誤
   */
  addCase(patientId: string, patientCase: Case) {
    const patient = this.findById(patientId)
    if (!patient) {
      throw new Error('Patient not found')
    }
    patient.addCase(patientCase)
  }

  /**
   * 從指定 JSON 檔案載入病患資料，並覆寫目前資料庫內容。
   * @param filePath - JSON 檔案路徑
   */
  loadFromJson(filePath: string): void {
    const jsonData = fs.readFileSync(filePath, 'utf8')

    const data: Patient[] = JSON.parse(jsonData)

    this.patients = data.map((patientData) => new Patient(patientData))
  }
}
