import { describe, expect, it } from 'vitest'
import { Card } from '../Card/Card'
import { Rank } from '../Card/Rank'
import { Suit } from '../Card/Suit'
import { Deck } from './Deck'

describe('Deck', () => {
  describe('getCards', () => {
    // 驗證返回所有卡
    it('should return all cards in the deck', () => {
      const cards = [
        new Card({ rank: Rank.TWO, suit: Suit.CLUB }),
        new Card({ rank: Rank.THREE, suit: Suit.DIAMOND }),
        new Card({ rank: Rank.FOUR, suit: Suit.HEART }),
      ]
      const deck = new Deck({ cards })

      const result = deck.getCards()

      expect(result).toHaveLength(3)
    })

    // 驗證修改副本不會影響原始牌組
    it('should not affect original deck when modifying returned array', () => {
      const cards = [
        new Card({ rank: Rank.TWO, suit: Suit.CLUB }),
        new Card({ rank: Rank.THREE, suit: Suit.DIAMOND }),
      ]
      const deck = new Deck({ cards })
      const originalLength = deck.getCards().length

      const result = deck.getCards()
      result.pop()

      expect(deck.getCards()).toHaveLength(originalLength)
    })

    // 驗證空牌組返回空數組
    it('should return empty array when deck has no cards', () => {
      const deck = new Deck({ cards: [] })

      const result = deck.getCards()

      expect(result).toHaveLength(0)
      expect(result).toEqual([])
    })
  })

  // 執行洗牌
  describe('shuffle', () => {
    // 驗證 洗牌不會改變卡的數量
    it('should not change the number of cards', () => {
      const cards = [
        new Card({ rank: Rank.TWO, suit: Suit.CLUB }),
        new Card({ rank: Rank.THREE, suit: Suit.DIAMOND }),
        new Card({ rank: Rank.FOUR, suit: Suit.HEART }),
        new Card({ rank: Rank.FIVE, suit: Suit.SPADE }),
      ]
      const deck = new Deck({ cards })

      deck.shuffle()

      expect(deck.getCards()).toHaveLength(4)
    })

    // 驗證 洗牌不會丟失卡或新增卡，只是改變順序
    it('should keep all cards unchanged', () => {
      const cards = [
        new Card({ rank: Rank.TWO, suit: Suit.CLUB }),
        new Card({ rank: Rank.THREE, suit: Suit.DIAMOND }),
        new Card({ rank: Rank.FOUR, suit: Suit.HEART }),
      ]
      const deck = new Deck({ cards })

      // 轉換成字符串後排序
      const originalCards = cards
        .map((c) => `${c.getRank()}-${c.getSuit()}`)
        .sort()

      deck.shuffle()

      // 轉換成字符串後排序
      const shuffledCards = deck
        .getCards()
        .map((c) => `${c.getRank()}-${c.getSuit()}`)
        .sort()

      expect(shuffledCards).toEqual(originalCards)
    })

    // 驗證 洗牌後卡的順序是否改變
    it('should rearrange cards (probabilistically)', () => {
      // 建立 10 張卡，順序是固定的（按階級順序排列）
      const cards = Array.from(
        { length: 10 },
        (_, i) => new Card({ rank: Rank.TWO + i, suit: Suit.CLUB }),
      )

      const deck = new Deck({ cards })

      // 記錄洗牌前的順序
      const originalOrder = deck.getCards().map((c) => c.getRank())

      // 執行洗牌
      deck.shuffle()

      // 記錄洗牌後的順序
      const shuffledOrder = deck.getCards().map((c) => c.getRank())
      expect(shuffledOrder).not.toEqual(originalOrder)
    })
  })

  // 隨機抽一張卡
  describe('drawCard', () => {
    // 驗證抽卡後牌數減少
    it('should reduce the number of cards after drawing', () => {
      const cards = [
        new Card({ rank: Rank.TWO, suit: Suit.CLUB }),
        new Card({ rank: Rank.THREE, suit: Suit.DIAMOND }),
        new Card({ rank: Rank.FOUR, suit: Suit.HEART }),
      ]
      const deck = new Deck({ cards })

      deck.drawCard()

      expect(deck.getCards()).toHaveLength(2)
    })

    // 驗證返回的卡確實存在於原始牌組
    it('should return a card that exists in the deck', () => {
      const cards = [
        new Card({ rank: Rank.TWO, suit: Suit.CLUB }),
        new Card({ rank: Rank.THREE, suit: Suit.DIAMOND }),
        new Card({ rank: Rank.FOUR, suit: Suit.HEART }),
      ]
      const deck = new Deck({ cards })
      const deckCards = deck.getCards()

      const drawnCard = deck.drawCard()

      const existsInOriginal = deckCards.some(
        (c) =>
          c.getRank() === drawnCard.getRank() &&
          c.getSuit() === drawnCard.getSuit(),
      )
      expect(existsInOriginal).toBe(true)
    })

    // 驗證可以連續抽卡直到牌組為空
    it('should draw all cards one by one', () => {
      const cards = [
        new Card({ rank: Rank.TWO, suit: Suit.CLUB }),
        new Card({ rank: Rank.THREE, suit: Suit.DIAMOND }),
      ]
      const deck = new Deck({ cards })

      const first = deck.drawCard()
      expect(deck.getCards()).toHaveLength(1)

      const second = deck.drawCard()
      expect(deck.getCards()).toHaveLength(0)

      expect(first).toBeDefined()
      expect(second).toBeDefined()
    })

    // 驗證從空牌組抽卡時拋出錯誤
    it('should throw error when drawing from empty deck', () => {
      const deck = new Deck({ cards: [] })

      expect(() => deck.drawCard()).toThrow('No cards left in deck')
    })
  })
})
