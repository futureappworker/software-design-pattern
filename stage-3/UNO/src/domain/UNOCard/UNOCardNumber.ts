// 10 個數字 (0~9)
export enum UNOCardNumber {
  ZERO = 0,
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
  SEVEN = 7,
  EIGHT = 8,
  NINE = 9,
}

export const unoCardNumberLabels: Record<UNOCardNumber, string> = {
  [UNOCardNumber.ZERO]: '0',
  [UNOCardNumber.ONE]: '1',
  [UNOCardNumber.TWO]: '2',
  [UNOCardNumber.THREE]: '3',
  [UNOCardNumber.FOUR]: '4',
  [UNOCardNumber.FIVE]: '5',
  [UNOCardNumber.SIX]: '6',
  [UNOCardNumber.SEVEN]: '7',
  [UNOCardNumber.EIGHT]: '8',
  [UNOCardNumber.NINE]: '9',
}
