import type { FakeHttpClient, HttpRequest } from '../FakeHttpClient'
import { RequestDecoratorProcessor } from './RequestDecoratorProcessor'

export class BlacklistManager extends RequestDecoratorProcessor {
  request(httpClient: FakeHttpClient, requests: HttpRequest[]) {
    const blacklist = httpClient.getBlacklist()
    if (!blacklist || blacklist.length === 0) {
      this.next.request(httpClient, requests)
      return
    }

    // loop requests
    // 如果 request.host 在 blacklist 中，就 throw error
    for (const request of requests) {
      if (blacklist.includes(request.host)) {
        throw new Error(`Host ${request.host} is in blacklist`)
      }
    }

    this.next.request(httpClient, requests)
  }
}
