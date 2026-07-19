import type { FakeHttpClient, HttpRequest } from './FakeHttpClient'

export interface BaseRequestDecorator {
  request(httpClient: FakeHttpClient, requests: HttpRequest[]): void
}
