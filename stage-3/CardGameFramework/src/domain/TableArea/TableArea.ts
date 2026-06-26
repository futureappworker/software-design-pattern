import type { Card } from '../Card/Card'

type PlayerId = string

type PlayerAreas = Map<PlayerId, Card[]>

type TableAreaProps = {
  centerPile?: Card[]
  playerAreas?: PlayerAreas
}

export class TableArea {
  // 桌面中央牌堆
  private centerPile: Card[] = []
  // 各玩家的桌面區域
  private playerAreas: PlayerAreas = new Map()

  constructor({ centerPile = [], playerAreas = new Map() }: TableAreaProps) {
    this.setCenterPile(centerPile)
    this.setPlayerAreas(playerAreas)
  }

  /**
   * 獲取桌面中央牌堆
   * @returns 中央牌堆
   */
  getCenterPile() {
    return [...this.centerPile]
  }

  /**
   * 獲取指定玩家的桌面區域
   * @param playerId 玩家 ID
   * @returns 該玩家桌面區域中的卡片列表副本（修改不會影響原始區域）
   */
  getPlayerArea(playerId: PlayerId): Card[] {
    return [...(this.playerAreas.get(playerId) ?? [])]
  }

  /**
   * 獲取所有玩家的桌面區域
   * @returns 玩家桌面區域對應表
   */
  getPlayerAreas() {
    return new Map(
      [...this.playerAreas].map(([playerId, cards]) => [playerId, [...cards]]),
    )
  }

  /**
   * 設定桌面中央牌堆
   * @param centerPile 要設定的卡片列表
   */
  setCenterPile(centerPile: Card[]) {
    this.centerPile = [...centerPile]
  }

  /**
   * 設定所有玩家的桌面區域
   * @param playerAreas 玩家 ID 與桌面區域卡片的對應表
   */
  setPlayerAreas(playerAreas: Map<PlayerId, Card[]>) {
    this.playerAreas = new Map(
      [...playerAreas].map(([playerId, cards]) => [playerId, [...cards]]),
    )
  }

  /**
   * 設定指定玩家的桌面區域
   * @param playerId 玩家 ID
   * @param cards 要設定的卡片列表
   */
  setPlayerArea(playerId: PlayerId, cards: Card[]) {
    this.playerAreas.set(playerId, [...cards])
  }

  /**
   * 將一張卡加入桌面中央牌堆
   * @param card 要加入的卡片
   */
  addCardToCenterPile(card: Card) {
    this.centerPile.push(card)
  }

  /**
   * 將多張卡加入桌面中央牌堆
   * @param cards 要加入的卡片列表
   */
  addCardsToCenterPile(cards: Card[]) {
    this.centerPile.push(...cards)
  }

  /**
   * 將一張卡加入指定玩家的桌面區域
   * @param playerId 玩家 ID
   * @param card 要加入的卡片
   */
  addCardToPlayerArea(playerId: PlayerId, card: Card) {
    this.playerAreas.get(playerId)?.push(card)
  }

  /**
   * 取走桌面中央牌堆的所有卡並清空牌堆
   * @returns 中央牌堆中的卡片列表
   */
  drainCenterPile(): Card[] {
    const cards = this.centerPile
    this.centerPile = []
    return cards
  }

  /**
   * 取走指定玩家桌面區域的所有卡並移除該區域
   * @param playerId 玩家 ID
   * @returns 該玩家桌面區域中的卡片列表
   */
  drainPlayerArea(playerId: PlayerId): Card[] {
    const cards = this.playerAreas.get(playerId) ?? []
    this.playerAreas.delete(playerId)
    return cards
  }

  /**
   * 取走所有玩家桌面區域的卡並清空所有區域
   * @returns 所有玩家桌面區域中的卡片列表
   */
  drainPlayerAreas(): Card[] {
    const cards = [...this.playerAreas.values()].flat()
    for (const playerId of this.playerAreas.keys()) {
      this.playerAreas.set(playerId, [])
    }
    return cards
  }

  /**
   * 取走桌面中央牌堆與所有玩家桌面區域的卡並清空
   * @returns 中央牌堆與所有玩家桌面區域中的卡片列表
   */
  drainAll(): Card[] {
    const cards = [...this.drainCenterPile(), ...this.drainPlayerAreas()]
    return cards
  }
}
