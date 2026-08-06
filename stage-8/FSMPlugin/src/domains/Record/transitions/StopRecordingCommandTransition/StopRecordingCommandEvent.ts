import { BaseEvent, type BasePayload } from '../../../BaseEvent'

export type StopRecordingCommandPayload = BasePayload & {
  memberId: string
}

export class StopRecordingCommandEvent extends BaseEvent<StopRecordingCommandPayload> {
  readonly eventType = 'StopRecordingCommandEvent'
}
