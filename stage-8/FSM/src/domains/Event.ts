export abstract class Event<TPayload = unknown> {
  abstract readonly eventType: string
  private readonly payload: TPayload

  constructor(payload: TPayload) {
    this.payload = payload
  }

  getPayload(): TPayload {
    return this.payload
  }
}
