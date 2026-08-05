import { BaseEvent, type BasePayload } from '../../../BaseEvent'

export class AskQuestionEvent extends BaseEvent<BasePayload> {
  readonly eventType = 'AskQuestionEvent'
}
