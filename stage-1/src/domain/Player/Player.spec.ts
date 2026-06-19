import { describe, expect, it } from 'vitest'
import { Card } from '../Card/Card'
import { Rank } from '../Card/Rank'
import { Suit } from '../Card/Suit'
import { Deck } from '../Deck/Deck'
import { Player } from './Player'

class TestPlayer extends Player {
  async decideExchange(): Promise<boolean> {
    return false
  }

  async decideShowCardFromHand(): Promise<Card> {
    return this.removeCardFromHandAt(0)
  }

  removeCardAt(index: number): Card {
    return this.removeCardFromHandAt(index)
  }

  async chooseExchangeTarget(players: Player[]): Promise<Player> {
    return players[0]
  }
}

describe('Player', () => {
  describe('setName', () => {
    // 驗證可以設置有效的名字
    it('should set name with valid value', () => {
      const player = new TestPlayer({
        name: 'Alice',
        hand: [],
        point: 0,
        hasUsedExchange: false,
      })

      player.setName('Bob')

      expect(player.getName()).toBe('Bob')
    })

    // 驗證空字符串拋出錯誤
    it('should throw error when name is empty string', () => {
      const player = new TestPlayer({
        name: 'Alice',
        hand: [],
        point: 0,
        hasUsedExchange: false,
      })

      expect(() => player.setName('')).toThrow('Name must not be empty')
    })

    // 驗證只有空格的字符串拋出錯誤
    it('should throw error when name is only whitespace', () => {
      const player = new TestPlayer({
        name: 'Alice',
        hand: [],
        point: 0,
        hasUsedExchange: false,
      })

      expect(() => player.setName('   ')).toThrow('Name must not be empty')
    })

    // 驗證前面有空格會拋出錯誤
    it('should throw error when name has leading spaces', () => {
      const player = new TestPlayer({
        name: 'Alice',
        hand: [],
        point: 0,
        hasUsedExchange: false,
      })

      expect(() => player.setName('  Bob')).toThrow(
        'Name must not have leading or trailing spaces',
      )
    })

    // 驗證後面有空格會拋出錯誤
    it('should throw error when name has trailing spaces', () => {
      const player = new TestPlayer({
        name: 'Alice',
        hand: [],
        point: 0,
        hasUsedExchange: false,
      })

      expect(() => player.setName('Bob  ')).toThrow(
        'Name must not have leading or trailing spaces',
      )
    })
  })

  describe('setHand', () => {
    // 驗證可以設置空手牌
    it('should set hand with empty array', () => {
      const player = new TestPlayer({
        name: 'Alice',
        hand: [],
        point: 0,
        hasUsedExchange: false,
      })

      player.setHand([])

      expect(player.getHand()).toHaveLength(0)
    })

    // 驗證可以設置有效數量的卡（3 張）
    it('should set hand with valid number of cards', () => {
      const cards = [
        new Card({ rank: Rank.TWO, suit: Suit.CLUB }),
        new Card({ rank: Rank.THREE, suit: Suit.DIAMOND }),
        new Card({ rank: Rank.FOUR, suit: Suit.HEART }),
      ]
      const player = new TestPlayer({
        name: 'Alice',
        hand: [],
        point: 0,
        hasUsedExchange: false,
      })

      player.setHand(cards)

      expect(player.getHand()).toHaveLength(3)
    })

    // 驗證可以設置最大 13 張卡（邊界值）
    it('should set hand with maximum 13 cards', () => {
      const cards = Array.from(
        { length: 13 },
        (_, i) => new Card({ rank: Rank.TWO + i, suit: Suit.CLUB }),
      )
      const player = new TestPlayer({
        name: 'Alice',
        hand: [],
        point: 0,
        hasUsedExchange: false,
      })

      player.setHand(cards)

      expect(player.getHand()).toHaveLength(13)
    })

    // 驗證超過 13 張卡拋出錯誤
    it('should throw error when hand has more than 13 cards', () => {
      const cards = Array.from(
        { length: 14 },
        (_) => new Card({ rank: Rank.TWO, suit: Suit.CLUB }),
      )
      const player = new TestPlayer({
        name: 'Alice',
        hand: [],
        point: 0,
        hasUsedExchange: false,
      })

      expect(() => player.setHand(cards)).toThrow(
        'Hand must be within the range: 0~13',
      )
    })

    // 驗證修改返回的副本不影響原始手牌
    it('should return a copy of hand', () => {
      const cards = [
        new Card({ rank: Rank.TWO, suit: Suit.CLUB }),
        new Card({ rank: Rank.THREE, suit: Suit.DIAMOND }),
      ]
      const player = new TestPlayer({
        name: 'Alice',
        hand: [],
        point: 0,
        hasUsedExchange: false,
      })

      player.setHand(cards)
      const hand = player.getHand()
      hand.pop()

      expect(player.getHand()).toHaveLength(2)
    })
  })

  describe('setPoint', () => {
    // 驗證可以設置有效的點數值（100）
    it('should set point with valid value', () => {
      const player = new TestPlayer({
        name: 'Alice',
        hand: [],
        point: 0,
        hasUsedExchange: false,
      })

      player.setPoint(100)

      expect(player.getPoint()).toBe(100)
    })

    // 驗證可以設置為 0（邊界值）
    it('should set point to 0', () => {
      const player = new TestPlayer({
        name: 'Bob',
        hand: [],
        point: 10,
        hasUsedExchange: false,
      })

      player.setPoint(0)

      expect(player.getPoint()).toBe(0)
    })

    // 驗證負數（-1）拋出錯誤
    it('should throw error when point is negative', () => {
      const player = new TestPlayer({
        name: 'Charlie',
        hand: [],
        point: 0,
        hasUsedExchange: false,
      })

      expect(() => player.setPoint(-1)).toThrow(
        'Point must be greater than or equal 0',
      )
    })

    // 驗證更小負數（-100）拋出錯誤
    it('should throw error when point is very negative', () => {
      const player = new TestPlayer({
        name: 'David',
        hand: [],
        point: 0,
        hasUsedExchange: false,
      })

      expect(() => player.setPoint(-100)).toThrow(
        'Point must be greater than or equal 0',
      )
    })

    // 驗證構造時傳入負數拋出錯誤
    it('should throw error in constructor with negative point', () => {
      expect(
        () =>
          new TestPlayer({
            name: 'Eve',
            hand: [],
            point: -5,
            hasUsedExchange: false,
          }),
      ).toThrow('Point must be greater than or equal 0')
    })
  })

  describe('addCardToHand', () => {
    // 驗證可以添加卡到空手牌
    it('should add a card to empty hand', () => {
      const player = new TestPlayer({
        name: 'Alice',
        hand: [],
        point: 0,
        hasUsedExchange: false,
      })
      const card = new Card({ rank: Rank.TWO, suit: Suit.CLUB })

      player.addCardToHand(card)

      expect(player.getHand()).toHaveLength(1)
    })

    // 驗證可以添加卡到已有卡的手牌
    it('should add a card to existing hand', () => {
      const existingCard = new Card({ rank: Rank.TWO, suit: Suit.CLUB })
      const player = new TestPlayer({
        name: 'Alice',
        hand: [existingCard],
        point: 0,
        hasUsedExchange: false,
      })
      const newCard = new Card({ rank: Rank.THREE, suit: Suit.DIAMOND })

      player.addCardToHand(newCard)

      expect(player.getHand()).toHaveLength(2)
    })

    // 驗證可以添加卡直到 13 張（邊界值）
    it('should add card until reaching 13 cards', () => {
      const player = new TestPlayer({
        name: 'Alice',
        hand: [],
        point: 0,
        hasUsedExchange: false,
      })

      for (let i = 0; i < 13; i++) {
        const card = new Card({ rank: Rank.TWO + i, suit: Suit.CLUB })
        player.addCardToHand(card)
      }

      expect(player.getHand()).toHaveLength(13)
    })

    // 驗證添加超過 13 張卡拋出錯誤
    it('should throw error when adding more than 13 cards', () => {
      const player = new TestPlayer({
        name: 'Alice',
        hand: Array.from(
          { length: 13 },
          (_, i) => new Card({ rank: Rank.TWO + i, suit: Suit.CLUB }),
        ),
        point: 0,
        hasUsedExchange: false,
      })
      const card = new Card({ rank: Rank.ACE, suit: Suit.SPADE })

      expect(() => player.addCardToHand(card)).toThrow(
        'Hand must be within the range: 0~13',
      )
    })

    // 驗證添加的卡確實在手牌中（檢查等級和花色）
    it('should add the card to the hand', () => {
      const player = new TestPlayer({
        name: 'Alice',
        hand: [],
        point: 0,
        hasUsedExchange: false,
      })
      const card = new Card({ rank: Rank.KING, suit: Suit.HEART })

      player.addCardToHand(card)

      const hand = player.getHand()
      expect(hand[0].getRank()).toBe(Rank.KING)
      expect(hand[0].getSuit()).toBe(Suit.HEART)
    })
  })

  describe('drawCardFromDeck', () => {
    // 驗證可以從牌組抽一張卡到空手牌
    it('should draw a card from deck to empty hand', () => {
      const cards = [
        new Card({ rank: Rank.TWO, suit: Suit.CLUB }),
        new Card({ rank: Rank.THREE, suit: Suit.DIAMOND }),
      ]
      const deck = new Deck({ cards })
      const player = new TestPlayer({
        name: 'Alice',
        hand: [],
        point: 0,
        hasUsedExchange: false,
      })

      player.drawCardFromDeck(deck)

      expect(player.getHand()).toHaveLength(1)
    })

    // 驗證可以從牌組抽多張卡
    it('should draw multiple cards from deck', () => {
      const cards = [
        new Card({ rank: Rank.TWO, suit: Suit.CLUB }),
        new Card({ rank: Rank.THREE, suit: Suit.DIAMOND }),
        new Card({ rank: Rank.FOUR, suit: Suit.HEART }),
      ]
      const deck = new Deck({ cards })
      const player = new TestPlayer({
        name: 'Alice',
        hand: [],
        point: 0,
        hasUsedExchange: false,
      })

      player.drawCardFromDeck(deck)
      player.drawCardFromDeck(deck)

      expect(player.getHand()).toHaveLength(2)
    })

    // 驗證可以抽到 13 張卡（手牌上限）
    it('should draw cards until reaching 13 cards', () => {
      const cards = Array.from(
        { length: 13 },
        (_, i) => new Card({ rank: Rank.TWO + i, suit: Suit.CLUB }),
      )
      const deck = new Deck({ cards })
      const player = new TestPlayer({
        name: 'Alice',
        hand: [],
        point: 0,
        hasUsedExchange: false,
      })

      for (let i = 0; i < 13; i++) {
        player.drawCardFromDeck(deck)
      }

      expect(player.getHand()).toHaveLength(13)
    })

    // 驗證手牌已滿時抽卡拋出錯誤
    it('should throw error when hand is full', () => {
      const deckCards = [new Card({ rank: Rank.TWO, suit: Suit.CLUB })]
      const deck = new Deck({ cards: deckCards })
      const handCards = Array.from(
        { length: 13 },
        (_, i) => new Card({ rank: Rank.THREE + i, suit: Suit.CLUB }),
      )
      const player = new TestPlayer({
        name: 'Alice',
        hand: handCards,
        point: 0,
        hasUsedExchange: false,
      })

      expect(() => player.drawCardFromDeck(deck)).toThrow(
        'Hand must be within the range: 0~13',
      )
    })

    // 驗證牌組為空時拋出錯誤
    it('should throw error when deck is empty', () => {
      const deck = new Deck({ cards: [] })
      const player = new TestPlayer({
        name: 'Alice',
        hand: [],
        point: 0,
        hasUsedExchange: false,
      })

      expect(() => player.drawCardFromDeck(deck)).toThrow()
    })

    // 驗證抽取的卡確實在手牌中
    it('should have the drawn card in hand', () => {
      const card = new Card({ rank: Rank.KING, suit: Suit.HEART })
      const deck = new Deck({ cards: [card] })
      const player = new TestPlayer({
        name: 'Alice',
        hand: [],
        point: 0,
        hasUsedExchange: false,
      })

      player.drawCardFromDeck(deck)

      const hand = player.getHand()
      expect(hand[0].getRank()).toBe(Rank.KING)
      expect(hand[0].getSuit()).toBe(Suit.HEART)
    })
  })

  describe('removeCardFromHandAt', () => {
    // 驗證可以從手牌移除第一張卡
    it('should remove card at index 0', () => {
      const card = new Card({ rank: Rank.TWO, suit: Suit.CLUB })
      const player = new TestPlayer({
        name: 'Alice',
        hand: [card],
        point: 0,
        hasUsedExchange: false,
      })

      const removed = player.removeCardAt(0)

      expect(removed.getRank()).toBe(Rank.TWO)
      expect(removed.getSuit()).toBe(Suit.CLUB)
      expect(player.getHand()).toHaveLength(0)
    })

    // 驗證可以從手牌中間位置移除卡
    it('should remove card at middle index', () => {
      const cards = [
        new Card({ rank: Rank.TWO, suit: Suit.CLUB }),
        new Card({ rank: Rank.THREE, suit: Suit.DIAMOND }),
        new Card({ rank: Rank.FOUR, suit: Suit.HEART }),
      ]
      const player = new TestPlayer({
        name: 'Alice',
        hand: cards,
        point: 0,
        hasUsedExchange: false,
      })

      const removed = player.removeCardAt(1)

      expect(removed.getRank()).toBe(Rank.THREE)
      expect(player.getHand()).toHaveLength(2)
      expect(player.getHand()[0].getRank()).toBe(Rank.TWO)
      expect(player.getHand()[1].getRank()).toBe(Rank.FOUR)
    })

    // 驗證可以從手牌最後一張移除卡
    it('should remove card at last index', () => {
      const cards = [
        new Card({ rank: Rank.TWO, suit: Suit.CLUB }),
        new Card({ rank: Rank.KING, suit: Suit.SPADE }),
      ]
      const player = new TestPlayer({
        name: 'Alice',
        hand: cards,
        point: 0,
        hasUsedExchange: false,
      })

      const removed = player.removeCardAt(1)

      expect(removed.getRank()).toBe(Rank.KING)
      expect(player.getHand()).toHaveLength(1)
      expect(player.getHand()[0].getRank()).toBe(Rank.TWO)
    })

    // 驗證手牌為空時拋出錯誤
    it('should throw error when hand is empty', () => {
      const player = new TestPlayer({
        name: 'Alice',
        hand: [],
        point: 0,
        hasUsedExchange: false,
      })

      expect(() => player.removeCardAt(0)).toThrow('Hand is empty')
    })

    // 驗證索引為負數時拋出錯誤
    it('should throw error when index is negative', () => {
      const card = new Card({ rank: Rank.TWO, suit: Suit.CLUB })
      const player = new TestPlayer({
        name: 'Alice',
        hand: [card],
        point: 0,
        hasUsedExchange: false,
      })

      expect(() => player.removeCardAt(-1)).toThrow(
        'Hand index must be within the range: 0~0',
      )
    })

    // 驗證索引超出範圍時拋出錯誤
    it('should throw error when index is out of range', () => {
      const card = new Card({ rank: Rank.TWO, suit: Suit.CLUB })
      const player = new TestPlayer({
        name: 'Alice',
        hand: [card],
        point: 0,
        hasUsedExchange: false,
      })

      expect(() => player.removeCardAt(1)).toThrow(
        'Hand index must be within the range: 0~0',
      )
    })
  })
})
