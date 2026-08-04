import { Transition } from '../../../../../../FSM/src/index'
import type { BaseEvent } from '../../../BaseEvent'
import { NormalState } from '../../../Normal/NormalState'
import { KnowledgeKingState } from '../../KnowledgeKingState'
import { KingCommandGuard } from './KingCommandGuard'

export class KingCommandTransition extends Transition<BaseEvent> {
  readonly eventType = 'KingCommandEvent'
  readonly guard = new KingCommandGuard()
  readonly from = NormalState.getInstance()
  readonly to = KnowledgeKingState.getInstance()
  readonly actions = []
}
