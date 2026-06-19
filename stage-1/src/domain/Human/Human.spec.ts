import { createInterface } from 'node:readline/promises'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Card } from '../Card/Card'
import { Rank } from '../Card/Rank'
import { Suit } from '../Card/Suit'
import { Human, resetReadline } from './Human'

vi.mock('node:readline/promises', () => ({
  createInterface: vi.fn(),
}))

describe('Human', () => {
  const mockQuestion = vi.fn()
  const mockClose = vi.fn()

  const createHuman = (hand: Card[] = []) =>
    new Human({
      name: 'Alice',
      hand,
      point: 0,
      hasUsedExchange: false,
    })

  beforeEach(() => {
    vi.mocked(createInterface).mockReturnValue({
      question: mockQuestion,
      close: mockClose,
    } as never)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    mockQuestion.mockReset()
    mockClose.mockReset()
    resetReadline()
  })

  describe('decideExchange', () => {
    // 驗證輸入 1 時決定要交換
    it('should return true when user inputs 1', async () => {
      mockQuestion.mockResolvedValue('1')
      const human = createHuman()

      const result = await human.decideExchange()

      expect(result).toBe(true)
      expect(mockQuestion).toHaveBeenCalledWith(
        `${human.getName()} 是否要交換手牌？(1) 是 (2) 否: `,
      )
    })

    // 驗證輸入 2 時決定不交換
    it('should return false when user inputs 2', async () => {
      mockQuestion.mockResolvedValue('2')

      const result = await createHuman().decideExchange()

      expect(result).toBe(false)
    })

    // 驗證無效輸入後重新詢問並回傳正確結果
    it('should re-prompt and return true when input is invalid then 1', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      mockQuestion.mockResolvedValueOnce('3').mockResolvedValueOnce('1')

      const result = await createHuman().decideExchange()

      expect(result).toBe(true)
      expect(mockQuestion).toHaveBeenCalledTimes(2)
      expect(consoleSpy).toHaveBeenCalledWith(
        '只能輸入範圍 1~2 的數字, 請再輸入一次',
      )
    })
  })

  describe('decideShowCardFromHand', () => {
    const firstCard = new Card({ rank: Rank.TWO, suit: Suit.CLUB })
    const secondCard = new Card({ rank: Rank.KING, suit: Suit.HEART })

    // 驗證選擇第一張手牌並從手牌中移除
    it('should return selected card and remove it from hand', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      mockQuestion.mockResolvedValue('1')
      const human = createHuman([firstCard, secondCard])

      const result = await human.decideShowCardFromHand()

      expect(result.getRank()).toBe(Rank.TWO)
      expect(result.getSuit()).toBe(Suit.CLUB)
      expect(human.getHand()).toHaveLength(1)
      expect(human.getHand()[0].getRank()).toBe(Rank.KING)
      expect(mockQuestion).toHaveBeenCalledWith(
        `${human.getName()} 請選擇要出的手牌 (1~2): `,
      )
      expect(consoleSpy).toHaveBeenCalledWith('(1) 梅花 2')
      expect(consoleSpy).toHaveBeenCalledWith('(2) 愛心 K')
    })

    // 驗證選擇第二張手牌
    it('should return second card when user inputs 2', async () => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
      mockQuestion.mockResolvedValue('2')
      const human = createHuman([firstCard, secondCard])

      const result = await human.decideShowCardFromHand()

      expect(result.getRank()).toBe(Rank.KING)
      expect(result.getSuit()).toBe(Suit.HEART)
      expect(human.getHand()).toHaveLength(1)
    })

    // 驗證無效輸入後重新詢問
    it('should re-prompt when input is invalid then return selected card', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      mockQuestion.mockResolvedValueOnce('5').mockResolvedValueOnce('1')
      const human = createHuman([firstCard])

      const result = await human.decideShowCardFromHand()

      expect(result.getRank()).toBe(Rank.TWO)
      expect(mockQuestion).toHaveBeenCalledTimes(2)
      expect(consoleSpy).toHaveBeenCalledWith(
        '只能輸入範圍 1~1 的數字, 請再輸入一次',
      )
    })

    // 驗證手牌為空時拋出錯誤
    it('should throw error when hand is empty', async () => {
      await expect(createHuman().decideShowCardFromHand()).rejects.toThrow(
        'Hand is empty',
      )
    })
  })
})
