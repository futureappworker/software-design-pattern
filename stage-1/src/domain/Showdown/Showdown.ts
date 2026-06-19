import { stdin as input, stdout as output } from 'node:process'
import { createInterface } from 'node:readline/promises'
import { shouldBeWithinRange } from '../../utils/shouldBeWithinRange'
import { AI } from '../AI/AI'
import type { Card } from '../Card/Card'
import type { Deck } from '../Deck/Deck'
import { ExchangeEffect } from '../ExchangeEffect/ExchangeEffect'
import { Human } from '../Human/Human'
import type { Player } from '../Player/Player'
import { RoundPlay } from '../RoundPlay/RoundPlay'

type ShowdownProps = {
  players?: Player[]
  deck: Deck
  exchangeEffects?: ExchangeEffect[]
}

export class Showdown {
  private static readonly PLAYER_COUNT = 4

  private players: Player[] = []
  private deck: Deck
  private exchangeEffects: ExchangeEffect[] = []
  private roundPlays: RoundPlay[] = []

  /**
   * 初始化比大小遊戲
   * @param players 參賽玩家列表
   * @param deck 牌組
   * @param exchangeEffects 進行中的交換效果列表
   */
  constructor({ players = [], deck, exchangeEffects = [] }: ShowdownProps) {
    this.players = players
    this.deck = deck
    this.exchangeEffects = exchangeEffects
  }

  /**
   * 比較兩張牌的大小
   * 先比階級，階級相同再比花色
   * @returns 正數表示 cardA 較大，負數表示 cardB 較大，0 表示相同
   */
  private compareCards(cardA: Card, cardB: Card): number {
    const rankDiff = cardA.getRank() - cardB.getRank()
    if (rankDiff !== 0) {
      return rankDiff
    }
    return cardA.getSuit() - cardB.getSuit()
  }

  private setPlayers(players: Player[]) {
    this.players = [...players]
  }

  /**
   * 透過 CLI 設定 4 位參賽玩家
   * 依序為 P1~P4 設定名稱與類型（AI / Human）
   */
  private async setupPlayers() {
    const players: Player[] = []
    const usedNames: string[] = []

    for (let i = 0; i < Showdown.PLAYER_COUNT; i++) {
      const label = `P${i + 1}`
      const name = await this.askPlayerName(label, usedNames)
      usedNames.push(name)
      const isHuman = await this.askPlayerType(label)
      const props = {
        name,
        hand: [],
        point: 0,
        hasUsedExchange: false,
      }

      players.push(isHuman ? new Human(props) : new AI(props))
    }

    this.setPlayers(players)
  }

  private async askPlayerName(
    label: string,
    usedNames: string[],
  ): Promise<string> {
    const rl = createInterface({ input, output })
    const answer = await rl.question(`${label} 請輸入玩家名稱: `)
    rl.close()

    if (answer.trim() === '' || answer !== answer.trim()) {
      console.log('名稱不能為空或含有首尾空格, 請再輸入一次')
      return this.askPlayerName(label, usedNames)
    }

    if (usedNames.includes(answer)) {
      console.log('名稱已經被使用, 請再輸入一次')
      return this.askPlayerName(label, usedNames)
    }

    return answer
  }

  private async askPlayerType(label: string): Promise<boolean> {
    const rl = createInterface({ input, output })
    const answer = await rl.question(`${label} 玩家類型？(1) AI (2) Human: `)
    rl.close()

    switch (Number(answer)) {
      case 1:
        return false
      case 2:
        return true
      default:
        console.log('只能輸入範圍 1~2 的數字, 請再輸入一次')
        return this.askPlayerType(label)
    }
  }

  /**
   * 獲取參賽玩家列表
   * @returns 玩家列表
   */
  getPlayers() {
    return this.players
  }

  /**
   * 獲取牌組
   * @returns 牌組
   */
  getDeck() {
    return this.deck
  }

  /**
   * 新增參賽玩家
   * @param player 要新增的玩家
   * @throws 如果玩家數量超過 4 人
   */
  addPlayer(player: Player) {
    shouldBeWithinRange({
      name: 'players',
      num: this.players.length + 1,
      inclusiveMin: 1,
      inclusiveMax: Showdown.PLAYER_COUNT,
    })
    this.players.push(player)
  }

  /**
   * 新增交換效果
   * @param exchangeEffect 要新增的交換效果
   */
  addExchangeEffect(exchangeEffect: ExchangeEffect) {
    this.exchangeEffects.push(exchangeEffect)
  }

  /**
   * 新增本回合出牌紀錄
   * @param roundPlay 出牌紀錄
   * @throws 如果出牌數量超過玩家數量
   */
  addRoundPlay(roundPlay: RoundPlay) {
    shouldBeWithinRange({
      name: 'roundPlays',
      num: this.roundPlays.length + 1,
      inclusiveMin: 0,
      inclusiveMax: this.players.length,
    })
    this.roundPlays.push(roundPlay)
  }

  /**
   * 清空本回合出牌紀錄
   */
  clearRoundPlays() {
    this.roundPlays = []
  }

  /**
   * 移除交換效果
   * @param exchangeEffect 要移除的交換效果
   */
  removeExchangeEffect(exchangeEffect: ExchangeEffect) {
    this.exchangeEffects = this.exchangeEffects.filter(
      (effect) => effect !== exchangeEffect,
    )
  }

  /**
   * 交換兩位玩家的手牌
   * @param playerA 玩家 A
   * @param playerB 玩家 B
   */
  exchangeHands(playerA: Player, playerB: Player) {
    const handA = playerA.getHand()
    const handB = playerB.getHand()
    playerA.setHand(handB)
    playerB.setHand(handA)
  }

  /**
   * 公開本回合所有玩家的出牌
   */
  revealRoundPlays() {
    this.roundPlays.forEach((roundPlay) => {
      const player = roundPlay.getPlayer()
      const card = roundPlay.getCard()
      console.log(`${player.getName()} revealed ${card.toString()}`)
    })
  }

  /**
   * 從本回合出牌中決定勝者
   * 先比較牌的階級，階級相同則比較花色
   * @returns 本回合勝者
   * @throws 如果本回合無人出牌
   */
  determineRoundWinner(): Player {
    if (this.roundPlays.length === 0) {
      throw new Error('No round plays to determine winner')
    }

    const winningPlay = this.roundPlays.reduce((best, current) =>
      this.compareCards(current.getCard(), best.getCard()) > 0 ? current : best,
    )

    return winningPlay.getPlayer()
  }

  /**
   * 顯示本回合勝者
   * @param roundWinner 本回合勝者
   */
  showRoundWinner(roundWinner: Player) {
    console.log(`The round winner is ${roundWinner.getName()}`)
  }

  /**
   * 找出並顯示整場遊戲的勝者（點數最高者）
   * @returns 整場遊戲的勝者
   */
  private showWinner(): Player {
    const winner = this.players.reduce((best, current) =>
      current.getPoint() > best.getPoint() ? current : best,
    )

    console.log(`The winner is ${winner.getName()}`)
    return winner
  }

  /**
   * 結束遊戲，顯示所有玩家點數與最終勝者
   */
  finishGame() {
    this.players.forEach((player) => {
      console.log(`${player.getName()}: ${player.getPoint()} points`)
    })

    this.showWinner()

    console.log('Game finished')
  }

  /**
   * 開始遊戲
   */
  async startGame() {
    // 設定玩家
    await this.setupPlayers()

    // 洗牌
    this.deck.shuffle()

    // 直到所有 player 都擁有手牌 (Hand) 13 張牌為止
    while (this.players.some((player) => player.getHand().length !== 13)) {
      this.players.forEach((player) => {
        player.drawCardFromDeck(this.deck)
      })
    }

    // 還有人有手牌, 就一直執行
    // 這是每回合
    while (this.players.some((player) => player.getHand().length > 0)) {
      console.log('--------------------------------')
      console.log('New round starts')
      console.log('--------------------------------')

      // 每輪中，玩家在出牌前都能選擇要不要使用 「交換手牌 (Exchange Hands)」 特權（此特權每場遊戲各玩家皆只能使用一次），
      // 如果要的話，依序執行以下：
      // 1.
      // 玩家選擇要與哪位玩家（自己以外）交換手牌。
      // 2.
      // 選擇後，雙方的手牌交換。
      // 3.
      // 三回合後，雙方的手牌會交換回來。
      for (const exchangeEffect of [...this.exchangeEffects]) {
        // 推進一回合，剩餘生效回合數減 1
        exchangeEffect.tick()

        // 檢查交換效果是否已過期
        const isExpired = exchangeEffect.isExpired()

        // 如果交換效果已過期，則交換回手牌並移除交換效果
        if (isExpired) {
          // 交換回手牌
          this.exchangeHands(
            exchangeEffect.getPlayerA(),
            exchangeEffect.getPlayerB(),
          )
          // 移除交換效果
          this.removeExchangeEffect(exchangeEffect)
        }
      }

      for (const player of this.players) {
        if (player.getHand().length === 0) {
          continue
        }

        // 如果還沒換過手牌，則詢問玩家是否要使用交換手牌特權
        if (player.isUsedExchange() === false) {
          // 詢問玩家是否要使用交換手牌特權
          const isExchange = await player.decideExchange()
          if (isExchange) {
            // 取得其他玩家
            const players = this.players.filter((p) => p !== player)
            // 玩家選擇要與哪位玩家交換手牌
            const exchangeTarget = await player.chooseExchangeTarget(players)
            // 交換手牌
            this.exchangeHands(player, exchangeTarget)
            // 設定玩家已使用過交換
            player.setUsedExchange(true)
            // 新增交換效果
            this.addExchangeEffect(
              new ExchangeEffect({
                playerA: player,
                playerB: exchangeTarget,
              }),
            )
          }
        }

        // 玩家決定要出哪一張牌
        const card = await player.decideShowCardFromHand()

        // 新增本回合出牌紀錄
        this.addRoundPlay(
          new RoundPlay({
            player,
            card,
          }),
        )
      }

      console.log('\n\n')

      this.revealRoundPlays()

      const player = this.determineRoundWinner()

      player.setPoint(player.getPoint() + 1)

      console.log('\n')

      this.showRoundWinner(player)

      this.clearRoundPlays()

      console.log('\n\n')
    }

    this.finishGame()
  }
}
