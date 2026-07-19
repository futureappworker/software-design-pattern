import { discoveryHost } from '../../utils/discoveryHost'
import type { FakeHttpClient, HttpRequest } from '../FakeHttpClient'
import { RequestDecoratorProcessor } from './RequestDecoratorProcessor'

export class ServiceDiscovery extends RequestDecoratorProcessor {
  request(httpClient: FakeHttpClient, requests: HttpRequest[]) {
    const failureCooldownPeriod = httpClient.getFailureCooldownPeriod()

    const hostIpMapping = httpClient.getHostIpMapping()

    if (!hostIpMapping) {
      throw new Error('hostIpMapping is not set')
    }

    if (requests.length === 0) {
      throw new Error('requests is empty')
    }

    const request = requests[0]
    if (!hostIpMapping[request.host]) {
      // 不存在，就丟出錯誤
      throw new Error(`Host ${request.host} not found in hostIpMapping`)
    }

    const domainMap = hostIpMapping[request.host]
    const { endpoints } = domainMap

    // 每個 endpoints 都要呼叫 discoveryHost 來發現 host
    for (const endpoint of endpoints) {
      // 失敗後有冷卻期：retryAt 仍在未來就跳過，不重 Discovery
      if (endpoint.retryAt && endpoint.retryAt > new Date()) {
        continue
      }

      const isSuccess = discoveryHost(endpoint.ip)
      if (isSuccess) {
        endpoint.isAvailable = true
        endpoint.retryAt = null
      }
      if (!isSuccess) {
        endpoint.isAvailable = false
        endpoint.retryAt = new Date(Date.now() + failureCooldownPeriod)
      }
    }

    httpClient.setHostIpMapping(hostIpMapping)

    // 對所有的 endpoints，找出 isAvailable 的
    // host 換成 IP 給後續 LoadBalancing / Blacklist 用，但保留原始 url / path
    const availableEndpoints = endpoints.filter(
      (endpoint) => endpoint.isAvailable,
    )
    if (availableEndpoints.length === 0) {
      throw new Error('No available hosts')
    }
    const availableRequests = availableEndpoints.map((endpoint) => {
      return {
        ...request,
        host: endpoint.ip,
      }
    })
    this.next.request(httpClient, availableRequests)
  }
}
