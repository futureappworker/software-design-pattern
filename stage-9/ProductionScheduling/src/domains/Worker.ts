import { nanoid } from 'nanoid'

export class Worker {
  private id: string = nanoid()

  getId(): string {
    return this.id
  }
}
