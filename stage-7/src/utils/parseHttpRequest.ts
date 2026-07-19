import { HttpMethod, type HttpRequest } from '../domains/FakeHttpClient'

export function parseHttpRequest(request: string): HttpRequest {
  const normalizedRequest = request.match(/^https?:\/\//)
    ? request
    : `http://${request}`

  const url = new URL(normalizedRequest)

  return {
    url: normalizedRequest,
    scheme: url.protocol,
    host: url.hostname,
    path: url.pathname,
    httpMethod: HttpMethod.GET,
  }
}
