import { BaseEvent } from '../../../BaseEvent'

export class OnlineMemberCountChangedEvent extends BaseEvent {
  readonly eventType = 'OnlineMemberCountChangedEvent'
}
