import { describe, expect, it } from 'vitest'
import { AI } from '../AI/AI'
import { ExchangeEffect } from './ExchangeEffect'

const createPlayer = (name: string) =>
  new AI({
    name,
    hand: [],
    point: 0,
    hasUsedExchange: false,
  })

describe('ExchangeEffect', () => {
  describe('setRemainingRounds', () => {
    // 驗證可以設置有效的剩餘回合數
    it('should set remainingRounds with valid value', () => {
      const effect = new ExchangeEffect({
        playerA: createPlayer('Alice'),
        playerB: createPlayer('Bob'),
        remainingRounds: 5,
      })

      expect(effect.getRemainingRounds()).toBe(5)
    })

    // 驗證未指定時預設為 3
    it('should default remainingRounds to 3', () => {
      const effect = new ExchangeEffect({
        playerA: createPlayer('Alice'),
        playerB: createPlayer('Bob'),
      })

      expect(effect.getRemainingRounds()).toBe(3)
    })

    // 驗證可以設置為 0（邊界值）
    it('should set remainingRounds to 0', () => {
      const effect = new ExchangeEffect({
        playerA: createPlayer('Alice'),
        playerB: createPlayer('Bob'),
        remainingRounds: 0,
      })

      expect(effect.getRemainingRounds()).toBe(0)
    })

    // 驗證負數拋出錯誤
    it('should throw error when remainingRounds is negative', () => {
      expect(
        () =>
          new ExchangeEffect({
            playerA: createPlayer('Alice'),
            playerB: createPlayer('Bob'),
            remainingRounds: -1,
          }),
      ).toThrow('remainingRounds must be greater than or equal 0')
    })
  })

  describe('tick', () => {
    // 驗證推進一回合後剩餘回合數減 1
    it('should decrease remainingRounds by 1', () => {
      const effect = new ExchangeEffect({
        playerA: createPlayer('Alice'),
        playerB: createPlayer('Bob'),
        remainingRounds: 3,
      })

      effect.tick()

      expect(effect.getRemainingRounds()).toBe(2)
    })

    // 驗證連續推進多回合
    it('should decrease remainingRounds over multiple ticks', () => {
      const effect = new ExchangeEffect({
        playerA: createPlayer('Alice'),
        playerB: createPlayer('Bob'),
        remainingRounds: 3,
      })

      effect.tick()
      effect.tick()

      expect(effect.getRemainingRounds()).toBe(1)
    })

    // 驗證剩餘回合數為 0 時推進拋出錯誤
    it('should throw error when remainingRounds is already 0', () => {
      const effect = new ExchangeEffect({
        playerA: createPlayer('Alice'),
        playerB: createPlayer('Bob'),
        remainingRounds: 0,
      })

      expect(() => effect.tick()).toThrow(
        'remainingRounds must be greater than or equal 0',
      )
    })
  })

  describe('isExpired', () => {
    // 驗證剩餘回合數大於 0 時未過期
    it('should return false when remainingRounds is greater than 0', () => {
      const effect = new ExchangeEffect({
        playerA: createPlayer('Alice'),
        playerB: createPlayer('Bob'),
        remainingRounds: 3,
      })

      expect(effect.isExpired()).toBe(false)
    })

    // 驗證剩餘回合數為 0 時已過期
    it('should return true when remainingRounds is 0', () => {
      const effect = new ExchangeEffect({
        playerA: createPlayer('Alice'),
        playerB: createPlayer('Bob'),
        remainingRounds: 0,
      })

      expect(effect.isExpired()).toBe(true)
    })

    // 驗證推進至 0 回合後已過期
    it('should return true after all rounds have ticked down', () => {
      const effect = new ExchangeEffect({
        playerA: createPlayer('Alice'),
        playerB: createPlayer('Bob'),
        remainingRounds: 2,
      })

      effect.tick()
      expect(effect.isExpired()).toBe(false)

      effect.tick()
      expect(effect.isExpired()).toBe(true)
    })
  })
})
