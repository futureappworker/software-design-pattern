import type { Card } from '../domain/Card/Card'
import { Rank } from '../domain/Card/Rank'

export function isSingle(cards: Card[]): boolean {
  return cards.length === 1
}

export function isPair(cards: Card[]): boolean {
  return cards.length === 2 && cards[0].getRank() === cards[1].getRank()
}

const BIG2_RANK_COUNT = Rank.Two - Rank.Three + 1

export function isStraight(cards: Card[]): boolean {
  if (cards.length !== 5) {
    return false
  }

  const orders = cards.map((card) => card.getRank() - Rank.Three)
  const uniqueOrders = new Set(orders)
  if (uniqueOrders.size !== 5) {
    return false
  }

  const sorted = [...uniqueOrders].sort((a, b) => a - b)
  const extended = [
    ...sorted,
    ...sorted.map((order) => order + BIG2_RANK_COUNT),
  ].sort((a, b) => a - b)

  for (let i = 0; i <= extended.length - 5; i++) {
    let consecutive = true
    for (let j = 1; j < 5; j++) {
      if (extended[i + j] - extended[i + j - 1] !== 1) {
        consecutive = false
        break
      }
    }
    if (consecutive) {
      return true
    }
  }

  return false
}

export function isFullHouse(cards: Card[]): boolean {
  if (cards.length !== 5) {
    return false
  }

  const rankCounts = new Map<number, number>()
  for (const card of cards) {
    const rank = card.getRank()
    rankCounts.set(rank, (rankCounts.get(rank) ?? 0) + 1)
  }

  if (rankCounts.size !== 2) {
    return false
  }

  const counts = [...rankCounts.values()].sort((a, b) => a - b)
  return counts[0] === 2 && counts[1] === 3
}

export function sortFullHouseCards(cards: Card[]): Card[] {
  const cardsByRank = new Map<number, Card[]>()
  for (const card of cards) {
    const rank = card.getRank()
    const group = cardsByRank.get(rank) ?? []
    group.push(card)
    cardsByRank.set(rank, group)
  }

  const sortCards = (group: Card[]) =>
    [...group].sort((a, b) => {
      const rankDiff = a.getRank() - b.getRank()
      if (rankDiff !== 0) {
        return rankDiff
      }
      return a.getSuit() - b.getSuit()
    })

  return [...cardsByRank.keys()]
    .sort((a, b) => a - b)
    .flatMap((rank) => sortCards(cardsByRank.get(rank) ?? []))
}
