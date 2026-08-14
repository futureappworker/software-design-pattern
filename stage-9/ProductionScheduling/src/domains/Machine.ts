import { nanoid } from 'nanoid'

export class Machine {
  private id: string = nanoid()

  getId(): string {
    return this.id
  }
}
