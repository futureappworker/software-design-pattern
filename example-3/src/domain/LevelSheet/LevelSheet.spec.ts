import { describe, expect, it } from 'vitest'
import { LevelSheet } from './LevelSheet'

describe('LevelSheet', () => {
  describe('queryLevel', () => {
    it('當 totalExp 小於 0 時, 應拋出錯誤', () => {
      const levelSheet = new LevelSheet()

      expect(() => {
        levelSheet.queryLevel(-1)
      }).toThrow('totalExp 必須 >= 0')
    })

    it('當 totalExp 為 0 時, 應回傳等級 1', () => {
      const levelSheet = new LevelSheet()

      const level = levelSheet.queryLevel(0)

      expect(level).toBe(1)
    })

    it('當 totalExp 為 999 時, 應回傳等級 1', () => {
      const levelSheet = new LevelSheet()

      const level = levelSheet.queryLevel(999)

      expect(level).toBe(1)
    })

    it('當 totalExp 為 1000 時, 應回傳等級 2', () => {
      const levelSheet = new LevelSheet()

      const level = levelSheet.queryLevel(1000)

      expect(level).toBe(2)
    })

    it('當 totalExp 為 2500 時, 應回傳等級 3', () => {
      const levelSheet = new LevelSheet()

      const level = levelSheet.queryLevel(2500)

      expect(level).toBe(3)
    })
  })
})
