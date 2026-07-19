import fs from 'node:fs'
import { parseHttpRequest } from '../utils/parseHttpRequest'
import type { BaseRequestDecorator } from './BaseRequestDecorator'
import { RequestDecorator } from './RequestDecorator/RequestDecorator'

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export type HttpRequest = {
  url: string
  scheme: string
  host: string
  path: string
  httpMethod: HttpMethod
}

type ServerEndpoint = {
  ip: string
  isAvailable: boolean // 是否可用
  retryAt?: Date | null // 重新嘗試時間，失效時間 + 冷卻時間（例如 10 分鐘）
}

export type HostIpMapping = {
  [domain: string]: {
    endpoints: ServerEndpoint[]
    loadBalancingIndex: number // -1 代表沒有用過
  }
}

type FakeHttpClientProps = {
  hostIpFilePath?: string
  requestDecorator?: BaseRequestDecorator
  blacklistFilePath?: string
}

export class FakeHttpClient {
  private readonly FAILURE_COOLDOWN_PERIOD = 600000 // 10 分鐘
  private hostIpMapping: HostIpMapping | null = null
  private requestDecorator: BaseRequestDecorator | null = null
  private blacklist: string[] = []

  constructor({
    hostIpFilePath,
    requestDecorator,
    blacklistFilePath,
  }: FakeHttpClientProps) {
    if (hostIpFilePath) {
      this.setHostIpMappingByFile(hostIpFilePath)
    }
    if (blacklistFilePath) {
      this.setBlacklist(blacklistFilePath)
    }
    if (requestDecorator) {
      this.requestDecorator = requestDecorator
    }
  }

  getFailureCooldownPeriod() {
    return this.FAILURE_COOLDOWN_PERIOD
  }

  getHostIpMapping() {
    return this.hostIpMapping
  }

  getBlacklist() {
    return this.blacklist
  }

  setHostIpMapping(hostIpMapping: HostIpMapping) {
    this.hostIpMapping = hostIpMapping
  }

  setHostIpMappingByFile(hostIpFilePath: string) {
    // hostIpFilePath 格式 :
    // google.com: 142.251.43.14, 142.251.43.15, 142.251.43.16, 142.251.43.17
    // waterballsa.tw: 35.21.35.18, 35.21.35.19, 35.21.35.20

    const hostIpMapping: HostIpMapping = {}
    const lines = fs.readFileSync(hostIpFilePath, 'utf8').split('\n')
    for (const line of lines) {
      const [domain, ip] = line.split(':')
      // ip 要轉換成 ServerEndpoint
      const serverEndpoints: ServerEndpoint[] = ip.split(',').map((ip) => ({
        ip: ip.trim(),
        isAvailable: false,
        retryAt: null,
      }))
      hostIpMapping[domain.trim()] = {
        endpoints: serverEndpoints,
        loadBalancingIndex: -1,
      }
    }
    this.hostIpMapping = hostIpMapping
  }

  setBlacklist(blacklistFilePath: string) {
    // 黑名單 Host（以逗號隔開）
    const blacklist = fs
      .readFileSync(blacklistFilePath, 'utf8')
      .split(',')
      .map((item) => item.trim())
    this.blacklist = blacklist
  }

  sendRequest(request: string): void {
    const httpRequest = parseHttpRequest(request)
    if (this.requestDecorator) {
      this.requestDecorator.request(this, [httpRequest])
    } else {
      const requestDecorator = new RequestDecorator()
      requestDecorator.request(this, [httpRequest])
    }
  }
}
