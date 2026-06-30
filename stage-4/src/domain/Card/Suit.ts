export enum Suit {
  Club = 1,
  Diamond = 2,
  Heart = 3,
  Spade = 4,
}

export const suitSymbols: Record<Suit, string> = {
  [Suit.Club]: 'C',
  [Suit.Diamond]: 'D',
  [Suit.Heart]: 'H',
  [Suit.Spade]: 'S',
}
