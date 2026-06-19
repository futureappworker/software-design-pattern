import { afterEach, describe, expect, it, vi } from 'vitest'
import { AI } from '../AI/AI'
import { Card } from '../Card/Card'
import { Rank } from '../Card/Rank'
import { Suit } from '../Card/Suit'
import { Deck } from '../Deck/Deck'
import { ExchangeEffect } from '../ExchangeEffect/ExchangeEffect'
import { RoundPlay } from '../RoundPlay/RoundPlay'
import { Showdown } from './Showdown'

const createPlayer = (
  name: string,
  options: { point?: number; hand?: Card[] } = {},
) =>
  new AI({
    name,
    hand: options.hand ?? [],
    point: options.point ?? 0,
    hasUsedExchange: false,
  })

const createShowdown = (players: ReturnType<typeof createPlayer>[] = []) =>
  new Showdown({
    players,
    deck: new Deck({ cards: [] }),
    exchangeEffects: [],
  })

const compareCards = (showdown: Showdown, cardA: Card, cardB: Card) =>
  (
    showdown as unknown as {
      compareCards: (a: Card, b: Card) => number
    }
  ).compareCards(cardA, cardB)

const getExchangeEffectsCount = (showdown: Showdown) =>
  (
    showdown as unknown as {
      exchangeEffects: ExchangeEffect[]
    }
  ).exchangeEffects.length

const callShowWinner = (showdown: Showdown) =>
  (
    showdown as unknown as {
      showWinner: () => ReturnType<typeof createPlayer>
    }
  ).showWinner()

const setPlayersOn = (
  showdown: Showdown,
  players: ReturnType<typeof createPlayer>[],
) => {
  ;(
    showdown as unknown as {
      setPlayers: (p: ReturnType<typeof createPlayer>[]) => void
    }
  ).setPlayers(players)
}

const mockSetupPlayers = (players: ReturnType<typeof createPlayer>[]) => {
  vi.spyOn(
    Showdown.prototype as unknown as { setupPlayers: () => Promise<void> },
    'setupPlayers',
  ).mockImplementation(async function (this: Showdown) {
    setPlayersOn(this, players)
  })
}

const createAIs = () =>
  ['Alice', 'Bob', 'Charlie', 'David'].map(
    (name) =>
      new AI({
        name,
        hand: [],
        point: 0,
        hasUsedExchange: false,
      }),
  )

describe('Showdown', () => {
  describe('startGame', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    // 驗證發牌、進行 13 回合並結束遊戲
    it('should deal 13 cards, play all rounds, and finish game', async () => {
      const players = createAIs()
      players.forEach((player) => {
        vi.spyOn(player, 'decideExchange').mockResolvedValue(false)
      })
      vi.spyOn(Math, 'random').mockReturnValue(0)

      const deck = new Deck({})
      deck.initialize()
      const shuffleSpy = vi.spyOn(deck, 'shuffle')
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      mockSetupPlayers(players)
      const showdown = new Showdown({ deck })

      await showdown.startGame()

      expect(shuffleSpy).toHaveBeenCalled()
      expect(showdown.getPlayers()).toHaveLength(4)
      players.forEach((player) => {
        expect(player.getHand()).toHaveLength(0)
      })
      expect(deck.getCards()).toHaveLength(0)
      expect(players.reduce((sum, player) => sum + player.getPoint(), 0)).toBe(
        13,
      )
      expect(consoleSpy).toHaveBeenCalledWith('Game finished')
    })

    // 驗證玩家選擇交換時會使用交換特權
    it('should use exchange privilege when player chooses to exchange', async () => {
      const players = createAIs()
      vi.spyOn(players[0], 'decideExchange').mockResolvedValue(true)
      vi.spyOn(players[0], 'chooseExchangeTarget').mockResolvedValue(players[1])
      players.slice(1).forEach((player) => {
        vi.spyOn(player, 'decideExchange').mockResolvedValue(false)
      })
      vi.spyOn(Math, 'random').mockReturnValue(0)
      vi.spyOn(console, 'log').mockImplementation(() => {})

      const deck = new Deck({})
      deck.initialize()

      mockSetupPlayers(players)
      const showdown = new Showdown({ deck })

      await showdown.startGame()

      expect(players[0].isUsedExchange()).toBe(true)
      expect(getExchangeEffectsCount(showdown)).toBe(0)
    })
  })

  describe('compareCards', () => {
    const showdown = createShowdown()

    // 驗證階級較大者勝
    it('should return positive when cardA has higher rank', () => {
      const cardA = new Card({ rank: Rank.KING, suit: Suit.CLUB })
      const cardB = new Card({ rank: Rank.TWO, suit: Suit.SPADE })

      expect(compareCards(showdown, cardA, cardB)).toBeGreaterThan(0)
    })

    // 驗證階級較小者負
    it('should return negative when cardA has lower rank', () => {
      const cardA = new Card({ rank: Rank.THREE, suit: Suit.HEART })
      const cardB = new Card({ rank: Rank.ACE, suit: Suit.CLUB })

      expect(compareCards(showdown, cardA, cardB)).toBeLessThan(0)
    })

    // 驗證階級相同時花色較大者勝
    it('should compare suit when ranks are equal', () => {
      const clubCard = new Card({ rank: Rank.SEVEN, suit: Suit.CLUB })
      const spadeCard = new Card({ rank: Rank.SEVEN, suit: Suit.SPADE })

      expect(compareCards(showdown, spadeCard, clubCard)).toBeGreaterThan(0)
      expect(compareCards(showdown, clubCard, spadeCard)).toBeLessThan(0)
    })

    // 驗證完全相同時回傳 0
    it('should return 0 when cards are equal', () => {
      const cardA = new Card({ rank: Rank.JACK, suit: Suit.DIAMOND })
      const cardB = new Card({ rank: Rank.JACK, suit: Suit.DIAMOND })

      expect(compareCards(showdown, cardA, cardB)).toBe(0)
    })
  })

  describe('addPlayer', () => {
    // 驗證可以新增第一位玩家
    it('should add first player', () => {
      const showdown = createShowdown()

      showdown.addPlayer(createPlayer('Alice'))

      expect(showdown.getPlayers()).toHaveLength(1)
      expect(showdown.getPlayers()[0].getName()).toBe('Alice')
    })

    // 驗證可以新增玩家至 4 人
    it('should add player when total becomes 4', () => {
      const showdown = createShowdown([
        createPlayer('Alice'),
        createPlayer('Bob'),
        createPlayer('Charlie'),
      ])

      showdown.addPlayer(createPlayer('David'))

      expect(showdown.getPlayers()).toHaveLength(4)
    })

    // 驗證玩家已達 4 人時新增拋出錯誤
    it('should throw error when players exceed maximum of 4', () => {
      const showdown = createShowdown([
        createPlayer('Alice'),
        createPlayer('Bob'),
        createPlayer('Charlie'),
        createPlayer('David'),
      ])

      expect(() => showdown.addPlayer(createPlayer('Eve'))).toThrow(
        'players must be within the range: 1~4',
      )
    })
  })

  describe('addRoundPlay', () => {
    const alice = createPlayer('Alice')
    const bob = createPlayer('Bob')

    // 驗證可以新增出牌紀錄
    it('should add round play within player count', () => {
      const showdown = createShowdown([alice, bob])
      const roundPlay = new RoundPlay({
        player: alice,
        card: new Card({ rank: Rank.ACE, suit: Suit.SPADE }),
      })

      showdown.addRoundPlay(roundPlay)

      expect(showdown.determineRoundWinner()).toBe(alice)
    })

    // 驗證出牌數量超過玩家數量時拋出錯誤
    it('should throw error when round plays exceed player count', () => {
      const showdown = createShowdown([alice, bob])

      showdown.addRoundPlay(
        new RoundPlay({
          player: alice,
          card: new Card({ rank: Rank.TWO, suit: Suit.CLUB }),
        }),
      )
      showdown.addRoundPlay(
        new RoundPlay({
          player: bob,
          card: new Card({ rank: Rank.THREE, suit: Suit.DIAMOND }),
        }),
      )

      expect(() =>
        showdown.addRoundPlay(
          new RoundPlay({
            player: alice,
            card: new Card({ rank: Rank.FOUR, suit: Suit.HEART }),
          }),
        ),
      ).toThrow('roundPlays must be within the range: 0~2')
    })
  })

  describe('removeExchangeEffect', () => {
    const alice = createPlayer('Alice')
    const bob = createPlayer('Bob')

    // 驗證可以移除指定的交換效果
    it('should remove the specified exchange effect', () => {
      const showdown = createShowdown([alice, bob])
      const effectToKeep = new ExchangeEffect({ playerA: alice, playerB: bob })
      const effectToRemove = new ExchangeEffect({
        playerA: bob,
        playerB: alice,
      })

      showdown.addExchangeEffect(effectToKeep)
      showdown.addExchangeEffect(effectToRemove)

      expect(getExchangeEffectsCount(showdown)).toBe(2)

      showdown.removeExchangeEffect(effectToRemove)

      expect(getExchangeEffectsCount(showdown)).toBe(1)
    })

    // 驗證移除不存在的交換效果不影響其他效果
    it('should keep existing effects when removing unknown effect', () => {
      const showdown = createShowdown([alice, bob])
      const effect = new ExchangeEffect({ playerA: alice, playerB: bob })
      const unknownEffect = new ExchangeEffect({
        playerA: bob,
        playerB: alice,
      })

      showdown.addExchangeEffect(effect)

      showdown.removeExchangeEffect(unknownEffect)

      expect(getExchangeEffectsCount(showdown)).toBe(1)
    })
  })

  describe('exchangeHands', () => {
    const handA = [new Card({ rank: Rank.TWO, suit: Suit.CLUB })]
    const handB = [
      new Card({ rank: Rank.KING, suit: Suit.HEART }),
      new Card({ rank: Rank.ACE, suit: Suit.SPADE }),
    ]
    const alice = createPlayer('Alice', { hand: handA })
    const bob = createPlayer('Bob', { hand: handB })

    // 驗證交換兩位玩家的手牌
    it('should swap hands between two players', () => {
      const showdown = createShowdown([alice, bob])

      showdown.exchangeHands(alice, bob)

      expect(alice.getHand()).toHaveLength(2)
      expect(alice.getHand()[0].getRank()).toBe(Rank.KING)
      expect(bob.getHand()).toHaveLength(1)
      expect(bob.getHand()[0].getRank()).toBe(Rank.TWO)
    })
  })

  describe('determineRoundWinner', () => {
    const alice = createPlayer('Alice')
    const bob = createPlayer('Bob')
    const charlie = createPlayer('Charlie')

    // 驗證階級最高者勝
    it('should return player with highest rank card', () => {
      const showdown = createShowdown([alice, bob, charlie])

      showdown.addRoundPlay(
        new RoundPlay({
          player: alice,
          card: new Card({ rank: Rank.TWO, suit: Suit.CLUB }),
        }),
      )
      showdown.addRoundPlay(
        new RoundPlay({
          player: bob,
          card: new Card({ rank: Rank.KING, suit: Suit.DIAMOND }),
        }),
      )
      showdown.addRoundPlay(
        new RoundPlay({
          player: charlie,
          card: new Card({ rank: Rank.FIVE, suit: Suit.SPADE }),
        }),
      )

      expect(showdown.determineRoundWinner()).toBe(bob)
    })

    // 驗證階級相同時花色較大者勝
    it('should compare suit when ranks are equal', () => {
      const showdown = createShowdown([alice, bob])

      showdown.addRoundPlay(
        new RoundPlay({
          player: alice,
          card: new Card({ rank: Rank.QUEEN, suit: Suit.CLUB }),
        }),
      )
      showdown.addRoundPlay(
        new RoundPlay({
          player: bob,
          card: new Card({ rank: Rank.QUEEN, suit: Suit.HEART }),
        }),
      )

      expect(showdown.determineRoundWinner()).toBe(bob)
    })

    // 驗證無人出牌時拋出錯誤
    it('should throw error when there are no round plays', () => {
      const showdown = createShowdown([alice, bob])

      expect(() => showdown.determineRoundWinner()).toThrow(
        'No round plays to determine winner',
      )
    })
  })

  describe('showWinner', () => {
    // 驗證回傳點數最高的玩家
    it('should return player with highest point', () => {
      const alice = createPlayer('Alice', { point: 10 })
      const bob = createPlayer('Bob', { point: 25 })
      const charlie = createPlayer('Charlie', { point: 15 })
      const showdown = createShowdown([alice, bob, charlie])
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const winner = callShowWinner(showdown)

      expect(winner).toBe(bob)
      expect(consoleSpy).toHaveBeenCalledWith('The winner is Bob')
    })

    // 驗證點數相同時回傳第一位玩家
    it('should return first player when points are tied', () => {
      const alice = createPlayer('Alice', { point: 10 })
      const bob = createPlayer('Bob', { point: 10 })
      const showdown = createShowdown([alice, bob])
      vi.spyOn(console, 'log').mockImplementation(() => {})

      expect(callShowWinner(showdown)).toBe(alice)
    })
  })
})
