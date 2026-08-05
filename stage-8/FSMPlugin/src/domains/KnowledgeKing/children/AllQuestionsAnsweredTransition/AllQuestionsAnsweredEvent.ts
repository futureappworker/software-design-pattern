import { BaseEvent, type BasePayload } from '../../../BaseEvent'

export type AllQuestionsAnsweredEventPayload = BasePayload & {
  winnerMemberId: string | null
}

export class AllQuestionsAnsweredEvent extends BaseEvent<AllQuestionsAnsweredEventPayload> {
  readonly eventType = 'AllQuestionsAnsweredEvent'
}
