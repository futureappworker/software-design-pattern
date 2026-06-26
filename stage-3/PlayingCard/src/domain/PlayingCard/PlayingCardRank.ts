// 階級由小到大依序為：2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A
export enum PlayingCardRank {
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
  SEVEN = 7,
  EIGHT = 8,
  NINE = 9,
  TEN = 10,
  JACK = 11,
  QUEEN = 12,
  KING = 13,
  ACE = 14,
}

export const playingCardRankLabels: Record<PlayingCardRank, string> = {
  [PlayingCardRank.TWO]: '2',
  [PlayingCardRank.THREE]: '3',
  [PlayingCardRank.FOUR]: '4',
  [PlayingCardRank.FIVE]: '5',
  [PlayingCardRank.SIX]: '6',
  [PlayingCardRank.SEVEN]: '7',
  [PlayingCardRank.EIGHT]: '8',
  [PlayingCardRank.NINE]: '9',
  [PlayingCardRank.TEN]: '10',
  [PlayingCardRank.JACK]: 'J',
  [PlayingCardRank.QUEEN]: 'Q',
  [PlayingCardRank.KING]: 'K',
  [PlayingCardRank.ACE]: 'A',
}
