import type { Decision } from './Decision'

type PlayerProps = {
  number: number
}

export abstract class Player {
  private number: number

  constructor({ number }: PlayerProps) {
    this.number = number
  }

  getNumber() {
    return this.number
  }

  abstract decide(): Promise<Decision>
}
