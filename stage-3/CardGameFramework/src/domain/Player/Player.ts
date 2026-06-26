import { nanoid } from 'nanoid'
import { shouldBeGreaterThanOrEqual } from '../../utils/shouldBeGreaterThanOrEqual'
import type { Card } from '../Card/Card'
import type { Deck } from '../Deck/Deck'
import { Hand } from './Hand'

type PlayerProps = {
  name: string
}

export abstract class Player {
  private id: string
  private name: string
  private hand: Hand = new Hand({})
  private point: number = 0

  constructor({ name }: PlayerProps) {
    this.id = nanoid()
    this.name = name
  }

  getId() {
    return this.id
  }

  getName() {
    return this.name
  }

  getHand() {
    return this.hand.getCards()
  }

  getPoint() {
    return this.point
  }

  setName(name: string) {
    this.name = name
  }

  setPoint(point: number) {
    shouldBeGreaterThanOrEqual({
      name: 'Point',
      num: point,
      target: 0,
    })
    this.point = point
  }

  drawCardFromDeck(deck: Deck) {
    this.hand.drawCardFromDeck(deck)
  }

  removeCardFromHandAt(index: number): Card {
    return this.hand.removeCardAt(index)
  }

  abstract chooseCard(): Promise<Card>
}
