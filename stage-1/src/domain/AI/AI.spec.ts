import { afterEach, describe, expect, it, vi } from 'vitest'
import { Card } from '../Card/Card'
import { Rank } from '../Card/Rank'
import { Suit } from '../Card/Suit'
import { AI } from './AI'

describe('AI', () => {
  describe('decideExchange', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    // 驗證隨機值小於 0.5 時決定要交換
    it('should return true when random value is less than 0.5', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.4)
      const ai = new AI({
        name: 'AI',
        hand: [],
        point: 0,
        hasUsedExchange: false,
      })

      const result = await ai.decideExchange()

      expect(result).toBe(true)
    })

    // 驗證隨機值大於等於 0.5 時決定不交換
    it('should return false when random value is greater than or equal to 0.5', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5)
      const ai = new AI({
        name: 'AI',
        hand: [],
        point: 0,
        hasUsedExchange: false,
      })

      const result = await ai.decideExchange()

      expect(result).toBe(false)
    })
  })

  describe('decideShowCardFromHand', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    const firstCard = new Card({ rank: Rank.TWO, suit: Suit.CLUB })
    const secondCard = new Card({ rank: Rank.KING, suit: Suit.HEART })

    // 驗證隨機選擇第一張手牌並從手牌中移除
    it('should return first card and remove it from hand when random is 0', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)
      const ai = new AI({
        name: 'AI',
        hand: [firstCard, secondCard],
        point: 0,
        hasUsedExchange: false,
      })

      const result = await ai.decideShowCardFromHand()

      expect(result.getRank()).toBe(Rank.TWO)
      expect(result.getSuit()).toBe(Suit.CLUB)
      expect(ai.getHand()).toHaveLength(1)
      expect(ai.getHand()[0].getRank()).toBe(Rank.KING)
    })

    // 驗證隨機選擇第二張手牌
    it('should return second card when random selects last index', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.99)
      const ai = new AI({
        name: 'AI',
        hand: [firstCard, secondCard],
        point: 0,
        hasUsedExchange: false,
      })

      const result = await ai.decideShowCardFromHand()

      expect(result.getRank()).toBe(Rank.KING)
      expect(result.getSuit()).toBe(Suit.HEART)
      expect(ai.getHand()).toHaveLength(1)
    })

    // 驗證手牌為空時拋出錯誤
    it('should throw error when hand is empty', async () => {
      const ai = new AI({
        name: 'AI',
        hand: [],
        point: 0,
        hasUsedExchange: false,
      })

      await expect(ai.decideShowCardFromHand()).rejects.toThrow('Hand is empty')
    })
  })

  describe('chooseExchangeTarget', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    const firstPlayer = new AI({
      name: 'Bob',
      hand: [],
      point: 0,
      hasUsedExchange: false,
    })
    const secondPlayer = new AI({
      name: 'Charlie',
      hand: [],
      point: 0,
      hasUsedExchange: false,
    })

    // 驗證隨機選擇第一個玩家
    it('should return first player when random is 0', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)
      const ai = new AI({
        name: 'AI',
        hand: [],
        point: 0,
        hasUsedExchange: false,
      })

      const result = await ai.chooseExchangeTarget([firstPlayer, secondPlayer])

      expect(result.getName()).toBe('Bob')
    })

    // 驗證隨機選擇最後一個玩家
    it('should return last player when random selects last index', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.99)
      const ai = new AI({
        name: 'AI',
        hand: [],
        point: 0,
        hasUsedExchange: false,
      })

      const result = await ai.chooseExchangeTarget([firstPlayer, secondPlayer])

      expect(result.getName()).toBe('Charlie')
    })

    // 驗證候選玩家為空時拋出錯誤
    it('should throw error when no players available', async () => {
      const ai = new AI({
        name: 'AI',
        hand: [],
        point: 0,
        hasUsedExchange: false,
      })

      await expect(ai.chooseExchangeTarget([])).rejects.toThrow(
        'No exchange target available',
      )
    })
  })
})
