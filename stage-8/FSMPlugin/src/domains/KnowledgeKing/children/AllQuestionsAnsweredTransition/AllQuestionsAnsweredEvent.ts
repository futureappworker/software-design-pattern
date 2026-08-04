import { BaseEvent, type BasePayload } from '../../../BaseEvent'

export class AllQuestionsAnsweredEvent extends BaseEvent<BasePayload> {
  readonly eventType = 'AllQuestionsAnsweredEvent'
}
