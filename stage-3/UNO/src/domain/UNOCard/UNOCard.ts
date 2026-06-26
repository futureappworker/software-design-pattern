import { Card as CardGameFrameworkCard } from '../../../../CardGameFramework/src/index'

import { type UNOCardColor, unoCardColorLabels } from './UNOCardColor'
import { type UNOCardNumber, unoCardNumberLabels } from './UNOCardNumber'

type UNOCardProps = {
  color: UNOCardColor
  num: UNOCardNumber
}

export class UNOCard extends CardGameFrameworkCard {
  private color
  private num

  constructor({ color, num }: UNOCardProps) {
    super()
    this.color = color
    this.num = num
  }

  getColor() {
    return this.color
  }

  getNum() {
    return this.num
  }

  toString() {
    return `${unoCardColorLabels[this.color]} ${unoCardNumberLabels[this.num]}`
  }
}
