import { BaseEvent, type BasePayload } from '../../../BaseEvent'

export type RecordCommandPayload = BasePayload & {
  memberId: string
}

export class RecordCommandEvent extends BaseEvent<RecordCommandPayload> {
  readonly eventType = 'RecordCommandEvent'
}
