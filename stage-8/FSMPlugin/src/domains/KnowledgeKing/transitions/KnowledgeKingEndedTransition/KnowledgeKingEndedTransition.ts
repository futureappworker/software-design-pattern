import { Transition } from '../../../../../../FSM/src/index'
import type { BaseEvent } from '../../../BaseEvent'
import { NormalState } from '../../../Normal/NormalState'
import { KnowledgeKingState } from '../../KnowledgeKingState'

export class KnowledgeKingEndedTransition extends Transition<BaseEvent> {
  readonly eventType = 'KnowledgeKingEndedEvent'
  readonly guard = null
  readonly from = KnowledgeKingState.getInstance()
  readonly to = NormalState.getInstance()
  readonly actions = []
}
