import type { FakeHttpClient, HttpRequest } from '../FakeHttpClient'
import { RequestDecoratorProcessor } from './RequestDecoratorProcessor'

export class LoadBalancing extends RequestDecoratorProcessor {
  request(httpClient: FakeHttpClient, requests: HttpRequest[]) {
    if (requests.length === 0) {
      throw new Error('requests is empty')
    }

    const hostIpMapping = httpClient.getHostIpMapping()
    if (!hostIpMapping) {
      this.next.request(httpClient, requests)
      return
    }

    // ServiceDiscovery 之後 host 會是 IP，需用 IP 反查 domain
    const domainMap =
      hostIpMapping[requests[0].host] ??
      Object.values(hostIpMapping).find((dm) =>
        dm.endpoints.some((endpoint) => endpoint.ip === requests[0].host),
      )
    if (!domainMap) {
      this.next.request(httpClient, requests)
      return
    }

    const { endpoints, loadBalancingIndex } = domainMap
    // 如果 loadBalancingIndex 是 -1, 從 0 開始找
    // 如果 loadBalancingIndex 不是 -1, 就從 loadBalancingIndex + 1 開始找
    // 就在 endpoints 中 找出第一個 isAvailable 是 ture，並且有在 requests 中的
    // 最後把那個的索引設定為 loadBalancingIndex
    let index = loadBalancingIndex
    if (index === -1) {
      index = 0
    } else {
      index = index + 1
    }

    for (let i = index; i < endpoints.length; i++) {
      const endpoint = endpoints[i]
      if (endpoint.isAvailable) {
        // loop requests
        for (const requestItem of requests) {
          if (requestItem.host === endpoint.ip) {
            domainMap.loadBalancingIndex = endpoints.indexOf(endpoint)

            httpClient.setHostIpMapping(hostIpMapping)
            this.next.request(httpClient, [requestItem])
            return
          }
        }
      }
    }

    // 都找不到，就呼叫下一個 processor
    this.next.request(httpClient, requests)
  }
}
