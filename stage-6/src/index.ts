import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  FileFormatType,
  PrescriberSystemFacade,
  Symptom,
} from './prescriber-system-facade'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const patientsFileName = 'patients.json'
const diseaseCatalogFileName = 'disease-catalog.txt'

// patientsFilePath 是 相對路徑，從 src 目錄下開始算
// diseaseCatalogFilePath 是 相對路徑，從 src 目錄下開始算
const patientsFilePath = path.join(__dirname, patientsFileName)
const diseaseCatalogFilePath = path.join(__dirname, diseaseCatalogFileName)

const prescriberSystemFacade = new PrescriberSystemFacade({
  patientsFilePath,
  diseaseCatalogFilePath,
})

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// 主函數
// 模擬不同時間發出請求
async function main() {
  // 發出請求後不等診斷完成；由 Prescriber queue 依序處理
  // filePath 相對路徑從 src 目錄下開始算
  const pending: Promise<void>[] = []

  // t=0：同時發出 3 筆
  pending.push(
    // B234567890 陳美玲：18 歲女性 + 打噴嚏 → Attractive
    prescriberSystemFacade.requestDiagnosis('B234567890', [Symptom.Sneeze], {
      filePath: path.join(__dirname, 'B234567890.csv'),
      format: FileFormatType.CSV,
    }),
    // A123456789 王小明：打噴嚏 + 頭痛 + 咳嗽 → COVID-19
    prescriberSystemFacade.requestDiagnosis(
      'A123456789',
      [Symptom.Sneeze, Symptom.Headache, Symptom.Cough],
      {
        filePath: path.join(__dirname, 'A123456789.json'),
        format: FileFormatType.JSON,
      },
    ),
    // C345678901 林大雄：BMI 偏高 + 打呼 → SleepApneaSyndrome
    prescriberSystemFacade.requestDiagnosis('C345678901', [Symptom.Snore], {
      filePath: path.join(__dirname, 'C345678901.csv'),
      format: FileFormatType.CSV,
    }),
  )

  // t=4s：再發出（此時第一批可能還在 queue 裡處理）
  await delay(4000)

  pending.push(
    // D763987648 李大偉：僅頭痛 → 診斷不出（core 內部處理，client 無需 catch）
    prescriberSystemFacade.requestDiagnosis('D763987648', [Symptom.Headache], {
      filePath: path.join(__dirname, 'D763987648.json'),
      format: FileFormatType.JSON,
    }),
    // D456789012 黃雅婷：COVID-19 症狀
    prescriberSystemFacade.requestDiagnosis(
      'D456789012',
      [Symptom.Sneeze, Symptom.Headache, Symptom.Cough],
      {
        filePath: path.join(__dirname, 'D456789012.json'),
        format: FileFormatType.JSON,
      },
    ),
    // E567890123 張志豪：BMI 偏高 + 打呼 → SleepApneaSyndrome
    prescriberSystemFacade.requestDiagnosis('E567890123', [Symptom.Snore], {
      filePath: path.join(__dirname, 'E567890123.csv'),
      format: FileFormatType.CSV,
    }),
  )

  // 最後才等全部結束，避免 process 提早結束
  await Promise.all(pending)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
