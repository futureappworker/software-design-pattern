import type { Card } from '../domain/PlayingCard/PlayingCard'

// 先比較牌的階級，此時階級較大者勝，如果階級相同則比較花色，此時花色較大者勝。
// 階級由小到大依序為：2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A
// 花色由小到大依序為：梅花 (Club)、菱形 (Diamond)、愛心 (Heart)、黑桃 (Spade)
export function compareCards(cardA: Card, cardB: Card): number {
  const rankDiff = cardA.getRank() - cardB.getRank()
  if (rankDiff !== 0) {
    return rankDiff
  }
  return cardA.getSuit() - cardB.getSuit()
}
