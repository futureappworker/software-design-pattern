import type { BaseRequestDecorator } from '../BaseRequestDecorator'
import type { FakeHttpClient, HttpRequest } from '../FakeHttpClient'

export abstract class RequestDecoratorProcessor
  implements BaseRequestDecorator
{
  next: BaseRequestDecorator

  constructor(next: BaseRequestDecorator) {
    this.next = next
  }

  abstract request(httpClient: FakeHttpClient, requests: HttpRequest[]): void

  getNext() {
    return this.next
  }
}
