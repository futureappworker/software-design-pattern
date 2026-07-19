import type { BaseRequestDecorator } from '../BaseRequestDecorator'
import type { FakeHttpClient, HttpRequest } from '../FakeHttpClient'

export class RequestDecorator implements BaseRequestDecorator {
  request(_httpClient: FakeHttpClient, requests: HttpRequest[]) {
    // 如果 requests 是空的，就 throw error
    if (requests.length === 0) {
      throw new Error('requests is empty')
    }

    // 直接 log requests[0]
    console.log(`\n[SUCCESS] \nurl: ${requests[0].url} \nhost: ${requests[0].host}\n`)
  }
}
