// 梅花 (Club)、菱形 (Diamond)、愛心 (Heart)、黑桃 (Spade)
// 花色由小到大依序為：梅花 (Club)、菱形 (Diamond)、愛心 (Heart)、黑桃 (Spade)
export enum PlayingCardSuit {
  CLUB = 1,
  DIAMOND = 2,
  HEART = 3,
  SPADE = 4,
}

export const playingCardSuitLabels: Record<PlayingCardSuit, string> = {
  [PlayingCardSuit.CLUB]: '梅花',
  [PlayingCardSuit.DIAMOND]: '菱形',
  [PlayingCardSuit.HEART]: '愛心',
  [PlayingCardSuit.SPADE]: '黑桃',
}
