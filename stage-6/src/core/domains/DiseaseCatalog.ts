import fs from 'node:fs'

type DiseaseCatalogProps = {
  potentialDiseases?: string[]
}

export class DiseaseCatalog {
  private potentialDiseases: string[] = []

  constructor({ potentialDiseases = [] }: DiseaseCatalogProps) {
    this.potentialDiseases = [...potentialDiseases]
  }

  getPotentialDiseases() {
    return [...this.potentialDiseases]
  }

  loadFromText(filePath: string) {
    // 讀取純文字檔，將每一行疾病專業學名載入到支援疾病清單中
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const diseases = fileContent
      .split('\n')
      .filter((disease) => disease.trim() !== '')
    this.potentialDiseases = [...diseases].map((disease) => disease.trim())
  }

  containsDisease(disease: string): boolean {
    return this.potentialDiseases.includes(disease)
  }
}
