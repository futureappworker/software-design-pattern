import { BaseEvent, type BasePayload } from '../../../BaseEvent'

export type KnowledgeKingEndedPayload = BasePayload & {
  memberId: string
}

export class KnowledgeKingEndedEvent extends BaseEvent<KnowledgeKingEndedPayload> {
  readonly eventType = 'KnowledgeKingEndedEvent'
}
