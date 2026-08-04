import { BaseEvent, type BasePayload } from '../../../BaseEvent'

export class AnswerTimeEndedEvent extends BaseEvent<BasePayload> {
  readonly eventType = 'AnswerTimeEndedEvent'
}
