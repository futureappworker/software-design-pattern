import { BaseEvent, type BasePayload } from '../../../BaseEvent'

export type KingStopCommandPayload = BasePayload & {
  memberId: string
}

export class KingStopCommandEvent extends BaseEvent<KingStopCommandPayload> {
  readonly eventType = 'KingStopCommandEvent'
}
