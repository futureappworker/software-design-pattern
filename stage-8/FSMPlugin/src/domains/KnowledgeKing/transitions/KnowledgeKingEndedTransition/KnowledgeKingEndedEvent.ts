import { BaseEvent, type BasePayload } from '../../../BaseEvent'

export class KnowledgeKingEndedEvent extends BaseEvent<BasePayload> {
  readonly eventType = 'KnowledgeKingEndedEvent'
}
