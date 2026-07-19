import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { FakeHttpClient } from './domains/FakeHttpClient'
import { RequestDecorator } from './domains/RequestDecorator/RequestDecorator'
import { BlacklistManager } from './domains/RequestDecoratorProcessor/BlacklistManager'
import { LoadBalancing } from './domains/RequestDecoratorProcessor/LoadBalancing'
import { ServiceDiscovery } from './domains/RequestDecoratorProcessor/ServiceDiscovery'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const hostIpFileName = 'hostIpFile.txt'
const blacklistFileFileName = 'blacklistFile.txt'

const hostIpFilePath = path.join(__dirname, hostIpFileName)
const blacklistFilePath = path.join(__dirname, blacklistFileFileName)

// ServiceDiscovery -> LoadBalancing -> BlacklistManager -> RequestDecorator
const requestDecorator = new ServiceDiscovery(
  new LoadBalancing(new BlacklistManager(new RequestDecorator())),
)

// 只有 RequestDecorator
// const requestDecorator = new RequestDecorator()

// BlacklistManager -> LoadBalancing -> ServiceDiscovery -> RequestDecorator
// const requestDecorator = new BlacklistManager(
//   new LoadBalancing(new ServiceDiscovery(new RequestDecorator())),
// )

// BlacklistManager -> LoadBalancing -> ServiceDiscovery -> RequestDecorator
// const requestDecorator = new LoadBalancing(new RequestDecorator())

const httpClient = new FakeHttpClient({
  hostIpFilePath,
  blacklistFilePath,
  requestDecorator,
})

httpClient.sendRequest('http://waterballsa.tw/world')
httpClient.sendRequest('http://waterballsa.tw/hello')
