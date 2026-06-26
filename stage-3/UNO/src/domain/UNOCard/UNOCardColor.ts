// 4 種顏色 (BLUE, RED, YELLOW, GREEN)
export enum UNOCardColor {
  BLUE = 1,
  RED = 2,
  YELLOW = 3,
  GREEN = 4,
}

export const unoCardColorLabels: Record<UNOCardColor, string> = {
  [UNOCardColor.BLUE]: '藍色',
  [UNOCardColor.RED]: '紅色',
  [UNOCardColor.YELLOW]: '黃色',
  [UNOCardColor.GREEN]: '綠色',
}
