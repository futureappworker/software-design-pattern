export enum CardPatternType {
  Single = 0,
  Pair = 1,
  Straight = 2,
  FullHouse = 3,
}

export const cardPatternTypeSymbols: Record<CardPatternType, string> = {
  [CardPatternType.Single]: '單張',
  [CardPatternType.Pair]: '對子',
  [CardPatternType.Straight]: '順子',
  [CardPatternType.FullHouse]: '葫蘆',
}
