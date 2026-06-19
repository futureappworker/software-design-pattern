// 梅花 (Club)、菱形 (Diamond)、愛心 (Heart)、黑桃 (Spade)
// 花色由小到大依序為：梅花 (Club)、菱形 (Diamond)、愛心 (Heart)、黑桃 (Spade)
export enum Suit {
  CLUB = 1,
  DIAMOND = 2,
  HEART = 3,
  SPADE = 4,
}

export const suitLabels: Record<Suit, string> = {
  [Suit.CLUB]: '梅花',
  [Suit.DIAMOND]: '菱形',
  [Suit.HEART]: '愛心',
  [Suit.SPADE]: '黑桃',
}
