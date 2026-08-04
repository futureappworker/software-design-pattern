import { BaseEvent, type BasePayload } from '../../../BaseEvent'

export type StopRecordingPayload = BasePayload & {
  memberId: string
}

export class StopRecordingEvent extends BaseEvent<StopRecordingPayload> {
  readonly eventType = 'StopRecordingEvent'
}
