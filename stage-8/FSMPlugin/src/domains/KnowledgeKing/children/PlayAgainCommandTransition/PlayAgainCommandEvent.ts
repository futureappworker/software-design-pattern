import { BaseEvent, type BasePayload } from '../../../BaseEvent'

export class PlayAgainCommandEvent extends BaseEvent<BasePayload> {
  readonly eventType = 'PlayAgainCommandEvent'
}
