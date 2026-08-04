import { BaseEvent } from '../../../BaseEvent'

export class StopBroadcastingEvent extends BaseEvent {
  readonly eventType = 'StopBroadcastingEvent'
}
