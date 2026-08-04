import { BaseEvent, type BasePayload } from '../../../BaseEvent'

export type KingCommandEventPayload = BasePayload & {
  memberId: string
}

export class KingCommandEvent extends BaseEvent<KingCommandEventPayload> {
  readonly eventType = 'KingCommandEvent'
}
