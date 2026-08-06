import { BaseEvent, type BasePayload } from '../../../BaseEvent'

export type StopBroadcastingPayload = BasePayload & {
  speakerId: string
}

export class StopBroadcastingEvent extends BaseEvent<StopBroadcastingPayload> {
  readonly eventType = 'StopBroadcastingEvent'
}
