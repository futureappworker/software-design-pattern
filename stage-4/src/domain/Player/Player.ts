import { shouldBeAlphanumericOrChinese } from '../../utils/shouldBeAlphanumericOrChinese'
import type { Card } from '../Card/Card'
import type { CardPattern } from '../CardPattern/CardPattern'
import type { GameLogger } from '../GameLogger/GameLogger'
import type { RuleEngine } from '../RuleEngine/RuleEngine'
import { Hand } from './Hand/Hand'

export enum ChooseResultType {
  Play = 'Play',
  Pass = 'Pass',
}

export type ChooseResult = {
  type: ChooseResultType
  cardPattern?: CardPattern
}

type PlayerProps = {
  name: string
}

export abstract class Player {
  private name!: string
  private hand: Hand

  constructor({ name }: PlayerProps) {
    this.hand = new Hand({})
    this.setName(name)
  }

  getName() {
    return this.name
  }

  private setName(name: string) {
    // 名字為字母或數字的組成 （A-Z+a-z+0-9+中文字，有區分大小寫）
    shouldBeAlphanumericOrChinese({ name: 'Name', str: name })

    this.name = name
  }

  getHand() {
    return this.hand
  }

  take(card: Card) {
    this.hand.addCard(card)
  }

  abstract chooseCards(
    topPlay: CardPattern | null,
    topPlayerIndex: number,
    ruleEngine: RuleEngine,
    gameLogger: GameLogger,
  ): Promise<ChooseResult>
}
