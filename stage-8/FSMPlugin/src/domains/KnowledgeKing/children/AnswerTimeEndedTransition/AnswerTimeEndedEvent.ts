import { BaseEvent, type BasePayload } from '../../../BaseEvent'

export type AnswerTimeEndedEventPayload = BasePayload & {
  winnerMemberId: string | null
}

export class AnswerTimeEndedEvent extends BaseEvent<AnswerTimeEndedEventPayload> {
  readonly eventType = 'AnswerTimeEndedEvent'
}
